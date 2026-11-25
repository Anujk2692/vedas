package com.vedas.repository;

import com.vedas.model.Verse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VerseRepository extends JpaRepository<Verse, String> {
    List<Verse> findByChapterIdOrderByNumberAsc(String chapterId);
    List<Verse> findByVedaIdOrderByNumberAsc(String vedaId);
    long countByVedaId(String vedaId);
    Optional<Verse> findByChapterIdAndNumber(String chapterId, int number);
}
