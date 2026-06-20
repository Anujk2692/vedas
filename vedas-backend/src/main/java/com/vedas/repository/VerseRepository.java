package com.vedas.repository;

import com.vedas.model.Verse;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VerseRepository extends MongoRepository<Verse, String> {
    List<Verse> findByChapterIdOrderByNumberAsc(String chapterId);
    List<Verse> findByVedaIdOrderByNumberAsc(String vedaId);
    Optional<Verse> findByChapterIdAndNumber(String chapterId, int number);
}
