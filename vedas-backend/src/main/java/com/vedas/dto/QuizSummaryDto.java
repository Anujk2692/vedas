package com.vedas.dto;

public class QuizSummaryDto {
    private String id;
    private String title;
    private String description;
    private String topicSlug;
    private int questionCount;
    private String level;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getTopicSlug() { return topicSlug; }
    public void setTopicSlug(String topicSlug) { this.topicSlug = topicSlug; }
    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
}
