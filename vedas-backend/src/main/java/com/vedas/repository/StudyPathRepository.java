package com.vedas.repository;

import com.vedas.model.StudyPath;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudyPathRepository extends MongoRepository<StudyPath, String> {
    List<StudyPath> findByActiveTrueOrderByOrderAsc();
    Optional<StudyPath> findBySlug(String slug);
}
