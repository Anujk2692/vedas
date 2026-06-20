package com.vedas.config;

import com.vedas.model.Aarti;
import com.vedas.model.LocalizedText;
import com.vedas.repository.AartiRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AartiCatalogSync {

    private final AartiRepository aartiRepository;

    public AartiCatalogSync(AartiRepository aartiRepository) {
        this.aartiRepository = aartiRepository;
    }

    public void syncAll() {
        for (AartiCatalog.AartiDef def : AartiCatalog.all()) {
            Aarti aarti = aartiRepository.findBySlug(def.slug()).orElseGet(Aarti::new);
            applyDef(aarti, def);
            aartiRepository.save(aarti);
        }
    }

    private void applyDef(Aarti aarti, AartiCatalog.AartiDef def) {
        aarti.setSlug(def.slug());
        aarti.setOrder(def.order());
        aarti.setDeityType(def.deityType());
        aarti.setSanskritName(def.sanskritName());
        aarti.setTransliteration(def.transliteration());
        aarti.setTitles(List.of(
                new LocalizedText("en", def.titleEn()),
                new LocalizedText("hi", def.titleHi())
        ));
        aarti.setDescriptions(List.of(
                new LocalizedText("en", def.descEn()),
                new LocalizedText("hi", def.descHi())
        ));
        aarti.setLines(def.lines());
        aarti.setRecordings(AartiMediaLibrary.recordingsFor(def.slug()));
        aarti.setCoverImageUrl(AartiMediaLibrary.thumbnailUrl(def.order()));
        aarti.setPdfUrl(AartiMediaLibrary.pdfUrl());
        aarti.setAudioUrl(AartiMediaLibrary.primaryAudioUrl(def.slug()));
        aarti.setVideoUrl(AartiMediaLibrary.primaryVideoUrl(def.slug()));
        aarti.setAudioDurationSeconds(AartiMediaLibrary.primaryAudioDuration(def.slug()));
        aarti.setVideoDurationSeconds(AartiMediaLibrary.primaryVideoDuration());
        aarti.setReciter(AartiMediaLibrary.primaryReciter(def.slug()));
        aarti.setActive(true);
    }
}
