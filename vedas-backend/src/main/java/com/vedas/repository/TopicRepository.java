package com.vedas.repository;

import com.vedas.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends MongoRepository<Topic, String> {
    List<Topic> findByActiveTrueOrderByOrderAsc();
    Optional<Topic> findBySlug(String slug);
}
