package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AskRequestDto {
    @NotBlank(message = "Question is required")
    @Size(min = 2, max = 1000, message = "Question must be between 2 and 1000 characters")
    private String question;

    @Size(max = 10, message = "Language code is too long")
    private String lang;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }
}
