package com.vedas.repository;

import com.vedas.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LanguageRepository extends JpaRepository<Language, String> {
    List<Language> findByActiveTrueOrderByNameAsc();
    Optional<Language> findByCode(String code);
}
