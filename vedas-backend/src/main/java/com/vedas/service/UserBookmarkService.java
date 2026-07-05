package com.vedas.service;

import com.vedas.dto.BookmarkDto;
import com.vedas.model.UserBookmark;
import com.vedas.repository.UserBookmarkRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserBookmarkService {

    private final UserBookmarkRepository repository;

    public UserBookmarkService(UserBookmarkRepository repository) {
        this.repository = repository;
    }

    public List<BookmarkDto> getBookmarks(String deviceId) {
        validateDeviceId(deviceId);
        return repository.findByDeviceIdOrderBySavedAtDesc(deviceId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<BookmarkDto> syncBookmarks(String deviceId, List<BookmarkDto> incoming) {
        validateDeviceId(deviceId);
        List<BookmarkDto> local = incoming != null ? incoming : List.of();

        Map<String, BookmarkDto> merged = new LinkedHashMap<>();
        for (BookmarkDto remote : repository.findByDeviceIdOrderBySavedAtDesc(deviceId).stream()
                .map(this::toDto).toList()) {
            merged.put(remote.getItemId(), remote);
        }
        for (BookmarkDto item : local) {
            if (item.getItemId() != null && !item.getItemId().isBlank()) {
                merged.put(item.getItemId(), item);
            }
        }

        List<BookmarkDto> result = merged.values().stream()
                .sorted(Comparator.comparingLong(BookmarkDto::getSavedAt).reversed())
                .limit(50)
                .collect(Collectors.toCollection(ArrayList::new));

        repository.deleteByDeviceId(deviceId);
        for (BookmarkDto dto : result) {
            UserBookmark bookmark = new UserBookmark();
            bookmark.setDeviceId(deviceId);
            bookmark.setItemId(dto.getItemId());
            bookmark.setType(dto.getType());
            bookmark.setTitle(dto.getTitle());
            bookmark.setSanskrit(dto.getSanskrit());
            bookmark.setSubtitle(dto.getSubtitle());
            bookmark.setChapterId(dto.getChapterId());
            bookmark.setVedaTitle(dto.getVedaTitle());
            bookmark.setSavedAt(dto.getSavedAt() > 0 ? dto.getSavedAt() : System.currentTimeMillis());
            repository.save(bookmark);
        }
        return result;
    }

    private BookmarkDto toDto(UserBookmark b) {
        BookmarkDto dto = new BookmarkDto();
        dto.setItemId(b.getItemId());
        dto.setType(b.getType());
        dto.setTitle(b.getTitle());
        dto.setSanskrit(b.getSanskrit());
        dto.setSubtitle(b.getSubtitle());
        dto.setChapterId(b.getChapterId());
        dto.setVedaTitle(b.getVedaTitle());
        dto.setSavedAt(b.getSavedAt());
        return dto;
    }

    private void validateDeviceId(String deviceId) {
        if (deviceId == null || deviceId.trim().length() < 8) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Valid deviceId is required");
        }
    }
}
