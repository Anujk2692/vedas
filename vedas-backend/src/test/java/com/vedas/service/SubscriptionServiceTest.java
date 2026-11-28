package com.vedas.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vedas.dto.SubscriptionDtos.*;
import com.vedas.model.SubscriptionAccount;
import com.vedas.repository.SubscriptionAccountRepository;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SubscriptionServiceTest {

    private SubscriptionAccountRepository inMemoryRepo() {
        Map<String, SubscriptionAccount> store = new HashMap<>();
        return (SubscriptionAccountRepository) Proxy.newProxyInstance(
                SubscriptionAccountRepository.class.getClassLoader(),
                new Class<?>[]{SubscriptionAccountRepository.class},
                (proxy, method, args) -> switch (method.getName()) {
                    case "findByAccountKeyIgnoreCase" -> Optional.ofNullable(store.get((String) args[0]));
                    case "save" -> {
                        SubscriptionAccount a = (SubscriptionAccount) args[0];
                        store.put(a.getAccountKey(), a);
                        yield a;
                    }
                    default -> null;
                }
        );
    }

    @Test
    void supportsDevSandboxActivationAndCancelAndProductionWebhook() {
        SubscriptionService service = new SubscriptionService(inMemoryRepo(), true, "secret-123");

        StatusResponse initial = service.getStatus("Test@Example.com");
        assertFalse(initial.active());
        assertEquals("FREE", initial.planCode());
        assertTrue(initial.devTestingEnabled());
        assertFalse(initial.razorpayConfigured());
        assertEquals(3, initial.plans().size());

        ActivateRequest devReq = new ActivateRequest();
        devReq.setAccountKey("Test@Example.com");
        devReq.setPlanCode("YEARLY");
        devReq.setSandbox(true);
        StatusResponse active = service.activate(devReq);
        assertTrue(active.active());
        assertEquals("YEARLY", active.planCode());
        assertTrue(active.sandboxMode());

        CancelRequest cancelReq = new CancelRequest();
        cancelReq.setAccountKey("Test@Example.com");
        StatusResponse cancelled = service.cancel(cancelReq);
        assertFalse(cancelled.active());
        assertEquals("FREE", cancelled.planCode());

        WebhookRequest wh = new WebhookRequest();
        wh.setAccountKey("Test@Example.com");
        wh.setEventType("INITIAL_PURCHASE");
        wh.setPlanCode("LIFETIME");
        wh.setProvider("REVENUECAT");
        wh.setTransactionId("rc_tx_100");
        wh.setSandbox(false);
        StatusResponse prod = service.handleWebhook("secret-123", wh);
        assertTrue(prod.active());
        assertEquals("LIFETIME", prod.planCode());
        assertFalse(prod.sandboxMode());
    }

    @Test
    void supportsRazorpayOrderCreationSignatureVerificationAndWebhook() {
        SubscriptionService service = new SubscriptionService(
                inMemoryRepo(),
                true,
                "fallback-secret",
                "rzp_live_12345",
                "rzp_secret_abc",
                "rzp_wh_secret",
                new ObjectMapper(),
                (plan, key, keyId, keySecret) -> "order_test_" + plan.code()
        );

        StatusResponse status = service.getStatus("Anuj@Example.com");
        assertTrue(status.razorpayConfigured());

        RazorpayCreateOrderRequest orderReq = new RazorpayCreateOrderRequest();
        orderReq.setAccountKey("Anuj@Example.com");
        orderReq.setPlanCode("YEARLY");
        RazorpayOrderResponse order = service.createRazorpayOrder(orderReq);
        assertEquals("rzp_live_12345", order.keyId());
        assertEquals("order_test_YEARLY", order.orderId());
        assertEquals(69900, order.amountPaise());

        String validSig = SubscriptionService.hmacSha256Hex("order_test_YEARLY|pay_999", "rzp_secret_abc");
        RazorpayVerifyRequest verifyReq = new RazorpayVerifyRequest();
        verifyReq.setAccountKey("Anuj@Example.com");
        verifyReq.setPlanCode("YEARLY");
        verifyReq.setRazorpayOrderId("order_test_YEARLY");
        verifyReq.setRazorpayPaymentId("pay_999");
        verifyReq.setRazorpaySignature(validSig);

        StatusResponse verified = service.verifyRazorpayPayment(verifyReq);
        assertTrue(verified.active());
        assertEquals("YEARLY", verified.planCode());
        assertEquals("RAZORPAY", verified.provider());
        assertFalse(verified.sandboxMode());

        verifyReq.setRazorpaySignature("tampered_signature");
        assertThrows(ResponseStatusException.class, () -> service.verifyRazorpayPayment(verifyReq));

        String rawWebhook = """
                {
                  "event": "payment.captured",
                  "payload": {
                    "payment": {
                      "entity": {
                        "id": "pay_wh_1",
                        "notes": {
                          "accountKey": "anuj@example.com",
                          "planCode": "LIFETIME"
                        }
                      }
                    }
                  }
                }
                """;
        String whSig = SubscriptionService.hmacSha256Hex(rawWebhook, "rzp_wh_secret");
        StatusResponse whRes = service.handleRazorpayWebhook(whSig, rawWebhook);
        assertTrue(whRes.active());
        assertEquals("LIFETIME", whRes.planCode());
        assertEquals("RAZORPAY", whRes.provider());
    }
}
