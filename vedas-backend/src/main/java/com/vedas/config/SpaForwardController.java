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
            "/clarity",
            "/child-names",
            "/search",
            "/aartis",
            "/aartis/**",
            "/chalisas",
            "/chalisas/**",
            "/bhajans",
            "/bhajans/**",
            "/ai-guru",
            "/meditation",
            "/subscription",
            "/kundli",
            "/panchang-muhurat",
            "/puja-booking",
            "/live-consultation",
            "/quiz",
            "/quiz/**",
            "/culture",
            "/culture/**"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
