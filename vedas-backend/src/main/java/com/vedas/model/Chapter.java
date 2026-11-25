package com.vedas.model;

import com.vedas.model.converter.LocalizedTextListConverter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "chapters", indexes = @Index(name = "idx_chapters_veda", columnList = "vedaId"))
public class Chapter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String vedaId;
    @Column(name = "item_number")
    private int number;
    private String sanskritName;
    private String transliteration;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> titles;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> summaries;
    private int verseCount;
    @Column(columnDefinition = "TEXT")
    private String audioUrl;
    @Column(columnDefinition = "TEXT")
    private String videoUrl;
    private int durationSeconds;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> overviews;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> divisionLabels;
    private int suktaCount;
    private int mantraCount;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> attributedSages;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> keyThemes;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> notableSuktas;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVedaId() { return vedaId; }
    public void setVedaId(String vedaId) { this.vedaId = vedaId; }
    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }
    public String getSanskritName() { return sanskritName; }
    public void setSanskritName(String sanskritName) { this.sanskritName = sanskritName; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getSummaries() { return summaries; }
    public void setSummaries(List<LocalizedText> summaries) { this.summaries = summaries; }
    public int getVerseCount() { return verseCount; }
    public void setVerseCount(int verseCount) { this.verseCount = verseCount; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public List<LocalizedText> getOverviews() { return overviews; }
    public void setOverviews(List<LocalizedText> overviews) { this.overviews = overviews; }
    public List<LocalizedText> getDivisionLabels() { return divisionLabels; }
    public void setDivisionLabels(List<LocalizedText> divisionLabels) { this.divisionLabels = divisionLabels; }
    public int getSuktaCount() { return suktaCount; }
    public void setSuktaCount(int suktaCount) { this.suktaCount = suktaCount; }
    public int getMantraCount() { return mantraCount; }
    public void setMantraCount(int mantraCount) { this.mantraCount = mantraCount; }
    public List<LocalizedText> getAttributedSages() { return attributedSages; }
    public void setAttributedSages(List<LocalizedText> attributedSages) { this.attributedSages = attributedSages; }
    public List<LocalizedText> getKeyThemes() { return keyThemes; }
    public void setKeyThemes(List<LocalizedText> keyThemes) { this.keyThemes = keyThemes; }
    public List<LocalizedText> getNotableSuktas() { return notableSuktas; }
    public void setNotableSuktas(List<LocalizedText> notableSuktas) { this.notableSuktas = notableSuktas; }
}
