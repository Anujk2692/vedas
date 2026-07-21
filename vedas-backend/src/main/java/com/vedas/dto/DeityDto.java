package com.vedas.dto;

import java.util.List;

public class DeityDto {
    private String slug;
    private String category;
    private String name;
    private String sanskritName;
    private String story;
    private String symbolism;
    private String family;
    private String weapons;
    private String vehicles;
    private List<String> mantras;
    private List<String> festivalSlugs;
    private List<String> templeSlugs;
    private String imageUrl;

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSanskritName() { return sanskritName; }
    public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    public String getSymbolism() { return symbolism; }
    public void setSymbolism(String symbolism) { this.symbolism = symbolism; }
    public String getFamily() { return family; }
    public void setFamily(String family) { this.family = family; }
    public String getWeapons() { return weapons; }
    public void setWeapons(String weapons) { this.weapons = weapons; }
    public String getVehicles() { return vehicles; }
    public void setVehicles(String vehicles) { this.vehicles = vehicles; }
    public List<String> getMantras() { return mantras; }
    public void setMantras(List<String> mantras) { this.mantras = mantras; }
    public List<String> getFestivalSlugs() { return festivalSlugs; }
    public void setFestivalSlugs(List<String> festivalSlugs) { this.festivalSlugs = festivalSlugs; }
    public List<String> getTempleSlugs() { return templeSlugs; }
    public void setTempleSlugs(List<String> templeSlugs) { this.templeSlugs = templeSlugs; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
