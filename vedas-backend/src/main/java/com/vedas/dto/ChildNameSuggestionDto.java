package com.vedas.dto;

import java.util.List;

public class ChildNameSuggestionDto {
    private String name;
    private String meaning;
    private String combinationSource;
    private String deityConnection;
    private String gender;
    private String religion;
    private String origin;
    private List<String> synonyms;

    public ChildNameSuggestionDto() {}

    public ChildNameSuggestionDto(
            String name,
            String meaning,
            String combinationSource,
            String deityConnection,
            String gender,
            String religion,
            String origin,
            List<String> synonyms) {
        this.name = name;
        this.meaning = meaning;
        this.combinationSource = combinationSource;
        this.deityConnection = deityConnection;
        this.gender = gender;
        this.religion = religion;
        this.origin = origin;
        this.synonyms = synonyms;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    public String getCombinationSource() { return combinationSource; }
    public void setCombinationSource(String combinationSource) { this.combinationSource = combinationSource; }
    public String getDeityConnection() { return deityConnection; }
    public void setDeityConnection(String deityConnection) { this.deityConnection = deityConnection; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public List<String> getSynonyms() { return synonyms; }
    public void setSynonyms(List<String> synonyms) { this.synonyms = synonyms; }
}
