package com.vedas.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "consultation_sessions")
public class ConsultationSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String accountKey;

    @Column(nullable = false, length = 64)
    private String astrologerId;

    @Column(nullable = false, length = 120)
    private String astrologerName;

    @Column(nullable = false, length = 16)
    private String mode; // CHAT, AUDIO, VIDEO

    @Column(length = 200)
    private String topic;

    @Column(nullable = false, length = 64)
    private String roomCode;

    @Column(nullable = false, length = 24)
    private String status; // LIVE, COMPLETED

    @Column(nullable = false)
    private int amountPaise;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getAccountKey() { return accountKey; }
    public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
    public String getAstrologerId() { return astrologerId; }
    public void setAstrologerId(String astrologerId) { this.astrologerId = astrologerId; }
    public String getAstrologerName() { return astrologerName; }
    public void setAstrologerName(String astrologerName) { this.astrologerName = astrologerName; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public int getAmountPaise() { return amountPaise; }
    public void setAmountPaise(int amountPaise) { this.amountPaise = amountPaise; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
