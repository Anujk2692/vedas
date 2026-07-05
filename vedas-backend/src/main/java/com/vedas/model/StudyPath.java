package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "study_paths")
public class StudyPath {

    @Id
    private String id;
    private String slug;
    private int order;
    private String level;
    private String durationLabel;
    private String icon;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private List<StudyPathStep> steps;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDurationLabel() { return durationLabel; }
    public void setDurationLabel(String durationLabel) { this.durationLabel = durationLabel; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public List<StudyPathStep> getSteps() { return steps; }
    public void setSteps(List<StudyPathStep> steps) { this.steps = steps; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
