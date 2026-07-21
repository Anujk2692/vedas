package com.vedas.service;

import com.vedas.config.QuizCatalog;
import com.vedas.dto.QuizDto;
import com.vedas.dto.QuizSummaryDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizService {

    public List<QuizSummaryDto> listQuizzes(String lang) {
        return QuizCatalog.all().stream().map(q -> toSummary(q, lang)).collect(Collectors.toList());
    }

    public QuizDto getQuiz(String id, String lang) {
        return QuizCatalog.all().stream()
                .filter(q -> q.getId().equals(id))
                .findFirst()
                .map(q -> localize(q, lang))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
    }

    private QuizSummaryDto toSummary(QuizDto quiz, String lang) {
        QuizSummaryDto s = new QuizSummaryDto();
        s.setId(quiz.getId());
        s.setTitle(quiz.getTitle());
        s.setDescription(quiz.getDescription());
        s.setTopicSlug(quiz.getTopicSlug());
        s.setLevel(quiz.getLevel());
        s.setQuestionCount(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0);
        return s;
    }

    private QuizDto localize(QuizDto source, String lang) {
        // Content is authored in English for MVP; Hindi UI can still consume EN explanations.
        QuizDto copy = new QuizDto();
        copy.setId(source.getId());
        copy.setTitle(source.getTitle());
        copy.setDescription(source.getDescription());
        copy.setTopicSlug(source.getTopicSlug());
        copy.setLevel(source.getLevel());
        copy.setQuestions(source.getQuestions());
        return copy;
    }
}
