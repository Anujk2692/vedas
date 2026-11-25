package com.vedas.repository;

import com.vedas.model.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChapterRepository extends JpaRepository<Chapter, String> {
    List<Chapter> findByVedaIdOrderByNumberAsc(String vedaId);
    Optional<Chapter> findByVedaIdAndNumber(String vedaId, int number);
}
