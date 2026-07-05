package com.vedas.repository;

import com.vedas.model.UserBookmark;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserBookmarkRepository extends MongoRepository<UserBookmark, String> {
    List<UserBookmark> findByDeviceIdOrderBySavedAtDesc(String deviceId);
    void deleteByDeviceId(String deviceId);
}
