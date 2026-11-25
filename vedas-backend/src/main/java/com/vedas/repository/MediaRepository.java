package com.vedas.repository;

import com.vedas.model.MediaAsset;
import com.vedas.model.MediaAsset.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MediaRepository extends JpaRepository<MediaAsset, String> {
    List<MediaAsset> findByTypeAndFeaturedTrueOrderByTitleAsc(MediaType type);
    List<MediaAsset> findByTypeOrderByTitleAsc(MediaType type);
    List<MediaAsset> findByVedaIdAndType(String vedaId, MediaType type);
    List<MediaAsset> findByChapterIdAndType(String chapterId, MediaType type);
    Optional<MediaAsset> findByVedaIdAndChapterIdAndType(String vedaId, String chapterId, MediaType type);
}
