package com.vedas.repository;

import com.vedas.model.Veda;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface VedaRepository extends MongoRepository<Veda, String> {
    List<Veda> findByActiveTrueOrderByOrderAsc();
    Optional<Veda> findBySlug(String slug);
}
