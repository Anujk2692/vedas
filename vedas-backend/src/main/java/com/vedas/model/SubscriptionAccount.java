package com.vedas.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "subscription_accounts", indexes = {
        @Index(name = "idx_sub_account_key", columnList = "accountKey", unique = true)
})
public class SubscriptionAccount {

    @Id
    @Column(length = 36)
    private String id = UUID.randomUUID().toString();

    @Column(nullable = false, unique = true, length = 160)
    private String accountKey;

    @Column(nullable = false, length = 32)
    private String planCode = "FREE"; // FREE, MONTHLY, YEARLY, LIFETIME

    @Column(nullable = false, length = 32)
    private String status = "INACTIVE"; // ACTIVE, EXPIRED, CANCELLED, INACTIVE

    @Column(nullable = false, length = 32)
    private String provider = "NONE"; // DEV_SANDBOX, APPLE, GOOGLE, REVENUECAT, RAZORPAY, STRIPE

    @Column(length = 160)
    private String transactionId;

    private boolean sandboxMode = false;

    private Instant activatedAt;
    private Instant expiresAt;
    private Instant updatedAt = Instant.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAccountKey() { return accountKey; }
    public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
    public String getPlanCode() { return planCode; }
    public void setPlanCode(String planCode) { this.planCode = planCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public boolean isSandboxMode() { return sandboxMode; }
    public void setSandboxMode(boolean sandboxMode) { this.sandboxMode = sandboxMode; }
    public Instant getActivatedAt() { return activatedAt; }
    public void setActivatedAt(Instant activatedAt) { this.activatedAt = activatedAt; }
    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
