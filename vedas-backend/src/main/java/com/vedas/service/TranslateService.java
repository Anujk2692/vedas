package com.vedas.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vedas.dto.TranslateResultDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Locale;
import java.util.Set;

@Service
public class TranslateService {

    private static final int MAX_TEXT_LENGTH = 500;
    private static final Set<String> SUPPORTED_TARGETS = Set.of("en", "hi", "sa");

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TranslateResultDto translate(String text, String targetLang) {
        if (text == null || text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Text is required");
        }

        String trimmed = text.trim();
        if (trimmed.length() > MAX_TEXT_LENGTH) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Text must be at most " + MAX_TEXT_LENGTH + " characters");
        }

        String normalizedTarget = normalizeTargetLanguage(targetLang);
        String sourceLanguage = detectSourceLanguage(trimmed);
        String providerTarget = providerLanguageCode(normalizedTarget);
        String providerSource = providerLanguageCode(sourceLanguage);

        if (providerSource.equals(providerTarget)) {
            TranslateResultDto same = new TranslateResultDto();
            same.setOriginalText(trimmed);
            same.setTranslatedText(trimmed);
            same.setSourceLanguage(sourceLanguage);
            same.setTargetLanguage(normalizedTarget);
            return same;
        }

        try {
            String langPair = providerSource + "|" + providerTarget;
            String url = "https://api.mymemory.translated.net/get?q="
                    + URLEncoder.encode(trimmed, StandardCharsets.UTF_8)
                    + "&langpair=" + langPair;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(12))
                    .header("User-Agent", "VedasApp/1.1 (Spring Boot)")
                    .header("Accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                return gracefulFallback(trimmed, sourceLanguage, normalizedTarget);
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode responseData = root.path("responseData");
            String translated = responseData.path("translatedText").asText("").trim();

            if (translated.isBlank() || translated.equalsIgnoreCase(trimmed)) {
                return gracefulFallback(trimmed, sourceLanguage, normalizedTarget);
            }

            TranslateResultDto result = new TranslateResultDto();
            result.setOriginalText(trimmed);
            result.setTranslatedText(translated);
            result.setSourceLanguage(sourceLanguage);
            result.setTargetLanguage(normalizedTarget);
            return result;
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            return gracefulFallback(trimmed, sourceLanguage, normalizedTarget);
        }
    }

    private TranslateResultDto gracefulFallback(String text, String sourceLanguage, String targetLanguage) {
        TranslateResultDto result = new TranslateResultDto();
        result.setOriginalText(text);
        result.setTranslatedText(text);
        result.setSourceLanguage(sourceLanguage);
        result.setTargetLanguage(targetLanguage);
        return result;
    }

    private String normalizeTargetLanguage(String targetLang) {
        if (targetLang == null || targetLang.isBlank()) {
            return "en";
        }
        String code = targetLang.toLowerCase(Locale.ROOT);
        if (!SUPPORTED_TARGETS.contains(code)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported language. Use en, hi, or sa");
        }
        return code;
    }

    private String providerLanguageCode(String code) {
        return "sa".equals(code) ? "hi" : code;
    }

    private String detectSourceLanguage(String text) {
        int devanagari = 0;
        int latin = 0;

        for (int i = 0; i < text.length(); i++) {
            char ch = text.charAt(i);
            if (Character.isWhitespace(ch) || Character.isDigit(ch)) {
                continue;
            }
            if (ch >= '\u0900' && ch <= '\u097F') {
                devanagari++;
            } else if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) {
                latin++;
            }
        }

        if (devanagari > latin) {
            return "hi";
        }
        return "en";
    }
}
