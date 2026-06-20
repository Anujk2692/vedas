package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "media")
public class MediaAsset {

    @Id
    private String id;
    private String title;
    private MediaType type;
    private String vedaId;
    private String chapterId;
    private String verseId;
    private String url;
    private String thumbnailUrl;
    private int durationSeconds;
    private String languageCode;
    private String reciter;
    private List<LocalizedText> descriptions;
    private boolean featured;

    public enum MediaType {
        AUDIO, VIDEO
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public MediaType getType() { return type; }
    public void setType(MediaType type) { this.type = type; }
    public String getVedaId() { return vedaId; }
    public void setVedaId(String vedaId) { this.vedaId = vedaId; }
    public String getChapterId() { return chapterId; }
    public void setChapterId(String chapterId) { this.chapterId = chapterId; }
    public String getVerseId() { return verseId; }
    public void setVerseId(String verseId) { this.verseId = verseId; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getLanguageCode() { return languageCode; }
    public void setLanguageCode(String languageCode) { this.languageCode = languageCode; }
    public String getReciter() { return reciter; }
    public void setReciter(String reciter) { this.reciter = reciter; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
