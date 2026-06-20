package com.vedas.dto;

public class AartiSummaryDto {
    private String id;
    private String slug;
    private int order;
    private String deityType;
    private String sanskritName;
    private String transliteration;
    private String title;
    private String description;
    private String coverImageUrl;
    private boolean hasPdf;
    private boolean hasAudio;
    private boolean hasVideo;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getDeityType() { return deityType; }
    public void setDeityType(String deityType) { this.deityType = deityType; }
    public String getSanskritName() { return sanskritName; }
    public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public boolean isHasPdf() { return hasPdf; }
    public void setHasPdf(boolean hasPdf) { this.hasPdf = hasPdf; }
    public boolean isHasAudio() { return hasAudio; }
    public void setHasAudio(boolean hasAudio) { this.hasAudio = hasAudio; }
    public boolean isHasVideo() { return hasVideo; }
    public void setHasVideo(boolean hasVideo) { this.hasVideo = hasVideo; }
}
