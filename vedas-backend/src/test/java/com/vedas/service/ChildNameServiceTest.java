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
        var aarav = res.getSuggestions().stream().filter(s -> "Aarav".equals(s.getName())).findFirst().orElseThrow();
        assertEquals("आरव", aarav.getScriptText());
        assertNotNull(aarav.getRashi());
        assertNotNull(aarav.getNakshatra());
        assertTrue(aarav.getNumerologyNumber() >= 1 && aarav.getNumerologyNumber() <= 9);
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

    @Test
    void prioritizesNamesMatchingStartingLetter() {
        ChildNameRequestDto req = new ChildNameRequestDto();
        req.setFatherName("Anuj");
        req.setMotherName("Priya");
        req.setDeity("Shiva");
        req.setStartingLetter("R");
        req.setLanguage("en");

        ChildNameResponseDto res = service.suggest(req);

        assertFalse(res.getSuggestions().isEmpty());
        assertTrue(res.getSuggestions().get(0).getName().startsWith("R"));
    }
}
