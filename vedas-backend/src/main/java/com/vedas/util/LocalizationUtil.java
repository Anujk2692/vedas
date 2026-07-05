package com.vedas.util;

import com.vedas.model.LocalizedText;

import java.util.List;
import java.util.Optional;

public final class LocalizationUtil {

    private LocalizationUtil() {}

    public static String resolve(List<LocalizedText> texts, String languageCode) {
        if (texts == null || texts.isEmpty()) {
            return "";
        }
        Optional<String> exact = texts.stream()
                .filter(t -> languageCode.equalsIgnoreCase(t.getLanguageCode()))
                .map(LocalizedText::getText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst();
        if (exact.isPresent()) {
            return exact.get();
        }
        Optional<String> english = texts.stream()
                .filter(t -> "en".equalsIgnoreCase(t.getLanguageCode()))
                .map(LocalizedText::getText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst();
        if (english.isPresent()) {
            return english.get();
        }
        return texts.stream()
                .map(LocalizedText::getText)
                .filter(text -> text != null && !text.isBlank())
                .findFirst()
                .orElse("");
    }

    public static boolean anyContains(List<LocalizedText> texts, String q) {
        if (texts == null || texts.isEmpty()) {
            return false;
        }
        return texts.stream()
                .map(LocalizedText::getText)
                .anyMatch(text -> text != null && text.toLowerCase().contains(q));
    }
}
