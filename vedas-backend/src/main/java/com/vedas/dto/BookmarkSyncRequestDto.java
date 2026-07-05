package com.vedas.dto;

import java.util.List;

public class BookmarkSyncRequestDto {
    private String deviceId;
    private List<BookmarkDto> bookmarks;

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public List<BookmarkDto> getBookmarks() { return bookmarks; }
    public void setBookmarks(List<BookmarkDto> bookmarks) { this.bookmarks = bookmarks; }
}
