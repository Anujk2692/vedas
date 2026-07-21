package com.vedas.dto;

import java.util.List;

public class QuizDto {
    private String id;
    private String title;
    private String description;
    private String topicSlug;
    private String level;
    private List<QuizQuestionDto> questions;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTopicSlug() { return topicSlug; }
    public void setTopicSlug(String topicSlug) { this.topicSlug = topicSlug; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public List<QuizQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<QuizQuestionDto> questions) { this.questions = questions; }
}
