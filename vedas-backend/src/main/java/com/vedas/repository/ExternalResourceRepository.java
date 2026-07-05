package com.vedas.repository;

import com.vedas.model.ExternalResource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ExternalResourceRepository extends MongoRepository<ExternalResource, String> {
    List<ExternalResource> findByActiveTrueOrderByOrderAsc();
    List<ExternalResource> findByScriptureSlugAndActiveTrueOrderByOrderAsc(String scriptureSlug);
    List<ExternalResource> findByTopicSlugAndActiveTrueOrderByOrderAsc(String topicSlug);
    Optional<ExternalResource> findBySlug(String slug);
}
