package com.vedas.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Lightweight per-IP fixed-window rate limiter for expensive public POST endpoints
 * (/api/sanatan/ask, /api/translate, /api/user/bookmarks/sync).
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 60_000L;
    private static final int MAX_ENTRIES = 10_000;

    private record WindowCounter(long windowStartMs, AtomicInteger count) {}

    private final Map<String, WindowCounter> counters = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        int limit = limitForPath(request.getRequestURI());
        if (limit <= 0) {
            filterChain.doFilter(request, response);
            return;
        }

        if (counters.size() > MAX_ENTRIES) {
            counters.clear();
        }

        String key = clientIp(request) + ":" + request.getRequestURI();
        long now = System.currentTimeMillis();

        WindowCounter counter = counters.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStartMs() >= WINDOW_MS) {
                return new WindowCounter(now, new AtomicInteger(1));
            }
            existing.count().incrementAndGet();
            return existing;
        });

        if (counter.count().get() > limit) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Please wait a minute and try again.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private int limitForPath(String uri) {
        if (uri == null) return 0;
        if (uri.startsWith("/api/sanatan/ask")) return 25;
        if (uri.startsWith("/api/translate")) return 40;
        if (uri.startsWith("/api/user/bookmarks/sync")) return 60;
        return 0;
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr() != null ? request.getRemoteAddr() : "unknown";
    }
}
