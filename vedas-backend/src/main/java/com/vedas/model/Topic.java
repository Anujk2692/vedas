package com.vedas.model;

import com.vedas.model.converter.LocalizedTextListConverter;
import com.vedas.model.converter.StringListConverter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true)
    private String slug;
    @Column(name = "sort_order")
    private int order;
    private String icon;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> titles;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> descriptions;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> summaries;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> simpleExplanations;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> detailedExplanations;
    @Convert(converter = StringListConverter.class)
    @Column(columnDefinition = "TEXT")
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
