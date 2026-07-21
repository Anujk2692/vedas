package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "topics")
public class Topic {

    @Id
    private String id;
    private String slug;
    private int order;
    private String icon;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private List<LocalizedText> summaries;
    private List<LocalizedText> simpleExplanations;
    private List<LocalizedText> detailedExplanations;
    private List<String> relatedScriptureSlugs;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public List<LocalizedText> getSummaries() { return summaries; }
    public void setSummaries(List<LocalizedText> summaries) { this.summaries = summaries; }
    public List<LocalizedText> getSimpleExplanations() { return simpleExplanations; }
    public void setSimpleExplanations(List<LocalizedText> simpleExplanations) { this.simpleExplanations = simpleExplanations; }
    public List<LocalizedText> getDetailedExplanations() { return detailedExplanations; }
    public void setDetailedExplanations(List<LocalizedText> detailedExplanations) { this.detailedExplanations = detailedExplanations; }
    public List<String> getRelatedScriptureSlugs() { return relatedScriptureSlugs; }
    public void setRelatedScriptureSlugs(List<String> relatedScriptureSlugs) { this.relatedScriptureSlugs = relatedScriptureSlugs; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
