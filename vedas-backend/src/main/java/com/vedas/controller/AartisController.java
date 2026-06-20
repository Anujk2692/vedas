package com.vedas.controller;

import com.vedas.dto.AartiDetailDto;
import com.vedas.dto.AartiSummaryDto;
import com.vedas.service.AartisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/aartis")
public class AartisController {

    private final AartisService aartisService;

    public AartisController(AartisService aartisService) {
        this.aartisService = aartisService;
    }

    @GetMapping
    public List<AartiSummaryDto> getAll(@RequestParam(defaultValue = "en") String lang) {
        return aartisService.getAll(lang);
    }

    @GetMapping("/type/{type}")
    public List<AartiSummaryDto> getByType(
            @PathVariable String type,
            @RequestParam(defaultValue = "en") String lang) {
        return aartisService.getByType(type, lang);
    }

    @GetMapping("/{slug}")
    public AartiDetailDto getBySlug(
            @PathVariable String slug,
            @RequestParam(defaultValue = "en") String lang) {
        return aartisService.getBySlug(slug, lang);
    }
}
