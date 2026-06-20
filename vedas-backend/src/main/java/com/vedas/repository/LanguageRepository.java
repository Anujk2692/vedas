package com.vedas.repository;

import com.vedas.model.Language;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LanguageRepository extends MongoRepository<Language, String> {
    List<Language> findByActiveTrueOrderByNameAsc();
    Optional<Language> findByCode(String code);
}
