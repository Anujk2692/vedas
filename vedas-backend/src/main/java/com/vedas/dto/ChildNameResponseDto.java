package com.vedas.dto;

import java.util.List;

public class ChildNameResponseDto {
    private String fatherName;
    private String motherName;
    private String deity;
    private String religion;
    private String country;
    private String language;
    private int totalSuggestions;
    private List<ChildNameSuggestionDto> suggestions;

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }
    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }
    public String getDeity() { return deity; }
    public void setDeity(String deity) { this.deity = deity; }
    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public int getTotalSuggestions() { return totalSuggestions; }
    public void setTotalSuggestions(int totalSuggestions) { this.totalSuggestions = totalSuggestions; }
    public List<ChildNameSuggestionDto> getSuggestions() { return suggestions; }
    public void setSuggestions(List<ChildNameSuggestionDto> suggestions) { this.suggestions = suggestions; }
}
