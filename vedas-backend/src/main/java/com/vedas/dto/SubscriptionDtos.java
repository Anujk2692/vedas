package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class SubscriptionDtos {

    public record PlanInfo(
            String code,
            String titleEn,
            String titleHi,
            String priceDisplay,
            String billingNoteEn,
            String billingNoteHi,
            int durationDays
    ) {}

    public record StatusResponse(
            String accountKey,
            boolean active,
            String planCode,
            String status,
            String provider,
            boolean sandboxMode,
            boolean devTestingEnabled,
            String expiresAt,
            List<PlanInfo> plans
    ) {}

    public static class ActivateRequest {
        @NotBlank(message = "accountKey is required")
        @Size(max = 160)
        private String accountKey;

        @NotBlank(message = "planCode is required")
        @Size(max = 32)
        private String planCode;

        @Size(max = 32)
        private String provider;

        @Size(max = 160)
        private String transactionId;

        private boolean sandbox;

        public String getAccountKey() { return accountKey; }
        public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
        public String getPlanCode() { return planCode; }
        public void setPlanCode(String planCode) { this.planCode = planCode; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public boolean isSandbox() { return sandbox; }
        public void setSandbox(boolean sandbox) { this.sandbox = sandbox; }
    }

    public static class CancelRequest {
        @NotBlank(message = "accountKey is required")
        @Size(max = 160)
        private String accountKey;

        public String getAccountKey() { return accountKey; }
        public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
    }

    public static class WebhookRequest {
        @NotBlank
        private String accountKey;
        @NotBlank
        private String eventType; // RENEWAL, INITIAL_PURCHASE, CANCELLATION, EXPIRATION
        private String planCode;
        private String provider;
        private String transactionId;
        private boolean sandbox;

        public String getAccountKey() { return accountKey; }
        public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
        public String getEventType() { return eventType; }
        public void setEventType(String eventType) { this.eventType = eventType; }
        public String getPlanCode() { return planCode; }
        public void setPlanCode(String planCode) { this.planCode = planCode; }
        public String getProvider() { return provider; }
        public void setProvider(String provider) { this.provider = provider; }
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public boolean isSandbox() { return sandbox; }
        public void setSandbox(boolean sandbox) { this.sandbox = sandbox; }
    }

    private SubscriptionDtos() {}
}
