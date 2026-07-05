package com.vedas.dto;

import java.util.List;

public class StudyPathDto {
    private String id;
    private String slug;
    private int order;
    private String level;
    private String durationLabel;
    private String icon;
    private String title;
    private String description;
    private List<StudyPathStepDto> steps;

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
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<StudyPathStepDto> getSteps() { return steps; }
    public void setSteps(List<StudyPathStepDto> steps) { this.steps = steps; }
}
