package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "aartis")
public class Aarti {

    public enum DeityType {
        DEVI, DEVTA
    }

    @Id
    private String id;
    @Indexed(unique = true)
    private String slug;
    private int order;
    private DeityType deityType;
    private String sanskritName;
    private String transliteration;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private String coverImageUrl;
    private String pdfUrl;
    private String audioUrl;
    private String videoUrl;
    private int audioDurationSeconds;
    private int videoDurationSeconds;
    private String reciter;
    private List<AartiLine> lines;
    private List<AartiRecording> recordings;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public DeityType getDeityType() { return deityType; }
    public void setDeityType(DeityType deityType) { this.deityType = deityType; }
    public String getSanskritName() { return sanskritName; }
    public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(int audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
    public int getVideoDurationSeconds() { return videoDurationSeconds; }
    public void setVideoDurationSeconds(int videoDurationSeconds) { this.videoDurationSeconds = videoDurationSeconds; }
    public String getReciter() { return reciter; }
    public void setReciter(String reciter) { this.reciter = reciter; }
    public List<AartiLine> getLines() { return lines; }
    public void setLines(List<AartiLine> lines) { this.lines = lines; }
    public List<AartiRecording> getRecordings() { return recordings; }
    public void setRecordings(List<AartiRecording> recordings) { this.recordings = recordings; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
