package com.vedas.model;

public class LocalizedText {
    private String languageCode;
    private String text;

    public LocalizedText() {}

    public LocalizedText(String languageCode, String text) {
        this.languageCode = languageCode;
        this.text = text;
    }

    public String getLanguageCode() { return languageCode; }
    public void setLanguageCode(String languageCode) { this.languageCode = languageCode; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}
