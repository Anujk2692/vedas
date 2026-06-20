package com.vedas.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.mvc.WebContentInterceptor;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        WebContentInterceptor cacheInterceptor = new WebContentInterceptor();
        cacheInterceptor.addCacheMapping(
                CacheControl.maxAge(5, TimeUnit.MINUTES).cachePublic(),
                "/api/vedas/**",
                "/api/aartis/**",
                "/api/media/**",
                "/api/chapters/**",
                "/api/languages"
        );
        registry.addInterceptor(cacheInterceptor);
    }
}
