package com.vedas.dto;

import java.util.List;

public class TopicDto {
    private String id;
    private String slug;
    private int order;
    private String icon;
    private String title;
    private String description;
    private String summary;
    private String simpleExplanation;
    private String detailedExplanation;
    private List<String> relatedScriptureSlugs;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getSimpleExplanation() { return simpleExplanation; }
    public void setSimpleExplanation(String simpleExplanation) { this.simpleExplanation = simpleExplanation; }
    public String getDetailedExplanation() { return detailedExplanation; }
    public void setDetailedExplanation(String detailedExplanation) { this.detailedExplanation = detailedExplanation; }
    public List<String> getRelatedScriptureSlugs() { return relatedScriptureSlugs; }
    public void setRelatedScriptureSlugs(List<String> relatedScriptureSlugs) { this.relatedScriptureSlugs = relatedScriptureSlugs; }
}
