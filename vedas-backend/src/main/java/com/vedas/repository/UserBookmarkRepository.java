package com.vedas.repository;

import com.vedas.model.UserBookmark;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBookmarkRepository extends JpaRepository<UserBookmark, String> {
    List<UserBookmark> findByDeviceIdOrderBySavedAtDesc(String deviceId);
    void deleteByDeviceId(String deviceId);
}
