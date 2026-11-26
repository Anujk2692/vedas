package com.vedas.controller;

import com.vedas.config.DevotionalCatalog;
import com.vedas.config.DevotionalCatalog.DevotionalItem;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DevotionalController {

    @GetMapping("/chalisas")
    public List<Map<String, Object>> listChalisas(@RequestParam(defaultValue = "hi") String lang) {
        return DevotionalCatalog.chalisas().stream().map(item -> toSummary(item, lang)).toList();
    }

    @GetMapping("/chalisas/{slug}")
    public Map<String, Object> getChalisa(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        DevotionalItem item = DevotionalCatalog.findChalisa(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chalisa not found"));
        return toDetail(item, lang);
    }

    @GetMapping("/bhajans")
    public List<Map<String, Object>> listBhajans(@RequestParam(defaultValue = "hi") String lang) {
        return DevotionalCatalog.bhajans().stream().map(item -> toSummary(item, lang)).toList();
    }

    @GetMapping("/bhajans/{slug}")
    public Map<String, Object> getBhajan(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        DevotionalItem item = DevotionalCatalog.findBhajan(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bhajan not found"));
        return toDetail(item, lang);
    }

    private Map<String, Object> toSummary(DevotionalItem item, String lang) {
        boolean isHi = "hi".equalsIgnoreCase(lang) || "sa".equalsIgnoreCase(lang);
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("slug", item.slug());
        map.put("kind", item.kind());
        map.put("deity", item.deity());
        map.put("title", isHi ? item.titleHi() : item.titleEn());
        map.put("sanskritName", item.sanskritName());
        map.put("description", isHi ? item.descHi() : item.descEn());
        map.put("lineCount", item.lines().size());
        return map;
    }

    private Map<String, Object> toDetail(DevotionalItem item, String lang) {
        boolean isHi = "hi".equalsIgnoreCase(lang) || "sa".equalsIgnoreCase(lang);
        Map<String, Object> map = toSummary(item, lang);
        List<Map<String, String>> lines = item.lines().stream().map(l -> {
            Map<String, String> row = new LinkedHashMap<>();
            row.put("sanskrit", l.sanskrit());
            row.put("transliteration", l.transliteration());
            row.put("translation", isHi ? l.hi() : l.en());
            return row;
        }).toList();
        map.put("lines", lines);
        return map;
    }
}
