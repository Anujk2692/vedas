package com.vedas.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * SPA fallback for Angular routes — API stays under /api/**.
 */
@Controller
public class SpaForwardController {

    @GetMapping({
            "/",
            "/scriptures",
            "/scriptures/**",
            "/chapter/**",
            "/gyan",
            "/gyan/**",
            "/search",
            "/aartis",
            "/aartis/**",
            "/ai-guru",
            "/meditation"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
