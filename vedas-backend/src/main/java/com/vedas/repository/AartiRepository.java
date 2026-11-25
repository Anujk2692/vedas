package com.vedas.repository;

import com.vedas.model.Aarti;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AartiRepository extends JpaRepository<Aarti, String> {
    List<Aarti> findByActiveTrueOrderByOrderAsc();
    Optional<Aarti> findBySlug(String slug);
    List<Aarti> findByDeityTypeAndActiveTrueOrderByOrderAsc(Aarti.DeityType deityType);
}
