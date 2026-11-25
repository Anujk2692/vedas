package com.vedas.model;

import jakarta.persistence.*;

@Entity
@Table(
        name = "user_bookmarks",
        uniqueConstraints = @UniqueConstraint(name = "uk_device_item", columnNames = {"deviceId", "itemId"})
)
public class UserBookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String deviceId;
    private String itemId;
    private String type;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String sanskrit;
    @Column(columnDefinition = "TEXT")
    private String subtitle;
    private String chapterId;
    private String vedaTitle;
    private long savedAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSanskrit() { return sanskrit; }
    public void setSanskrit(String sanskrit) { this.sanskrit = sanskrit; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getChapterId() { return chapterId; }
    public void setChapterId(String chapterId) { this.chapterId = chapterId; }
    public String getVedaTitle() { return vedaTitle; }
    public void setVedaTitle(String vedaTitle) { this.vedaTitle = vedaTitle; }
    public long getSavedAt() { return savedAt; }
    public void setSavedAt(long savedAt) { this.savedAt = savedAt; }
}
