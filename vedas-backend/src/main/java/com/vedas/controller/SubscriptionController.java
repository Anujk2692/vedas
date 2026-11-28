package com.vedas.controller;

import com.vedas.dto.SubscriptionDtos.*;
import com.vedas.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/status")
    public StatusResponse status(@RequestParam String accountKey) {
        return subscriptionService.getStatus(accountKey);
    }

    @PostMapping("/activate")
    public StatusResponse activate(@Valid @RequestBody ActivateRequest request) {
        return subscriptionService.activate(request);
    }

    @PostMapping("/cancel")
    public StatusResponse cancel(@Valid @RequestBody CancelRequest request) {
        return subscriptionService.cancel(request);
    }

    @PostMapping("/webhook")
    public StatusResponse webhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secret,
            @Valid @RequestBody WebhookRequest request) {
        return subscriptionService.handleWebhook(secret, request);
    }
}
