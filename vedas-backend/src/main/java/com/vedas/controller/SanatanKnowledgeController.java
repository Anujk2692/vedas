package com.vedas.controller;

import com.vedas.dto.*;
import com.vedas.service.AiGuruService;
import com.vedas.service.DailyShlokService;
import com.vedas.service.PanchangService;
import com.vedas.service.SanatanKnowledgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sanatan")
public class SanatanKnowledgeController {

    private final SanatanKnowledgeService sanatanKnowledgeService;
    private final AiGuruService aiGuruService;
    private final DailyShlokService dailyShlokService;
    private final PanchangService panchangService;

    public SanatanKnowledgeController(SanatanKnowledgeService sanatanKnowledgeService,
                                      AiGuruService aiGuruService,
                                      DailyShlokService dailyShlokService,
                                      PanchangService panchangService) {
        this.sanatanKnowledgeService = sanatanKnowledgeService;
        this.aiGuruService = aiGuruService;
        this.dailyShlokService = dailyShlokService;
        this.panchangService = panchangService;
    }

    @GetMapping("/hub")
    public SanatanHubDto getHub(@RequestParam(defaultValue = "hi") String lang) {
        return sanatanKnowledgeService.getHub(lang);
    }

    @GetMapping("/topics")
    public List<TopicDto> getTopics(@RequestParam(defaultValue = "hi") String lang) {
        return sanatanKnowledgeService.getTopics(lang);
    }

    @GetMapping("/topics/{slug}")
    public TopicDto getTopic(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        return sanatanKnowledgeService.getTopic(slug, lang);
    }

    @GetMapping("/study-paths")
    public List<StudyPathDto> getStudyPaths(@RequestParam(defaultValue = "hi") String lang) {
        return sanatanKnowledgeService.getStudyPaths(lang);
    }

    @GetMapping("/study-paths/{slug}")
    public StudyPathDto getStudyPath(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        return sanatanKnowledgeService.getStudyPath(slug, lang);
    }

    @GetMapping("/resources")
    public List<ExternalResourceDto> getResources(
            @RequestParam(defaultValue = "hi") String lang,
            @RequestParam(required = false) String scriptureSlug,
            @RequestParam(required = false) String topicSlug) {
        return sanatanKnowledgeService.getResources(lang, scriptureSlug, topicSlug);
    }

    @PostMapping("/ask")
    public AskResponseDto ask(@RequestBody AskRequestDto request) {
        String lang = request.getLang() != null ? request.getLang() : "hi";
        return aiGuruService.ask(request.getQuestion(), lang);
    }

    @GetMapping("/daily-shlok")
    public DailyShlokDto getDailyShlok(@RequestParam(defaultValue = "hi") String lang) {
        return dailyShlokService.getToday(lang);
    }

    @GetMapping("/panchang")
    public PanchangDto getPanchang(@RequestParam(defaultValue = "hi") String lang) {
        return panchangService.getToday(lang);
    }
}
