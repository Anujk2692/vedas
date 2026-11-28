package com.vedas.service;

import com.vedas.dto.SubscriptionDtos.*;
import com.vedas.model.SubscriptionAccount;
import com.vedas.repository.SubscriptionAccountRepository;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Proxy;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

class SubscriptionServiceTest {

    @Test
    void supportsDevSandboxActivationAndCancelAndProductionWebhook() {
        Map<String, SubscriptionAccount> store = new HashMap<>();
        SubscriptionAccountRepository repo = (SubscriptionAccountRepository) Proxy.newProxyInstance(
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

        SubscriptionService service = new SubscriptionService(repo, true, "secret-123");

        StatusResponse initial = service.getStatus("Test@Example.com");
        assertFalse(initial.active());
        assertEquals("FREE", initial.planCode());
        assertTrue(initial.devTestingEnabled());
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
}
