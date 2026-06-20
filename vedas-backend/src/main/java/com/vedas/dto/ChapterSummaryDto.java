package com.vedas.dto;

public class ChapterSummaryDto {
    private String id;
    private String vedaId;
    private int number;
    private String sanskritName;
    private String transliteration;
    private String title;
    private String summary;
    private int verseCount;
    private String audioUrl;
    private String videoUrl;
    private int durationSeconds;
    private String overview;
    private String divisionLabel;
    private int suktaCount;
    private int mantraCount;
    private java.util.List<String> attributedSages;
    private java.util.List<String> keyThemes;
    private java.util.List<String> notableSuktas;

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
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public int getVerseCount() { return verseCount; }
    public void setVerseCount(int verseCount) { this.verseCount = verseCount; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getOverview() { return overview; }
    public void setOverview(String overview) { this.overview = overview; }
    public String getDivisionLabel() { return divisionLabel; }
    public void setDivisionLabel(String divisionLabel) { this.divisionLabel = divisionLabel; }
    public int getSuktaCount() { return suktaCount; }
    public void setSuktaCount(int suktaCount) { this.suktaCount = suktaCount; }
    public int getMantraCount() { return mantraCount; }
    public void setMantraCount(int mantraCount) { this.mantraCount = mantraCount; }
    public java.util.List<String> getAttributedSages() { return attributedSages; }
    public void setAttributedSages(java.util.List<String> attributedSages) { this.attributedSages = attributedSages; }
    public java.util.List<String> getKeyThemes() { return keyThemes; }
    public void setKeyThemes(java.util.List<String> keyThemes) { this.keyThemes = keyThemes; }
    public java.util.List<String> getNotableSuktas() { return notableSuktas; }
    public void setNotableSuktas(java.util.List<String> notableSuktas) { this.notableSuktas = notableSuktas; }
}
