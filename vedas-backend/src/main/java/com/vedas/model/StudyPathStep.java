package com.vedas.model;

import java.util.List;

public class StudyPathStep {

    private int order;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private String durationHint;
    private String scriptureSlug;
    private String actionType;

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public String getDurationHint() { return durationHint; }
    public void setDurationHint(String durationHint) { this.durationHint = durationHint; }
    public String getScriptureSlug() { return scriptureSlug; }
    public void setScriptureSlug(String scriptureSlug) { this.scriptureSlug = scriptureSlug; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
}
