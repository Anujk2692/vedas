package com.vedas.dto;

import java.util.List;

public class ChildNameSuggestionDto {
    private String name;
    private String scriptText;
    private String pronunciation;
    private String meaning;
    private String spiritualSignificance;
    private String combinationSource;
    private String deityConnection;
    private String gender;
    private String religion;
    private String origin;
    private String rashi;
    private String nakshatra;
    private int numerologyNumber;
    private String numerologyTrait;
    private String luckyDay;
    private String luckyColor;
    private List<String> synonyms;

    public ChildNameSuggestionDto() {}

    public ChildNameSuggestionDto(
            String name,
            String scriptText,
            String pronunciation,
            String meaning,
            String spiritualSignificance,
            String combinationSource,
            String deityConnection,
            String gender,
            String religion,
            String origin,
            String rashi,
            String nakshatra,
            int numerologyNumber,
            String numerologyTrait,
            String luckyDay,
            String luckyColor,
            List<String> synonyms) {
        this.name = name;
        this.scriptText = scriptText;
        this.pronunciation = pronunciation;
        this.meaning = meaning;
        this.spiritualSignificance = spiritualSignificance;
        this.combinationSource = combinationSource;
        this.deityConnection = deityConnection;
        this.gender = gender;
        this.religion = religion;
        this.origin = origin;
        this.rashi = rashi;
        this.nakshatra = nakshatra;
        this.numerologyNumber = numerologyNumber;
        this.numerologyTrait = numerologyTrait;
        this.luckyDay = luckyDay;
        this.luckyColor = luckyColor;
        this.synonyms = synonyms;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getScriptText() { return scriptText; }
    public void setScriptText(String scriptText) { this.scriptText = scriptText; }
    public String getPronunciation() { return pronunciation; }
    public void setPronunciation(String pronunciation) { this.pronunciation = pronunciation; }
    public String getMeaning() { return meaning; }
    public void setMeaning(String meaning) { this.meaning = meaning; }
    public String getSpiritualSignificance() { return spiritualSignificance; }
    public void setSpiritualSignificance(String spiritualSignificance) { this.spiritualSignificance = spiritualSignificance; }
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
    public String getRashi() { return rashi; }
    public void setRashi(String rashi) { this.rashi = rashi; }
    public String getNakshatra() { return nakshatra; }
    public void setNakshatra(String nakshatra) { this.nakshatra = nakshatra; }
    public int getNumerologyNumber() { return numerologyNumber; }
    public void setNumerologyNumber(int numerologyNumber) { this.numerologyNumber = numerologyNumber; }
    public String getNumerologyTrait() { return numerologyTrait; }
    public void setNumerologyTrait(String numerologyTrait) { this.numerologyTrait = numerologyTrait; }
    public String getLuckyDay() { return luckyDay; }
    public void setLuckyDay(String luckyDay) { this.luckyDay = luckyDay; }
    public String getLuckyColor() { return luckyColor; }
    public void setLuckyColor(String luckyColor) { this.luckyColor = luckyColor; }
    public List<String> getSynonyms() { return synonyms; }
    public void setSynonyms(List<String> synonyms) { this.synonyms = synonyms; }
}
