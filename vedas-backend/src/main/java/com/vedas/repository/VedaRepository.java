package com.vedas.repository;

import com.vedas.model.Veda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VedaRepository extends JpaRepository<Veda, String> {
    List<Veda> findByActiveTrueOrderByOrderAsc();
    Optional<Veda> findBySlug(String slug);
}
