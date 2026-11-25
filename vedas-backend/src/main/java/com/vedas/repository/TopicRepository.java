package com.vedas.repository;

import com.vedas.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TopicRepository extends JpaRepository<Topic, String> {
    List<Topic> findByActiveTrueOrderByOrderAsc();
    Optional<Topic> findBySlug(String slug);
}
