package com.vedas.controller;

import com.vedas.dto.BookmarkDto;
import com.vedas.dto.BookmarkSyncRequestDto;
import com.vedas.service.UserBookmarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserBookmarkService bookmarkService;

    public UserController(UserBookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping("/bookmarks")
    public List<BookmarkDto> getBookmarks(@RequestParam String deviceId) {
        return bookmarkService.getBookmarks(deviceId);
    }

    @PostMapping("/bookmarks/sync")
    public List<BookmarkDto> syncBookmarks(@RequestBody BookmarkSyncRequestDto request) {
        return bookmarkService.syncBookmarks(request.getDeviceId(), request.getBookmarks());
    }
}
