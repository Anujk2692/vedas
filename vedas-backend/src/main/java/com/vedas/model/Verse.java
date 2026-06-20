package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "verses")
public class Verse {

    @Id
    private String id;
    @Indexed
    private String vedaId;
    @Indexed
    private String chapterId;
    private int number;
    private String sanskrit;
    private String transliteration;
    private List<LocalizedText> translations;
    private List<LocalizedText> commentaries;
    private String audioUrl;
    private String videoUrl;
    private int audioDurationSeconds;
    private String suktaReference;
    private List<LocalizedText> rishis;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getVedaId() { return vedaId; }
    public void setVedaId(String vedaId) { this.vedaId = vedaId; }
    public String getChapterId() { return chapterId; }
    public void setChapterId(String chapterId) { this.chapterId = chapterId; }
    public int getNumber() { return number; }
    public void setNumber(int number) { this.number = number; }
    public String getSanskrit() { return sanskrit; }
    public void setSanskrit(String sanskrit) { this.sanskrit = sanskrit; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public List<LocalizedText> getTranslations() { return translations; }
    public void setTranslations(List<LocalizedText> translations) { this.translations = translations; }
    public List<LocalizedText> getCommentaries() { return commentaries; }
    public void setCommentaries(List<LocalizedText> commentaries) { this.commentaries = commentaries; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(int audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
    public String getSuktaReference() { return suktaReference; }
    public void setSuktaReference(String suktaReference) { this.suktaReference = suktaReference; }
    public List<LocalizedText> getRishis() { return rishis; }
    public void setRishis(List<LocalizedText> rishis) { this.rishis = rishis; }
}
