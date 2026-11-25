package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class TranslateRequestDto {
    @NotBlank(message = "Text is required")
    @Size(max = 500, message = "Text must be at most 500 characters")
    private String text;

    @Size(max = 10, message = "Language code is too long")
    private String lang;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }
}
