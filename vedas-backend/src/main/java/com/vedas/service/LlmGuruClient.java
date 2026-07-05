package com.vedas.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/** Optional Krishna-style LLM answers when OpenAI API key is configured. */
@Service
public class LlmGuruClient {

    private static final Logger log = LoggerFactory.getLogger(LlmGuruClient.class);

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final String apiKey;
    private final String model;
    private final boolean enabled;

    public LlmGuruClient(
            ObjectMapper objectMapper,
            @Value("${vedas.ai.openai-api-key:}") String apiKey,
            @Value("${vedas.ai.model:gpt-4o-mini}") String model,
            @Value("${vedas.ai.enabled:false}") boolean enabled) {
        this.objectMapper = objectMapper;
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.model = model;
        this.enabled = enabled && !this.apiKey.isBlank();
        this.httpClient = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();
    }

    public boolean isAvailable() {
        return enabled;
    }

    public String askKrishna(String question, String lang, String scriptureContext) {
        if (!enabled) {
            return null;
        }
        boolean hindi = "hi".equalsIgnoreCase(lang);
        String system = hindi
                ? "आप श्रीकृष्ण हैं — भगवद्गीता, वेद और उपनिषदों के आधार पर संक्षिप्त, कोमल और व्यावहारिक उपदेश दें। केवल हिंदी में उत्तर दें। शास्त्र-आधारित रहें; अनुमान न लगाएँ।"
                : "You are Krishna from the Bhagavad Gita — give concise, compassionate guidance grounded in Gita, Vedas, and Upanishads. Answer in English only. Stay scripture-based.";
        String user = (scriptureContext != null && !scriptureContext.isBlank()
                ? "Context from scriptures:\n" + scriptureContext + "\n\n"
                : "")
                + "Question: " + question;

        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "temperature", 0.6,
                    "max_tokens", 600,
                    "messages", List.of(
                            Map.of("role", "system", "content", system),
                            Map.of("role", "user", "content", user)));

            String json = objectMapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .timeout(Duration.ofSeconds(45))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                log.warn("OpenAI API error: {}", response.statusCode());
                return null;
            }
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode content = root.path("choices").path(0).path("message").path("content");
            if (content.isMissingNode() || content.asText().isBlank()) {
                return null;
            }
            return content.asText().trim();
        } catch (Exception e) {
            log.warn("LLM Guru call failed: {}", e.getMessage());
            return null;
        }
    }
}
