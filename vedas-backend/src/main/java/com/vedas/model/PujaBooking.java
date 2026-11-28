package com.vedas.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "puja_bookings")
public class PujaBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String accountKey;

    @Column(nullable = false, length = 80)
    private String pujaCode;

    @Column(nullable = false, length = 160)
    private String pujaTitle;

    @Column(nullable = false, length = 160)
    private String templeName;

    @Column(nullable = false, length = 160)
    private String devoteeName;

    @Column(length = 80)
    private String gotra;

    @Column(length = 40)
    private String bookingDate;

    @Column(length = 400)
    private String sankalpNotes;

    @Column(nullable = false)
    private int amountPaise;

    @Column(nullable = false, length = 32)
    private String status;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getAccountKey() { return accountKey; }
    public void setAccountKey(String accountKey) { this.accountKey = accountKey; }
    public String getPujaCode() { return pujaCode; }
    public void setPujaCode(String pujaCode) { this.pujaCode = pujaCode; }
    public String getPujaTitle() { return pujaTitle; }
    public void setPujaTitle(String pujaTitle) { this.pujaTitle = pujaTitle; }
    public String getTempleName() { return templeName; }
    public void setTempleName(String templeName) { this.templeName = templeName; }
    public String getDevoteeName() { return devoteeName; }
    public void setDevoteeName(String devoteeName) { this.devoteeName = devoteeName; }
    public String getGotra() { return gotra; }
    public void setGotra(String gotra) { this.gotra = gotra; }
    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }
    public String getSankalpNotes() { return sankalpNotes; }
    public void setSankalpNotes(String sankalpNotes) { this.sankalpNotes = sankalpNotes; }
    public int getAmountPaise() { return amountPaise; }
    public void setAmountPaise(int amountPaise) { this.amountPaise = amountPaise; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
