package com.vedas.dto;

public class StudyPathStepDto {
    private int order;
    private String title;
    private String description;
    private String durationHint;
    private String scriptureSlug;
    private String actionType;

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDurationHint() { return durationHint; }
    public void setDurationHint(String durationHint) { this.durationHint = durationHint; }
    public String getScriptureSlug() { return scriptureSlug; }
    public void setScriptureSlug(String scriptureSlug) { this.scriptureSlug = scriptureSlug; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
}
