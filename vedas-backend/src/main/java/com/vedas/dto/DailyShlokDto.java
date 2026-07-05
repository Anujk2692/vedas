package com.vedas.dto;

public class DailyShlokDto {
    private String sanskrit;
    private String transliteration;
    private String translation;
    private String commentary;
    private String source;
    private String scriptureSlug;
    private String theme;

    public String getSanskrit() { return sanskrit; }
    public void setSanskrit(String sanskrit) { this.sanskrit = sanskrit; }
    public String getTransliteration() { return transliteration; }
    public void setTransliteration(String transliteration) { this.transliteration = transliteration; }
    public String getTranslation() { return translation; }
    public void setTranslation(String translation) { this.translation = translation; }
    public String getCommentary() { return commentary; }
    public void setCommentary(String commentary) { this.commentary = commentary; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getScriptureSlug() { return scriptureSlug; }
    public void setScriptureSlug(String scriptureSlug) { this.scriptureSlug = scriptureSlug; }
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
