package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "chapters")
public class Chapter {

    @Id
    private String id;
    @Indexed
    private String vedaId;
    private int number;
    private String sanskritName;
    private String transliteration;
    private List<LocalizedText> titles;
    private List<LocalizedText> summaries;
    private int verseCount;
    private String audioUrl;
    private String videoUrl;
    private int durationSeconds;
    private List<LocalizedText> overviews;
    private List<LocalizedText> divisionLabels;
    private int suktaCount;
    private int mantraCount;
    private List<LocalizedText> attributedSages;
    private List<LocalizedText> keyThemes;
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
