package com.vedas.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitFilterTest {

    @Test
    void allowsGetRequestsWithoutRateLimit() throws Exception {
        RateLimitFilter filter = new RateLimitFilter();
        for (int i = 0; i < 100; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("GET", "/api/sanatan/ask");
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(req, res, new MockFilterChain());
            assertEquals(200, res.getStatus());
        }
    }

    @Test
    void blocksExcessivePostRequestsToAskEndpoint() throws Exception {
        RateLimitFilter filter = new RateLimitFilter();
        for (int i = 0; i < 25; i++) {
            MockHttpServletRequest req = new MockHttpServletRequest("POST", "/api/sanatan/ask");
            req.setRemoteAddr("10.1.2.3");
            MockHttpServletResponse res = new MockHttpServletResponse();
            filter.doFilter(req, res, new MockFilterChain());
            assertEquals(200, res.getStatus());
        }

        MockHttpServletRequest blocked = new MockHttpServletRequest("POST", "/api/sanatan/ask");
        blocked.setRemoteAddr("10.1.2.3");
        MockHttpServletResponse blockedRes = new MockHttpServletResponse();
        filter.doFilter(blocked, blockedRes, new MockFilterChain());
        assertEquals(429, blockedRes.getStatus());
        assertTrue(blockedRes.getContentAsString().contains("Too Many Requests"));
    }
}
