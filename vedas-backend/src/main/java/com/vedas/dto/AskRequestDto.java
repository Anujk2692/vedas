package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AskRequestDto {
    @NotBlank(message = "Question is required")
    @Size(min = 2, max = 1000, message = "Question must be between 2 and 1000 characters")
    private String question;

    @Size(max = 10, message = "Language code is too long")
    private String lang;

    @Size(max = 80)
    private String personName;

    @Size(max = 30)
    private String birthDate;

    @Size(max = 20)
    private String birthTime;

    @Size(max = 80)
    private String birthPlace;

    @Size(max = 20)
    private String gender;

    @Size(max = 40)
    private String category;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getLang() { return lang; }
    public void setLang(String lang) { this.lang = lang; }
    public String getPersonName() { return personName; }
    public void setPersonName(String personName) { this.personName = personName; }
    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
    public String getBirthTime() { return birthTime; }
    public void setBirthTime(String birthTime) { this.birthTime = birthTime; }
    public String getBirthPlace() { return birthPlace; }
    public void setBirthPlace(String birthPlace) { this.birthPlace = birthPlace; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
