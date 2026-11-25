package com.vedas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class BookmarkSyncRequestDto {
    @NotBlank(message = "deviceId is required")
    @Size(min = 3, max = 128, message = "deviceId must be between 3 and 128 characters")
    private String deviceId;

    @Size(max = 500, message = "Too many bookmarks in a single sync")
    private List<BookmarkDto> bookmarks;

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public List<BookmarkDto> getBookmarks() { return bookmarks; }
    public void setBookmarks(List<BookmarkDto> bookmarks) { this.bookmarks = bookmarks; }
}
