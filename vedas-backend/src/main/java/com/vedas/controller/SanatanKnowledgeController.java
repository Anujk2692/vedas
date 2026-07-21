package com.vedas.controller;

import com.vedas.dto.*;
import com.vedas.service.AiGuruService;
import com.vedas.service.CultureGuideService;
import com.vedas.service.DailyShlokService;
import com.vedas.service.GitaOfDayService;
import com.vedas.service.PanchangService;
import com.vedas.service.QuizService;
import com.vedas.service.SanatanKnowledgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sanatan")
public class SanatanKnowledgeController {

    private final SanatanKnowledgeService sanatanKnowledgeService;
    private final AiGuruService aiGuruService;
    private final DailyShlokService dailyShlokService;
    private final GitaOfDayService gitaOfDayService;
    private final PanchangService panchangService;
    private final QuizService quizService;
    private final CultureGuideService cultureGuideService;

    public SanatanKnowledgeController(SanatanKnowledgeService sanatanKnowledgeService,
                                      AiGuruService aiGuruService,
                                      DailyShlokService dailyShlokService,
                                      GitaOfDayService gitaOfDayService,
                                      PanchangService panchangService,
                                      QuizService quizService,
                                      CultureGuideService cultureGuideService) {
        this.sanatanKnowledgeService = sanatanKnowledgeService;
        this.aiGuruService = aiGuruService;
        this.dailyShlokService = dailyShlokService;
        this.gitaOfDayService = gitaOfDayService;
        this.panchangService = panchangService;
        this.quizService = quizService;
        this.cultureGuideService = cultureGuideService;
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

    @GetMapping("/gita-of-day")
    public DailyShlokDto getGitaOfDay(@RequestParam(defaultValue = "hi") String lang) {
        return gitaOfDayService.getToday(lang);
    }

    @GetMapping("/panchang")
    public PanchangDto getPanchang(@RequestParam(defaultValue = "hi") String lang) {
        return panchangService.getToday(lang);
    }

    @GetMapping("/quizzes")
    public List<QuizSummaryDto> getQuizzes(@RequestParam(defaultValue = "hi") String lang) {
        return quizService.listQuizzes(lang);
    }

    @GetMapping("/quizzes/{id}")
    public QuizDto getQuiz(@PathVariable String id, @RequestParam(defaultValue = "hi") String lang) {
        return quizService.getQuiz(id, lang);
    }

    @GetMapping("/deities")
    public List<DeityDto> getDeities(@RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.listDeities(lang);
    }

    @GetMapping("/deities/{slug}")
    public DeityDto getDeity(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.getDeity(slug, lang);
    }

    @GetMapping("/temples")
    public List<TempleDto> getTemples(@RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.listTemples(lang);
    }

    @GetMapping("/temples/{slug}")
    public TempleDto getTemple(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.getTemple(slug, lang);
    }

    @GetMapping("/festivals")
    public List<FestivalGuideDto> getFestivals(@RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.listFestivals(lang);
    }

    @GetMapping("/festivals/{slug}")
    public FestivalGuideDto getFestival(@PathVariable String slug, @RequestParam(defaultValue = "hi") String lang) {
        return cultureGuideService.getFestival(slug, lang);
    }
}
