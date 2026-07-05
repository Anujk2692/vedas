package com.vedas.service;

import com.vedas.dto.*;
import com.vedas.model.*;
import com.vedas.repository.*;
import com.vedas.util.LocalizationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class VedasService {

    private final LanguageRepository languageRepository;
    private final VedaRepository vedaRepository;
    private final ChapterRepository chapterRepository;
    private final VerseRepository verseRepository;
    private final MediaRepository mediaRepository;
    private final AartisService aartisService;

    public VedasService(
            LanguageRepository languageRepository,
            VedaRepository vedaRepository,
            ChapterRepository chapterRepository,
            VerseRepository verseRepository,
            MediaRepository mediaRepository,
            AartisService aartisService) {
        this.languageRepository = languageRepository;
        this.vedaRepository = vedaRepository;
        this.chapterRepository = chapterRepository;
        this.verseRepository = verseRepository;
        this.mediaRepository = mediaRepository;
        this.aartisService = aartisService;
    }

    public List<LanguageDto> getLanguages() {
        return languageRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(l -> new LanguageDto(l.getId(), l.getCode(), l.getName(), l.getNativeName(), l.getScript(), l.isRtl()))
                .collect(Collectors.toList());
    }

    public List<VedaSummaryDto> getAllVedas(String lang) {
        return vedaRepository.findByActiveTrueOrderByOrderAsc().stream()
                .map(v -> toVedaSummary(v, lang))
                .collect(Collectors.toList());
    }

    public VedaDetailDto getVeda(String idOrSlug, String lang) {
        Veda veda = vedaRepository.findById(idOrSlug)
                .or(() -> vedaRepository.findBySlug(idOrSlug))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veda not found"));
        return toVedaDetail(veda, lang);
    }

    public List<ChapterSummaryDto> getChapters(String vedaIdOrSlug, String lang) {
        Veda veda = resolveVeda(vedaIdOrSlug);
        return chapterRepository.findByVedaIdOrderByNumberAsc(veda.getId()).stream()
                .map(c -> toChapterSummary(c, lang))
                .collect(Collectors.toList());
    }

    public ChapterSummaryDto getChapter(String chapterId, String lang) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Chapter not found"));
        return toChapterSummary(chapter, lang);
    }

    public List<VerseDto> getVerses(String chapterId, String lang) {
        ensureChapterExists(chapterId);
        return verseRepository.findByChapterIdOrderByNumberAsc(chapterId).stream()
                .map(v -> toVerseDto(v, lang))
                .collect(Collectors.toList());
    }

    public VerseDto getVerse(String verseId, String lang) {
        Verse verse = verseRepository.findById(verseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Verse not found"));
        return toVerseDto(verse, lang);
    }

    public List<MediaDto> getFeaturedMedia(String type, String lang) {
        MediaAsset.MediaType mediaType = parseMediaType(type);
        return mediaRepository.findByTypeAndFeaturedTrueOrderByTitleAsc(mediaType).stream()
                .map(m -> toMediaDto(m, lang))
                .collect(Collectors.toList());
    }

    public List<MediaDto> getAllMedia(String type, String lang) {
        MediaAsset.MediaType mediaType = parseMediaType(type);
        return mediaRepository.findByTypeOrderByTitleAsc(mediaType).stream()
                .map(m -> toMediaDto(m, lang))
                .collect(Collectors.toList());
    }

    public List<MediaDto> getMediaByVeda(String vedaIdOrSlug, String type, String lang) {
        Veda veda = resolveVeda(vedaIdOrSlug);
        MediaAsset.MediaType mediaType = parseMediaType(type);
        return mediaRepository.findByVedaIdAndType(veda.getId(), mediaType).stream()
                .map(m -> toMediaDto(m, lang))
                .collect(Collectors.toList());
    }

    public List<MediaDto> getMediaByChapter(String chapterId, String type, String lang) {
        ensureChapterExists(chapterId);
        MediaAsset.MediaType mediaType = parseMediaType(type);
        return mediaRepository.findByChapterIdAndType(chapterId, mediaType).stream()
                .map(m -> toMediaDto(m, lang))
                .collect(Collectors.toList());
    }

    public SearchResultDto search(String query, String lang) {
        if (query == null || query.trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Search query must be at least 2 characters");
        }
        String q = query.trim().toLowerCase(Locale.ROOT);
        SearchResultDto result = new SearchResultDto();

        result.setVedas(vedaRepository.findByActiveTrueOrderByOrderAsc().stream()
                .filter(v -> matchesVeda(v, q, lang))
                .map(v -> toVedaSummary(v, lang))
                .collect(Collectors.toList()));

        result.setChapters(chapterRepository.findAll().stream()
                .filter(c -> matchesChapter(c, q, lang))
                .map(c -> toChapterSummary(c, lang))
                .collect(Collectors.toList()));

        result.setVerses(verseRepository.findAll().stream()
                .filter(v -> matchesVerse(v, q, lang))
                .map(v -> toVerseDto(v, lang))
                .limit(50)
                .collect(Collectors.toList()));

        result.setMedia(mediaRepository.findAll().stream()
                .filter(m -> matchesMedia(m, q, lang))
                .map(m -> toMediaDto(m, lang))
                .limit(20)
                .collect(Collectors.toList()));

        result.setAartis(aartisService.search(q, lang));

        return result;
    }

    private Veda resolveVeda(String idOrSlug) {
        return vedaRepository.findById(idOrSlug)
                .or(() -> vedaRepository.findBySlug(idOrSlug))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Veda not found"));
    }

    private void ensureChapterExists(String chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Chapter not found");
        }
    }

    private MediaAsset.MediaType parseMediaType(String type) {
        try {
            return MediaAsset.MediaType.valueOf(type.toUpperCase(Locale.ROOT));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid media type. Use AUDIO or VIDEO");
        }
    }

    private boolean matchesVeda(Veda v, String q, String lang) {
        return contains(v.getSanskritName(), q)
                || contains(v.getTransliteration(), q)
                || contains(LocalizationUtil.resolve(v.getTitles(), lang), q)
                || LocalizationUtil.anyContains(v.getTitles(), q)
                || LocalizationUtil.anyContains(v.getDescriptions(), q);
    }

    private boolean matchesChapter(Chapter c, String q, String lang) {
        return contains(c.getSanskritName(), q)
                || contains(c.getTransliteration(), q)
                || contains(LocalizationUtil.resolve(c.getTitles(), lang), q)
                || LocalizationUtil.anyContains(c.getTitles(), q)
                || LocalizationUtil.anyContains(c.getSummaries(), q);
    }

    private boolean matchesVerse(Verse v, String q, String lang) {
        return contains(v.getSanskrit(), q)
                || contains(v.getTransliteration(), q)
                || contains(LocalizationUtil.resolve(v.getTranslations(), lang), q)
                || LocalizationUtil.anyContains(v.getTranslations(), q)
                || LocalizationUtil.anyContains(v.getCommentaries(), q);
    }

    private boolean matchesMedia(MediaAsset m, String q, String lang) {
        return contains(m.getTitle(), q)
                || contains(m.getReciter(), q)
                || contains(LocalizationUtil.resolve(m.getDescriptions(), lang), q)
                || LocalizationUtil.anyContains(m.getDescriptions(), q);
    }

    private boolean contains(String value, String q) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(q);
    }

    private VedaSummaryDto toVedaSummary(Veda v, String lang) {
        VedaSummaryDto dto = new VedaSummaryDto();
        dto.setId(v.getId());
        dto.setSlug(v.getSlug());
        dto.setOrder(v.getOrder());
        dto.setScriptureType(v.getScriptureType() != null ? v.getScriptureType() : "VEDA");
        dto.setSanskritName(v.getSanskritName());
        dto.setTransliteration(v.getTransliteration());
        dto.setTitle(LocalizationUtil.resolve(v.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(v.getDescriptions(), lang));
        dto.setCoverImageUrl(v.getCoverImageUrl());
        dto.setChapterCount(v.getChapterCount());
        dto.setVerseCount(v.getVerseCount());
        return dto;
    }

    private VedaDetailDto toVedaDetail(Veda v, String lang) {
        VedaDetailDto dto = new VedaDetailDto();
        dto.setId(v.getId());
        dto.setSlug(v.getSlug());
        dto.setOrder(v.getOrder());
        dto.setScriptureType(v.getScriptureType() != null ? v.getScriptureType() : "VEDA");
        dto.setSanskritName(v.getSanskritName());
        dto.setTransliteration(v.getTransliteration());
        dto.setTitle(LocalizationUtil.resolve(v.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(v.getDescriptions(), lang));
        dto.setCoverImageUrl(v.getCoverImageUrl());
        dto.setChapterCount(v.getChapterCount());
        dto.setVerseCount(v.getVerseCount());
        dto.setOverview(LocalizationUtil.resolve(v.getOverviews(), lang));
        dto.setSignificance(LocalizationUtil.resolve(v.getSignificances(), lang));
        dto.setStructure(LocalizationUtil.resolve(v.getStructures(), lang));
        dto.setHistoricalContext(LocalizationUtil.resolve(v.getHistoricalContexts(), lang));
        dto.setPeriod(LocalizationUtil.resolve(v.getPeriods(), lang));
        dto.setDivisionName(LocalizationUtil.resolve(v.getDivisionNames(), lang));
        dto.setDivisionCount(v.getDivisionCount());
        dto.setMantraCount(v.getMantraCount());
        dto.setCompositionType(LocalizationUtil.resolve(v.getCompositionTypes(), lang));
        dto.setBranches(LocalizationUtil.resolve(v.getBranches(), lang));
        dto.setSpecialFeatures(LocalizationUtil.resolve(v.getSpecialFeatures(), lang));
        dto.setPrimaryDeities(v.getPrimaryDeities() != null ? v.getPrimaryDeities() : Collections.emptyList());
        dto.setKeyThemes(resolvePipeList(v.getKeyThemes(), lang));
        dto.setFamousSages(resolvePipeList(v.getFamousSages(), lang));
        dto.setPhilosophy(LocalizationUtil.resolve(v.getPhilosophies(), lang));
        dto.setRitualsAndPractices(LocalizationUtil.resolve(v.getRitualsAndPractices(), lang));
        dto.setFamousHymns(resolvePipeList(v.getFamousHymns(), lang));
        dto.setLearningGuide(LocalizationUtil.resolve(v.getLearningGuides(), lang));
        dto.setCoreConcepts(resolvePipeList(v.getCoreConcepts(), lang));
        dto.setModernRelevance(LocalizationUtil.resolve(v.getModernRelevance(), lang));
        dto.setRelatedTexts(LocalizationUtil.resolve(v.getRelatedTexts(), lang));
        dto.setPronunciationGuide(LocalizationUtil.resolve(v.getPronunciationGuides(), lang));
        return dto;
    }

    private List<String> resolvePipeList(List<LocalizedText> texts, String lang) {
        String resolved = LocalizationUtil.resolve(texts, lang);
        if (resolved == null || resolved.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(resolved.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private ChapterSummaryDto toChapterSummary(Chapter c, String lang) {
        ChapterSummaryDto dto = new ChapterSummaryDto();
        dto.setId(c.getId());
        dto.setVedaId(c.getVedaId());
        dto.setNumber(c.getNumber());
        dto.setSanskritName(c.getSanskritName());
        dto.setTransliteration(c.getTransliteration());
        dto.setTitle(LocalizationUtil.resolve(c.getTitles(), lang));
        dto.setSummary(LocalizationUtil.resolve(c.getSummaries(), lang));
        dto.setVerseCount(c.getVerseCount());
        dto.setAudioUrl(c.getAudioUrl());
        dto.setVideoUrl(c.getVideoUrl());
        dto.setDurationSeconds(c.getDurationSeconds());
        dto.setOverview(LocalizationUtil.resolve(c.getOverviews(), lang));
        dto.setDivisionLabel(LocalizationUtil.resolve(c.getDivisionLabels(), lang));
        dto.setSuktaCount(c.getSuktaCount());
        dto.setMantraCount(c.getMantraCount());
        dto.setAttributedSages(resolvePipeList(c.getAttributedSages(), lang));
        dto.setKeyThemes(resolvePipeList(c.getKeyThemes(), lang));
        dto.setNotableSuktas(resolvePipeList(c.getNotableSuktas(), lang));
        return dto;
    }

    private VerseDto toVerseDto(Verse v, String lang) {
        VerseDto dto = new VerseDto();
        dto.setId(v.getId());
        dto.setVedaId(v.getVedaId());
        dto.setChapterId(v.getChapterId());
        dto.setNumber(v.getNumber());
        dto.setSanskrit(v.getSanskrit());
        dto.setTransliteration(v.getTransliteration());
        dto.setTranslation(LocalizationUtil.resolve(v.getTranslations(), lang));
        dto.setCommentary(LocalizationUtil.resolve(v.getCommentaries(), lang));
        dto.setAudioUrl(v.getAudioUrl());
        dto.setVideoUrl(v.getVideoUrl());
        dto.setAudioDurationSeconds(v.getAudioDurationSeconds());
        dto.setSuktaReference(v.getSuktaReference());
        dto.setRishi(LocalizationUtil.resolve(v.getRishis(), lang));
        return dto;
    }

    private MediaDto toMediaDto(MediaAsset m, String lang) {
        MediaDto dto = new MediaDto();
        dto.setId(m.getId());
        dto.setTitle(m.getTitle());
        dto.setType(m.getType().name());
        dto.setVedaId(m.getVedaId());
        dto.setChapterId(m.getChapterId());
        dto.setVerseId(m.getVerseId());
        dto.setUrl(m.getUrl());
        dto.setThumbnailUrl(m.getThumbnailUrl());
        dto.setDurationSeconds(m.getDurationSeconds());
        dto.setLanguageCode(m.getLanguageCode());
        dto.setReciter(m.getReciter());
        dto.setDescription(LocalizationUtil.resolve(m.getDescriptions(), lang));
        dto.setFeatured(m.isFeatured());
        return dto;
    }
}
