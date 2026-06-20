package com.vedas.repository;

import com.vedas.model.Chapter;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ChapterRepository extends MongoRepository<Chapter, String> {
    List<Chapter> findByVedaIdOrderByNumberAsc(String vedaId);
    Optional<Chapter> findByVedaIdAndNumber(String vedaId, int number);
}
