package com.vedas.dto;

import java.util.List;

public class FestivalGuideDto {
    private String slug;
    private String name;
    private String whenLabel;
    private String why;
    private String story;
    private String rituals;
    private String pujaMethod;
    private String mantras;
    private String bhog;
    private String regionalTraditions;
    private List<String> deitySlugs;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getWhenLabel() { return whenLabel; }
    public void setWhenLabel(String whenLabel) { this.whenLabel = whenLabel; }
    public String getWhy() { return why; }
    public void setWhy(String why) { this.why = why; }
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    public String getRituals() { return rituals; }
    public void setRituals(String rituals) { this.rituals = rituals; }
    public String getPujaMethod() { return pujaMethod; }
    public void setPujaMethod(String pujaMethod) { this.pujaMethod = pujaMethod; }
    public String getMantras() { return mantras; }
    public void setMantras(String mantras) { this.mantras = mantras; }
    public String getBhog() { return bhog; }
    public void setBhog(String bhog) { this.bhog = bhog; }
    public String getRegionalTraditions() { return regionalTraditions; }
    public void setRegionalTraditions(String regionalTraditions) { this.regionalTraditions = regionalTraditions; }
    public List<String> getDeitySlugs() { return deitySlugs; }
    public void setDeitySlugs(List<String> deitySlugs) { this.deitySlugs = deitySlugs; }
}
