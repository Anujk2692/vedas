package com.vedas.model;

import com.vedas.model.converter.AartiLineListConverter;
import com.vedas.model.converter.AartiRecordingListConverter;
import com.vedas.model.converter.LocalizedTextListConverter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "aartis")
public class Aarti {

    public enum DeityType {
        DEVI, DEVTA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true, nullable = false)
    private String slug;
    @Column(name = "sort_order")
    private int order;
    @Enumerated(EnumType.STRING)
    private DeityType deityType;
    private String sanskritName;
    private String transliteration;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> titles;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> descriptions;
    @Column(columnDefinition = "TEXT")
    private String coverImageUrl;
    @Column(columnDefinition = "TEXT")
    private String pdfUrl;
    @Column(columnDefinition = "TEXT")
    private String audioUrl;
    @Column(columnDefinition = "TEXT")
    private String videoUrl;
    private int audioDurationSeconds;
    private int videoDurationSeconds;
    private String reciter;
    @Convert(converter = AartiLineListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<AartiLine> lines;
    @Convert(converter = AartiRecordingListConverter.class)
    @Column(columnDefinition = "TEXT")
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
