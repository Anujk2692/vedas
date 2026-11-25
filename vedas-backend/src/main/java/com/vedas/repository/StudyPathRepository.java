package com.vedas.repository;

import com.vedas.model.StudyPath;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyPathRepository extends JpaRepository<StudyPath, String> {
    List<StudyPath> findByActiveTrueOrderByOrderAsc();
    Optional<StudyPath> findBySlug(String slug);
}
