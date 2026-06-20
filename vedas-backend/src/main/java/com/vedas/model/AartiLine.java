package com.vedas.model;

import java.util.List;

public class AartiLine {
    private String sanskrit;
    private String transliteration;
    private List<LocalizedText> translations;

    public AartiLine() {}

    public AartiLine(String sanskrit, String transliteration, List<LocalizedText> translations) {
        this.sanskrit = sanskrit;
        this.transliteration = transliteration;
        this.translations = translations;
    }

    public String getSanskrit() { return sanskrit; }
    public void setSanskrit(String sanskrit) { this.sanskrit = sanskrit; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public List<LocalizedText> getTranslations() { return translations; }
    public void setTranslations(List<LocalizedText> translations) { this.translations = translations; }
}
