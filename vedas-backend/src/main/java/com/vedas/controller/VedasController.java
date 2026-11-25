package com.vedas.controller;

import com.vedas.dto.*;
import com.vedas.service.VedasService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class VedasController {

    private final VedasService vedasService;
    private final DataSource dataSource;

    public VedasController(VedasService vedasService, DataSource dataSource) {
        this.vedasService = vedasService;
        this.dataSource = dataSource;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                body.put("status", "UP");
                body.put("database", "UP");
                return ResponseEntity.ok(body);
            }
        } catch (Exception ignored) {
            // fall through to degraded
        }
        body.put("status", "DEGRADED");
        body.put("database", "DOWN");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    @GetMapping("/languages")
    public List<LanguageDto> getLanguages() {
        return vedasService.getLanguages();
    }

    @GetMapping("/vedas")
    public List<VedaSummaryDto> getVedas(@RequestParam(defaultValue = "en") String lang) {
        return vedasService.getAllVedas(lang);
    }

    @GetMapping("/vedas/{idOrSlug}")
    public VedaDetailDto getVeda(
            @PathVariable String idOrSlug,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getVeda(idOrSlug, lang);
    }

    @GetMapping("/vedas/{vedaId}/chapters")
    public List<ChapterSummaryDto> getChapters(
            @PathVariable String vedaId,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getChapters(vedaId, lang);
    }

    @GetMapping("/chapters/{chapterId}")
    public ChapterSummaryDto getChapter(
            @PathVariable String chapterId,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getChapter(chapterId, lang);
    }

    @GetMapping("/chapters/{chapterId}/verses")
    public List<VerseDto> getVerses(
            @PathVariable String chapterId,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getVerses(chapterId, lang);
    }

    @GetMapping("/verses/{verseId}")
    public VerseDto getVerse(
            @PathVariable String verseId,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getVerse(verseId, lang);
    }

    @GetMapping("/media/featured")
    public List<MediaDto> getFeaturedMedia(
            @RequestParam String type,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getFeaturedMedia(type, lang);
    }

    @GetMapping("/media/all")
    public List<MediaDto> getAllMedia(
            @RequestParam String type,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getAllMedia(type, lang);
    }

    @GetMapping("/vedas/{vedaId}/media")
    public List<MediaDto> getVedaMedia(
            @PathVariable String vedaId,
            @RequestParam String type,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getMediaByVeda(vedaId, type, lang);
    }

    @GetMapping("/chapters/{chapterId}/media")
    public List<MediaDto> getChapterMedia(
            @PathVariable String chapterId,
            @RequestParam String type,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.getMediaByChapter(chapterId, type, lang);
    }

    @GetMapping("/search")
    public SearchResultDto search(
            @RequestParam String q,
            @RequestParam(defaultValue = "en") String lang) {
        return vedasService.search(q, lang);
    }
}
