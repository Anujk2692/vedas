package com.vedas.service;

import com.vedas.dto.SubscriptionDtos.*;
import com.vedas.model.SubscriptionAccount;
import com.vedas.repository.SubscriptionAccountRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;

@Service
public class SubscriptionService {

    private static final List<PlanInfo> PLANS = List.of(
            new PlanInfo("MONTHLY", "Sanatan Plus Monthly", "सनातन प्लस मासिक", "₹99 / month",
                    "All scriptures, AI Guru Jyotish, Aarti/Chalisa/Bhajan & Yoga", "संपूर्ण ग्रंथ, AI गुरु ज्योतिष, आरती/चालीसा/भजन व योग", 30),
            new PlanInfo("YEARLY", "Sanatan Plus Yearly (Best Value)", "सनातन प्लस वार्षिक (सर्वोत्तम)", "₹699 / year",
                    "Save 41% — one subscription for Web, iOS & Android", "41% बचत — Web, iOS व Android के लिए एक सदस्यता", 365),
            new PlanInfo("LIFETIME", "Sanatan Plus Lifetime", "सनातन प्लस आजीवन", "₹1,499 one-time",
                    "Permanent access across all devices", "सभी डिवाइस पर आजीवन अनलॉक", 36500)
    );

    private final SubscriptionAccountRepository repository;
    private final boolean devTestingEnabled;
    private final String webhookSecret;

    public SubscriptionService(
            SubscriptionAccountRepository repository,
            @Value("${vedas.subscription.dev-testing-enabled:true}") boolean devTestingEnabled,
            @Value("${vedas.subscription.webhook-secret:}") String webhookSecret) {
        this.repository = repository;
        this.devTestingEnabled = devTestingEnabled;
        this.webhookSecret = webhookSecret != null ? webhookSecret.trim() : "";
    }

    public StatusResponse getStatus(String rawKey) {
        String key = normalizeKey(rawKey);
        SubscriptionAccount account = repository.findByAccountKeyIgnoreCase(key).orElse(null);
        if (account == null) {
            return new StatusResponse(key, false, "FREE", "INACTIVE", "NONE", false, devTestingEnabled, null, PLANS);
        }
        boolean active = isCurrentlyActive(account);
        if (!active && "ACTIVE".equals(account.getStatus())) {
            account.setStatus("EXPIRED");
            account.setUpdatedAt(Instant.now());
            repository.save(account);
        }
        return toStatus(account, active);
    }

    public StatusResponse activate(ActivateRequest req) {
        String key = normalizeKey(req.getAccountKey());
        String planCode = req.getPlanCode().trim().toUpperCase(Locale.ROOT);
        PlanInfo plan = PLANS.stream()
                .filter(p -> p.code().equals(planCode))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported planCode: " + planCode));

        boolean isSandbox = req.isSandbox() || "DEV_SANDBOX".equalsIgnoreCase(req.getProvider());
        if (isSandbox && !devTestingEnabled) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Developer sandbox activation is disabled in production");
        }
        if (!isSandbox && (req.getTransactionId() == null || req.getTransactionId().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Production activation requires a verified transactionId");
        }

        SubscriptionAccount account = repository.findByAccountKeyIgnoreCase(key).orElseGet(SubscriptionAccount::new);
        account.setAccountKey(key);
        account.setPlanCode(plan.code());
        account.setStatus("ACTIVE");
        account.setProvider(req.getProvider() != null && !req.getProvider().isBlank()
                ? req.getProvider().trim().toUpperCase(Locale.ROOT)
                : (isSandbox ? "DEV_SANDBOX" : "STORE"));
        account.setTransactionId(req.getTransactionId() != null ? req.getTransactionId().trim() : "DEV-" + System.currentTimeMillis());
        account.setSandboxMode(isSandbox);
        Instant now = Instant.now();
        account.setActivatedAt(now);
        account.setExpiresAt(now.plus(plan.durationDays(), ChronoUnit.DAYS));
        account.setUpdatedAt(now);
        repository.save(account);
        return toStatus(account, true);
    }

    public StatusResponse cancel(CancelRequest req) {
        String key = normalizeKey(req.getAccountKey());
        SubscriptionAccount account = repository.findByAccountKeyIgnoreCase(key).orElse(null);
        if (account == null) {
            return new StatusResponse(key, false, "FREE", "INACTIVE", "NONE", false, devTestingEnabled, null, PLANS);
        }
        account.setPlanCode("FREE");
        account.setStatus("CANCELLED");
        account.setExpiresAt(Instant.now());
        account.setUpdatedAt(Instant.now());
        repository.save(account);
        return toStatus(account, false);
    }

    public StatusResponse handleWebhook(String secretHeader, WebhookRequest req) {
        if (!webhookSecret.isBlank() && !webhookSecret.equals(secretHeader)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid webhook secret");
        }
        String evt = req.getEventType().trim().toUpperCase(Locale.ROOT);
        if ("CANCELLATION".equals(evt) || "EXPIRATION".equals(evt)) {
            CancelRequest cancel = new CancelRequest();
            cancel.setAccountKey(req.getAccountKey());
            return cancel(cancel);
        }
        ActivateRequest act = new ActivateRequest();
        act.setAccountKey(req.getAccountKey());
        act.setPlanCode(req.getPlanCode() != null && !req.getPlanCode().isBlank() ? req.getPlanCode() : "MONTHLY");
        act.setProvider(req.getProvider() != null && !req.getProvider().isBlank() ? req.getProvider() : "REVENUECAT");
        act.setTransactionId(req.getTransactionId() != null && !req.getTransactionId().isBlank()
                ? req.getTransactionId() : "WH-" + System.currentTimeMillis());
        act.setSandbox(req.isSandbox());
        return activate(act);
    }

    private boolean isCurrentlyActive(SubscriptionAccount account) {
        if (!"ACTIVE".equals(account.getStatus())) {
            return false;
        }
        return account.getExpiresAt() == null || account.getExpiresAt().isAfter(Instant.now());
    }

    private StatusResponse toStatus(SubscriptionAccount a, boolean active) {
        return new StatusResponse(
                a.getAccountKey(),
                active,
                active ? a.getPlanCode() : "FREE",
                a.getStatus(),
                a.getProvider(),
                a.isSandboxMode(),
                devTestingEnabled,
                a.getExpiresAt() != null ? a.getExpiresAt().toString() : null,
                PLANS
        );
    }

    private String normalizeKey(String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "accountKey is required");
        }
        return rawKey.trim().toLowerCase(Locale.ROOT);
    }
}
