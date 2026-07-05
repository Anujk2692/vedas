package com.vedas.service;

import com.vedas.dto.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

/** Scripture-aware Q&A using search — no external AI key required. */
@Service
public class AiGuruService {

    private final VedasService vedasService;
    private final SanatanKnowledgeService sanatanKnowledgeService;

    public AiGuruService(VedasService vedasService,
                         SanatanKnowledgeService sanatanKnowledgeService) {
        this.vedasService = vedasService;
        this.sanatanKnowledgeService = sanatanKnowledgeService;
    }

    public AskResponseDto ask(String question, String lang) {
        if (question == null || question.trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question must be at least 2 characters");
        }
        String q = question.trim();
        String language = lang != null ? lang : "hi";
        SearchResultDto search = vedasService.search(q, language);

        List<TopicDto> topics = sanatanKnowledgeService.getTopics(language).stream()
                .filter(t -> matchesTopic(t, q))
                .limit(3)
                .collect(Collectors.toList());

        AskResponseDto response = new AskResponseDto();
        response.setRelatedScriptures(limit(search.getVedas(), 5));
        response.setRelatedChapters(limit(search.getChapters(), 5));
        response.setRelatedVerses(limit(search.getVerses(), 8));
        response.setRelatedTopics(topics);
        response.setAnswer(buildAnswer(q, language, search, topics));
        return response;
    }

    private boolean matchesTopic(TopicDto t, String q) {
        String lower = q.toLowerCase(Locale.ROOT);
        return contains(t.getTitle(), lower)
                || contains(t.getDescription(), lower)
                || contains(t.getSlug(), lower);
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }

    private String buildAnswer(String question, String lang, SearchResultDto search, List<TopicDto> topics) {
        boolean hindi = "hi".equalsIgnoreCase(lang);
        StringBuilder sb = new StringBuilder();

        if (!topics.isEmpty()) {
            TopicDto t = topics.get(0);
            sb.append(hindi ? "📿 " : "📿 ").append(t.getTitle()).append("\n\n");
            sb.append(t.getDescription()).append("\n\n");
        }

        if (!search.getVerses().isEmpty()) {
            VerseDto v = search.getVerses().get(0);
            sb.append(hindi ? "🔗 संबंधित श्लोक:\n" : "🔗 Related verse:\n");
            sb.append(v.getSanskrit()).append("\n");
            sb.append(v.getTranslation()).append("\n\n");
        } else if (!search.getChapters().isEmpty()) {
            ChapterSummaryDto c = search.getChapters().get(0);
            sb.append(hindi ? "📖 संबंधित अध्याय: " : "📖 Related chapter: ");
            sb.append(c.getTitle()).append("\n");
            sb.append(c.getSummary()).append("\n\n");
        }

        if (sb.length() == 0) {
            return hindi
                    ? "इस प्रश्न के लिए सीधा उत्तर नहीं मिला। कृपया 'कर्म', 'धर्म', 'गीता' या 'मोक्ष' जैसे शब्दों से खोजें, या Gyan टैब में अध्ययन-पथ देखें।"
                    : "No direct match found. Try searching 'karma', 'dharma', 'Gita', or browse Study Paths in the Gyan tab.";
        }

        sb.append(hindi
                ? "💡 नीचे और संबंधित श्लोक और ग्रंथ देखें। पूर्ण अध्ययन के लिए संबंधित अध्याय पढ़ें।"
                : "💡 See related verses and scriptures below. Read the linked chapter for deeper study.");

        return sb.toString().trim();
    }

    private <T> List<T> limit(List<T> list, int max) {
        if (list == null) {
            return List.of();
        }
        return list.size() <= max ? list : list.subList(0, max);
    }
}
