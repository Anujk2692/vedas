package com.vedas.dto;

import java.util.List;

public class AskRequestDto {
    private String question;
    private String lang;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }
}
