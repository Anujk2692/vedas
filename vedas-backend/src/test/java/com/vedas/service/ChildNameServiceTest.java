package com.vedas.service;

import com.vedas.dto.ChildNameRequestDto;
import com.vedas.dto.ChildNameResponseDto;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChildNameServiceTest {

    private final ChildNameService service = new ChildNameService();

    @Test
    void generatesParentBlendsAndDeitySynonymsInRequestedLanguage() {
        ChildNameRequestDto req = new ChildNameRequestDto();
        req.setFatherName("Anuj");
        req.setMotherName("Priya");
        req.setDeity("Shiva");
        req.setGender("BOY");
        req.setReligion("Hinduism");
        req.setCountry("India");
        req.setLanguage("hi");

        ChildNameResponseDto res = service.suggest(req);

        assertEquals("Anuj", res.getFatherName());
        assertEquals("Priya", res.getMotherName());
        assertEquals("Shiva", res.getDeity());
        assertEquals("hi", res.getLanguage());
        assertTrue(res.getTotalSuggestions() >= 5);
        assertTrue(res.getSuggestions().stream().anyMatch(s -> "Aarav".equals(s.getName())));
        assertTrue(res.getSuggestions().stream().allMatch(s -> s.getMeaning() != null && !s.getMeaning().isBlank()));
    }

    @Test
    void filtersByReligionWhenNonHinduSelected() {
        ChildNameRequestDto req = new ChildNameRequestDto();
        req.setFatherName("Harpreet");
        req.setMotherName("Simran");
        req.setReligion("Sikhism");
        req.setCountry("Canada");
        req.setLanguage("en");

        ChildNameResponseDto res = service.suggest(req);

        assertTrue(res.getSuggestions().stream().anyMatch(s -> "Gurleen".equals(s.getName()) || "Angad".equals(s.getName())));
    }
}
