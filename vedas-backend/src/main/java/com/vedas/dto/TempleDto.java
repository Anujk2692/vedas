package com.vedas.dto;

import java.util.List;

public class TempleDto {
    private String slug;
    private String name;
    private String deitySlug;
    private String location;
    private String history;
    private String importance;
    private String architecture;
    private String timings;
    private List<String> festivalSlugs;
    private String nearby;
    private String virtualTourUrl;
    private String imageUrl;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDeitySlug() { return deitySlug; }
    public void setDeitySlug(String deitySlug) { this.deitySlug = deitySlug; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getHistory() { return history; }
    public void setHistory(String history) { this.history = history; }
    public String getImportance() { return importance; }
    public void setImportance(String importance) { this.importance = importance; }
    public String getArchitecture() { return architecture; }
    public void setArchitecture(String architecture) { this.architecture = architecture; }
    public String getTimings() { return timings; }
    public void setTimings(String timings) { this.timings = timings; }
    public List<String> getFestivalSlugs() { return festivalSlugs; }
    public void setFestivalSlugs(List<String> festivalSlugs) { this.festivalSlugs = festivalSlugs; }
    public String getNearby() { return nearby; }
    public void setNearby(String nearby) { this.nearby = nearby; }
    public String getVirtualTourUrl() { return virtualTourUrl; }
    public void setVirtualTourUrl(String virtualTourUrl) { this.virtualTourUrl = virtualTourUrl; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
