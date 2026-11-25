package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ChildNameRequestDto {

    @NotBlank(message = "Father name is required")
    @Size(min = 2, max = 60, message = "Father name must be between 2 and 60 characters")
    private String fatherName;

    @NotBlank(message = "Mother name is required")
    @Size(min = 2, max = 60, message = "Mother name must be between 2 and 60 characters")
    private String motherName;

    @Size(max = 60, message = "Deity name is too long")
    private String deity;

    @Size(max = 20, message = "Gender is too long")
    private String gender;

    @Size(max = 40, message = "Religion is too long")
    private String religion;

    @Size(max = 50, message = "Country is too long")
    private String country;

    @Size(max = 20, message = "Language is too long")
    private String language;

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }
    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }
    public String getDeity() { return deity; }
    public void setDeity(String deity) { this.deity = deity; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
