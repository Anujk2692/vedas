package com.vedas.service;

import com.vedas.config.AartiCatalog;
import com.vedas.config.AartiMediaLibrary;
import com.vedas.dto.*;
import com.vedas.model.Aarti;
import com.vedas.model.AartiLine;
import com.vedas.model.AartiRecording;
import com.vedas.repository.AartiRepository;
import com.vedas.util.LocalizationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class AartisService {

    private final AartiRepository aartiRepository;

    public AartisService(AartiRepository aartiRepository) {
        this.aartiRepository = aartiRepository;
    }

    public List<AartiSummaryDto> getAll(String lang) {
        return aartiRepository.findByActiveTrueOrderByOrderAsc().stream()
                .map(a -> toSummary(a, lang))
                .collect(Collectors.toList());
    }

    public List<AartiSummaryDto> getByType(String type, String lang) {
        Aarti.DeityType deityType = parseType(type);
        return aartiRepository.findByDeityTypeAndActiveTrueOrderByOrderAsc(deityType).stream()
                .map(a -> toSummary(a, lang))
                .collect(Collectors.toList());
    }

    public AartiDetailDto getBySlug(String slug, String lang) {
        Aarti aarti = aartiRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Aarti not found"));
        return toDetail(aarti, lang);
    }

    public List<AartiSummaryDto> search(String query, String lang) {
        String q = query.trim().toLowerCase(Locale.ROOT);
        return aartiRepository.findByActiveTrueOrderByOrderAsc().stream()
                .filter(a -> matches(a, q, lang))
                .map(a -> toSummary(a, lang))
                .limit(20)
                .collect(Collectors.toList());
    }

    private Aarti.DeityType parseType(String type) {
        try {
            return Aarti.DeityType.valueOf(type.toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid type. Use DEVI or DEVTA");
        }
    }

    private boolean matches(Aarti a, String q, String lang) {
        return contains(a.getSanskritName(), q)
                || contains(a.getTransliteration(), q)
                || contains(a.getSlug(), q)
                || contains(LocalizationUtil.resolve(a.getTitles(), lang), q)
                || LocalizationUtil.anyContains(a.getTitles(), q)
                || LocalizationUtil.anyContains(a.getDescriptions(), q)
                || (a.getLines() != null && a.getLines().stream().anyMatch(line -> matchesLine(line, q, lang)));
    }

    private boolean matchesLine(AartiLine line, String q, String lang) {
        return contains(line.getSanskrit(), q)
                || contains(line.getTransliteration(), q)
                || contains(LocalizationUtil.resolve(line.getTranslations(), lang), q)
                || LocalizationUtil.anyContains(line.getTranslations(), q);
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }

    private AartiSummaryDto toSummary(Aarti a, String lang) {
        AartiSummaryDto dto = new AartiSummaryDto();
        dto.setId(a.getId());
        dto.setSlug(a.getSlug());
        dto.setOrder(a.getOrder());
        dto.setDeityType(a.getDeityType().name());
        dto.setSanskritName(a.getSanskritName());
        dto.setTransliteration(a.getTransliteration());
        dto.setTitle(LocalizationUtil.resolve(a.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(a.getDescriptions(), lang));
        dto.setCoverImageUrl(a.getCoverImageUrl() != null && !a.getCoverImageUrl().isBlank()
                ? a.getCoverImageUrl()
                : AartiMediaLibrary.thumbnailUrl(a.getOrder()));
        dto.setHasPdf(true);
        List<AartiRecording> recordings = AartiMediaLibrary.recordingsFor(a.getSlug());
        dto.setHasAudio(recordings.stream().anyMatch(r -> "AUDIO".equals(r.getType())));
        dto.setHasVideo(recordings.stream().anyMatch(r -> "VIDEO".equals(r.getType())));
        return dto;
    }

    private AartiDetailDto toDetail(Aarti a, String lang) {
        AartiDetailDto dto = new AartiDetailDto();
        AartiSummaryDto summary = toSummary(a, lang);
        dto.setId(summary.getId());
        dto.setSlug(summary.getSlug());
        dto.setOrder(summary.getOrder());
        dto.setDeityType(summary.getDeityType());
        dto.setSanskritName(summary.getSanskritName());
        dto.setTransliteration(summary.getTransliteration());
        dto.setTitle(summary.getTitle());
        dto.setDescription(summary.getDescription());
        dto.setCoverImageUrl(summary.getCoverImageUrl());
        dto.setHasPdf(summary.isHasPdf());
        dto.setHasAudio(summary.isHasAudio());
        dto.setHasVideo(summary.isHasVideo());
        dto.setPdfUrl(AartiMediaLibrary.pdfUrl());
        dto.setAudioUrl(AartiMediaLibrary.primaryAudioUrl(a.getSlug()));
        dto.setVideoUrl(AartiMediaLibrary.primaryVideoUrl(a.getSlug()));
        dto.setAudioDurationSeconds(AartiMediaLibrary.primaryAudioDuration(a.getSlug()));
        dto.setVideoDurationSeconds(AartiMediaLibrary.primaryVideoDuration());
        dto.setReciter(AartiMediaLibrary.primaryReciter(a.getSlug()));
        dto.setLines(resolveLines(a, lang));
        dto.setRecordings(AartiMediaLibrary.recordingsFor(a.getSlug()).stream()
                .map(this::toRecordingDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private List<AartiLineDto> resolveLines(Aarti a, String lang) {
        return AartiCatalog.bySlug(a.getSlug())
                .map(def -> def.lines().stream().map(line -> toLineDto(line, lang)).collect(Collectors.toList()))
                .orElseGet(() -> a.getLines() == null ? List.of()
                        : a.getLines().stream().map(line -> toLineDto(line, lang)).collect(Collectors.toList()));
    }

    private AartiLineDto toLineDto(AartiLine line, String lang) {
        AartiLineDto lineDto = new AartiLineDto();
        lineDto.setSanskrit(line.getSanskrit());
        lineDto.setTransliteration(line.getTransliteration());
        lineDto.setTranslation(LocalizationUtil.resolve(line.getTranslations(), lang));
        return lineDto;
    }

    private AartiRecordingDto toRecordingDto(AartiRecording rec) {
        AartiRecordingDto recDto = new AartiRecordingDto();
        recDto.setId(rec.getId());
        recDto.setType(rec.getType());
        recDto.setTitle(rec.getTitle());
        recDto.setSinger(rec.getSinger());
        recDto.setStyle(rec.getStyle());
        recDto.setUrl(rec.getUrl());
        recDto.setDurationSeconds(rec.getDurationSeconds());
        return recDto;
    }
}
