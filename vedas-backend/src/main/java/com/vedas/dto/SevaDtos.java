package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class SevaDtos {

    public record PujaCatalogItem(
            String code,
            String titleEn,
            String titleHi,
            String templeName,
            String deity,
            String benefitsEn,
            String benefitsHi,
            int amountPaise,
            String priceDisplay
    ) {}

    public record TempleAudioItem(
            String id,
            String titleEn,
            String titleHi,
            String templeName,
            String category,
            String streamUrl,
            String durationLabel
    ) {}

    public record SevaCatalogResponse(
            List<PujaCatalogItem> pujas,
            List<TempleAudioItem> templeAudios
    ) {}

    public static class BookPujaRequest {
        @NotBlank @Size(max = 160)
        private String accountKey;
        @NotBlank @Size(max = 80)
        private String pujaCode;
        @NotBlank @Size(max = 160)
        private String devoteeName;
        @Size(max = 80)
        private String gotra;
        @Size(max = 40)
        private String bookingDate;
        @Size(max = 400)
        private String sankalpNotes;

        public String getAccountKey() { return accountKey; }
        public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
        public String getPujaCode() { return pujaCode; }
        public void setPujaCode(String pujaCode) { this.pujaCode = pujaCode; }
        public String getDevoteeName() { return devoteeName; }
        public void setDevoteeName(String devoteeName) { this.devoteeName = devoteeName; }
        public String getGotra() { return gotra; }
        public void setGotra(String gotra) { this.gotra = gotra; }
        public String getBookingDate() { return bookingDate; }
        public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
        public String getSankalpNotes() { return sankalpNotes; }
        public void setSankalpNotes(String sankalpNotes) { this.sankalpNotes = sankalpNotes; }
    }

    public record AstrologerProfile(
            String id,
            String name,
            String specialtyEn,
            String specialtyHi,
            String languages,
            int experienceYears,
            double rating,
            int feePerSessionPaise,
            String feeDisplay,
            boolean online,
            List<String> modes
    ) {}

    public static class BookConsultationRequest {
        @NotBlank @Size(max = 160)
        private String accountKey;
        @NotBlank @Size(max = 64)
        private String astrologerId;
        @NotBlank @Size(max = 16)
        private String mode; // CHAT, AUDIO, VIDEO
        @Size(max = 200)
        private String topic;

        public String getAccountKey() { return accountKey; }
        public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
        public String getAstrologerId() { return astrologerId; }
        public void setAstrologerId(String astrologerId) { this.astrologerId = astrologerId; }
        public String getMode() { return mode; }
        public void setMode(String mode) { this.mode = mode; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
    }

    public record ConsultationSessionView(
            Long id,
            String accountKey,
            String astrologerId,
            String astrologerName,
            String mode,
            String topic,
            String roomCode,
            String joinUrl,
            String status,
            int amountPaise,
            String createdAt
    ) {}

    public static class SendMessageRequest {
        @NotBlank @Size(max = 120)
        private String senderName;
        @NotBlank @Size(max = 2000)
        private String message;

        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    private SevaDtos() {}
}
