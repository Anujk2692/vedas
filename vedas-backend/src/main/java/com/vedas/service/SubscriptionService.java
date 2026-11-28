package com.vedas.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vedas.dto.SubscriptionDtos.*;
import com.vedas.model.SubscriptionAccount;
import com.vedas.repository.SubscriptionAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class SubscriptionService {

    @FunctionalInterface
    interface RazorpayOrderCreator {
        String createOrder(PlanInfo plan, String accountKey, String keyId, String keySecret);
    }

    private static final List<PlanInfo> PLANS = List.of(
            new PlanInfo("MONTHLY", "Sanatan Plus Monthly", "सनातन प्लस मासिक", "₹99 / month",
                    "All scriptures, AI Guru Jyotish, Aarti/Chalisa/Bhajan & Yoga", "संपूर्ण ग्रंथ, AI गुरु ज्योतिष, आरती/चालीसा/भजन व योग", 30, 9900),
            new PlanInfo("YEARLY", "Sanatan Plus Yearly (Best Value)", "सनातन प्लस वार्षिक (सर्वोत्तम)", "₹699 / year",
                    "Save 41% — one subscription for Web, iOS & Android", "41% बचत — Web, iOS व Android के लिए एक सदस्यता", 365, 69900),
            new PlanInfo("LIFETIME", "Sanatan Plus Lifetime", "सनातन प्लस आजीवन", "₹1,499 one-time",
                    "Permanent access across all devices", "सभी डिवाइस पर आजीवन अनलॉक", 36500, 149900)
    );

    private final SubscriptionAccountRepository repository;
    private final boolean devTestingEnabled;
    private final String webhookSecret;
    private final String razorpayKeyId;
    private final String razorpayKeySecret;
    private final String razorpayWebhookSecret;
    private final ObjectMapper objectMapper;
    private final RazorpayOrderCreator razorpayOrderCreator;

    public SubscriptionService(
            SubscriptionAccountRepository repository,
            boolean devTestingEnabled,
            String webhookSecret) {
        this(repository, devTestingEnabled, webhookSecret, "", "", "", new ObjectMapper(), null);
    }

    @Autowired
    public SubscriptionService(
            SubscriptionAccountRepository repository,
            @Value("${vedas.subscription.dev-testing-enabled:true}") boolean devTestingEnabled,
            @Value("${vedas.subscription.webhook-secret:}") String webhookSecret,
            @Value("${vedas.subscription.razorpay.key-id:}") String razorpayKeyId,
            @Value("${vedas.subscription.razorpay.key-secret:}") String razorpayKeySecret,
            @Value("${vedas.subscription.razorpay.webhook-secret:}") String razorpayWebhookSecret,
            ObjectMapper objectMapper) {
        this(repository, devTestingEnabled, webhookSecret, razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret, objectMapper, null);
    }

    SubscriptionService(
            SubscriptionAccountRepository repository,
            boolean devTestingEnabled,
            String webhookSecret,
            String razorpayKeyId,
            String razorpayKeySecret,
            String razorpayWebhookSecret,
            ObjectMapper objectMapper,
            RazorpayOrderCreator customCreator) {
        this.repository = repository;
        this.devTestingEnabled = devTestingEnabled;
        this.webhookSecret = trimSafe(webhookSecret);
        this.razorpayKeyId = trimSafe(razorpayKeyId);
        this.razorpayKeySecret = trimSafe(razorpayKeySecret);
        this.razorpayWebhookSecret = trimSafe(razorpayWebhookSecret);
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
        this.razorpayOrderCreator = customCreator != null ? customCreator : this::createOrderViaHttp;
    }

    public StatusResponse getStatus(String rawKey) {
        String key = normalizeKey(rawKey);
        SubscriptionAccount account = repository.findByAccountKeyIgnoreCase(key).orElse(null);
        if (account == null) {
            return new StatusResponse(key, false, "FREE", "INACTIVE", "NONE", false, devTestingEnabled, isRazorpayConfigured(), null, PLANS);
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
        PlanInfo plan = requirePlan(req.getPlanCode());

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
            return new StatusResponse(key, false, "FREE", "INACTIVE", "NONE", false, devTestingEnabled, isRazorpayConfigured(), null, PLANS);
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

    public RazorpayOrderResponse createRazorpayOrder(RazorpayCreateOrderRequest req) {
        if (!isRazorpayConfigured()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Razorpay is not configured on the server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.");
        }
        String key = normalizeKey(req.getAccountKey());
        PlanInfo plan = requirePlan(req.getPlanCode());
        if (plan.amountPaise() < 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Minimum Razorpay order amount is 100 paise");
        }
        String orderId = razorpayOrderCreator.createOrder(plan, key, razorpayKeyId, razorpayKeySecret);
        return new RazorpayOrderResponse(
                razorpayKeyId,
                orderId,
                plan.amountPaise(),
                "INR",
                plan.code(),
                plan.titleEn(),
                key
        );
    }

    public StatusResponse verifyRazorpayPayment(RazorpayVerifyRequest req) {
        if (!isRazorpayConfigured()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Razorpay is not configured on the server");
        }
        String payload = req.getRazorpayOrderId().trim() + "|" + req.getRazorpayPaymentId().trim();
        String expectedSig = hmacSha256Hex(payload, razorpayKeySecret);
        if (!constantTimeEquals(expectedSig, req.getRazorpaySignature().trim())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Razorpay payment signature");
        }
        ActivateRequest act = new ActivateRequest();
        act.setAccountKey(req.getAccountKey());
        act.setPlanCode(req.getPlanCode());
        act.setProvider("RAZORPAY");
        act.setTransactionId(req.getRazorpayPaymentId().trim());
        act.setSandbox(razorpayKeyId.startsWith("rzp_test_"));
        return activate(act);
    }

    public StatusResponse handleRazorpayWebhook(String signatureHeader, String rawBody) {
        String effectiveSecret = !razorpayWebhookSecret.isBlank() ? razorpayWebhookSecret : webhookSecret;
        if (effectiveSecret.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Razorpay webhook secret is not configured");
        }
        if (signatureHeader == null || signatureHeader.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-Razorpay-Signature header");
        }
        String expectedSig = hmacSha256Hex(rawBody, effectiveSecret);
        if (!constantTimeEquals(expectedSig, signatureHeader.trim())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Razorpay webhook signature");
        }

        try {
            JsonNode root = objectMapper.readTree(rawBody);
            String event = root.path("event").asText("");
            JsonNode paymentEntity = root.path("payload").path("payment").path("entity");
            JsonNode orderEntity = root.path("payload").path("order").path("entity");
            JsonNode notes = paymentEntity.has("notes") ? paymentEntity.path("notes") : orderEntity.path("notes");

            String accountKey = notes.path("accountKey").asText("").trim();
            if (accountKey.isBlank()) {
                accountKey = paymentEntity.path("email").asText("").trim();
            }
            if (accountKey.isBlank()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing accountKey in Razorpay webhook notes");
            }

            if ("refund.processed".equalsIgnoreCase(event) || "payment.failed".equalsIgnoreCase(event)) {
                CancelRequest cancel = new CancelRequest();
                cancel.setAccountKey(accountKey);
                return cancel(cancel);
            }

            String planCode = notes.path("planCode").asText("MONTHLY");
            String paymentId = paymentEntity.path("id").asText("RZP-WH-" + System.currentTimeMillis());

            ActivateRequest act = new ActivateRequest();
            act.setAccountKey(accountKey);
            act.setPlanCode(planCode);
            act.setProvider("RAZORPAY");
            act.setTransactionId(paymentId);
            act.setSandbox(razorpayKeyId.startsWith("rzp_test_"));
            return activate(act);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid Razorpay webhook payload", ex);
        }
    }

    private String createOrderViaHttp(PlanInfo plan, String accountKey, String keyId, String keySecret) {
        try {
            String auth = Base64.getEncoder().encodeToString((keyId + ":" + keySecret).getBytes(StandardCharsets.UTF_8));
            Map<String, Object> body = Map.of(
                    "amount", plan.amountPaise(),
                    "currency", "INR",
                    "receipt", "sanatan_" + plan.code().toLowerCase(Locale.ROOT) + "_" + System.currentTimeMillis(),
                    "notes", Map.of(
                            "accountKey", accountKey,
                            "planCode", plan.code()
                    )
            );
            String json = objectMapper.writeValueAsString(body);
            HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(10)).build();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.razorpay.com/v1/orders"))
                    .timeout(Duration.ofSeconds(15))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() == 401) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Razorpay authentication failed (check RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET)");
            }
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay order creation failed (" + response.statusCode() + ")");
            }
            JsonNode node = objectMapper.readTree(response.body());
            String orderId = node.path("id").asText("");
            if (orderId.isBlank()) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay did not return an order id");
            }
            return orderId;
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to contact Razorpay Orders API", ex);
        }
    }

    static String hmacSha256Hex(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(raw.length * 2);
            for (byte b : raw) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to compute HMAC-SHA256", ex);
        }
    }

    private static boolean constantTimeEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }

    private boolean isRazorpayConfigured() {
        return !razorpayKeyId.isBlank() && !razorpayKeySecret.isBlank();
    }

    private PlanInfo requirePlan(String rawPlanCode) {
        String planCode = rawPlanCode.trim().toUpperCase(Locale.ROOT);
        return PLANS.stream()
                .filter(p -> p.code().equals(planCode))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported planCode: " + planCode));
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
                isRazorpayConfigured(),
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

    private static String trimSafe(String val) {
        return val != null ? val.trim() : "";
    }
}
