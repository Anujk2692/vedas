package com.vedas.service;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;

class TranslateServiceTest {

    private final TranslateService service = new TranslateService();

    @Test
    void rejectsBlankText() {
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.translate("   ", "hi")
        );
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void rejectsOverlongText() {
        String longText = "a".repeat(501);
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.translate(longText, "hi")
        );
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void rejectsUnsupportedTargetLanguage() {
        ResponseStatusException ex = assertThrows(
                ResponseStatusException.class,
                () -> service.translate("Hello world", "fr")
        );
        assertEquals(400, ex.getStatusCode().value());
    }

    @Test
    void returnsSameTextWhenSourceMatchesTarget() {
        var result = service.translate("Peace and clarity", "en");
        assertEquals("Peace and clarity", result.getTranslatedText());
        assertEquals("en", result.getSourceLanguage());
        assertEquals("en", result.getTargetLanguage());
    }
}
