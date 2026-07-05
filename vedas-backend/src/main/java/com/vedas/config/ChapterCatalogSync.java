package com.vedas.config;

import com.vedas.model.Chapter;
import com.vedas.model.LocalizedText;
import com.vedas.model.MediaAsset;
import com.vedas.model.Veda;
import com.vedas.model.Verse;
import com.vedas.repository.ChapterRepository;
import com.vedas.repository.MediaRepository;
import com.vedas.repository.VedaRepository;
import com.vedas.repository.VerseRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ChapterCatalogSync {

    private final VedaRepository vedaRepository;
    private final ChapterRepository chapterRepository;
    private final VerseRepository verseRepository;
    private final MediaRepository mediaRepository;
    private final GitaVerseLoader gitaVerseLoader;

    public ChapterCatalogSync(VedaRepository vedaRepository,
                              ChapterRepository chapterRepository,
                              VerseRepository verseRepository,
                              MediaRepository mediaRepository,
                              GitaVerseLoader gitaVerseLoader) {
        this.vedaRepository = vedaRepository;
        this.chapterRepository = chapterRepository;
        this.verseRepository = verseRepository;
        this.mediaRepository = mediaRepository;
        this.gitaVerseLoader = gitaVerseLoader;
    }

    public void syncAll() {
        vedaRepository.findAll().forEach(veda -> {
            List<VedaChapterCatalog.ChapterDef> defs = VedaChapterCatalog.chaptersFor(veda.getSlug());
            if (defs.isEmpty()) {
                return;
            }
            syncVedaChapters(veda, defs);
        });
    }

    private void syncVedaChapters(Veda veda, List<VedaChapterCatalog.ChapterDef> defs) {
        String vedaId = veda.getId();
        String slug = veda.getSlug();
        for (VedaChapterCatalog.ChapterDef def : defs) {
            if ("gita".equals(slug)) {
                List<VedaChapterCatalog.VerseDef> loaded = gitaVerseLoader.versesForChapter(def.number);
                if (!loaded.isEmpty()) {
                    def.verses = loaded;
                }
            }
            Chapter chapter = chapterRepository.findByVedaIdAndNumber(vedaId, def.number)
                    .orElseGet(Chapter::new);
            applyChapterDef(chapter, vedaId, slug, def);
            chapter = chapterRepository.save(chapter);
            syncVerses(vedaId, slug, chapter.getId(), def.number, def.verses);
            syncChapterMedia(veda, chapter, def);
        }
        updateChapterVerseCounts(vedaId);
    }

    private void applyChapterDef(Chapter chapter, String vedaId, String slug, VedaChapterCatalog.ChapterDef def) {
        chapter.setVedaId(vedaId);
        chapter.setNumber(def.number);
        chapter.setSanskritName(def.sanskritName);
        chapter.setTransliteration(def.transliteration);
        chapter.setTitles(lt(def.enTitle, def.hiTitle, def.sanskritName));
        chapter.setSummaries(lt(def.enSummary, def.hiSummary));
        chapter.setOverviews(lt(def.enOverview, def.hiOverview));
        chapter.setDivisionLabels(lt(def.enDivisionLabel, def.hiDivisionLabel));
        chapter.setSuktaCount(def.suktaCount);
        chapter.setMantraCount(def.mantraCount);
        chapter.setAttributedSages(pipe(def.enSages, def.hiSages));
        chapter.setKeyThemes(pipe(def.enThemes, def.hiThemes));
        chapter.setNotableSuktas(pipe(def.enNotable, def.hiNotable));
        chapter.setVerseCount(def.verses.size());
        chapter.setAudioUrl(VedicMediaLibrary.chapterAudioUrl(slug, def.number));
        chapter.setVideoUrl(VedicMediaLibrary.chapterVideoUrl(slug, def.number));
        chapter.setDurationSeconds(VedicMediaLibrary.chapterAudioDuration(slug, def.number));
    }

    private void syncVerses(String vedaId, String slug, String chapterId, int chapterNumber,
                            List<VedaChapterCatalog.VerseDef> defs) {
        for (VedaChapterCatalog.VerseDef def : defs) {
            Verse verse = verseRepository.findByChapterIdAndNumber(chapterId, def.number)
                    .orElseGet(Verse::new);
            verse.setVedaId(vedaId);
            verse.setChapterId(chapterId);
            verse.setNumber(def.number);
            verse.setSuktaReference(def.suktaReference);
            verse.setSanskrit(def.sanskrit);
            verse.setTransliteration(def.transliteration);
            verse.setTranslations(lt(def.enTranslation, def.hiTranslation, def.sanskrit));
            verse.setCommentaries(lt(def.enCommentary, def.hiCommentary));
            verse.setRishis(pipe(def.enRishi, def.hiRishi));
            verse.setAudioUrl(VedicMediaLibrary.verseAudioUrl(slug, chapterNumber, def.number, def.suktaReference));
            verse.setVideoUrl(VedicMediaLibrary.verseVideoUrl(slug, chapterNumber));
            verse.setAudioDurationSeconds(VedicMediaLibrary.verseAudioDuration(slug));
            verseRepository.save(verse);
        }
    }

    private void syncChapterMedia(Veda veda, Chapter chapter, VedaChapterCatalog.ChapterDef def) {
        String slug = veda.getSlug();
        String reciter = VedicMediaLibrary.chapterReciter(slug);
        String pronEn = VedicMediaLibrary.pronunciationDescription(slug);
        String pronHi = pronEn.replace("Traditional", "पारंपरिक").replace("clear Sanskrit", "स्पष्ट संस्कृत");

        upsertMedia(
                veda.getId(),
                chapter.getId(),
                null,
                MediaAsset.MediaType.AUDIO,
                def.enTitle + " — Chanting",
                chapter.getAudioUrl(),
                reciter,
                pronEn,
                pronHi,
                chapter.getDurationSeconds(),
                true);

        upsertMedia(
                veda.getId(),
                chapter.getId(),
                null,
                MediaAsset.MediaType.VIDEO,
                def.enTitle + " — Video Patha",
                chapter.getVideoUrl(),
                "IGNCA Traditional Chanters",
                VedicMediaLibrary.videoDescription(slug),
                "पारंपरिक वैदिक पाठ — स्पष्ट उच्चारण के साथ वीडियो।",
                VedicMediaLibrary.chapterVideoDuration(def.number),
                true);
    }

    private void upsertMedia(String vedaId, String chapterId, String verseId,
                             MediaAsset.MediaType type, String title, String url,
                             String reciter, String enDesc, String hiDesc,
                             int durationSeconds, boolean featured) {
        MediaAsset media = mediaRepository
                .findByVedaIdAndChapterIdAndType(vedaId, chapterId, type)
                .orElseGet(MediaAsset::new);
        media.setTitle(title);
        media.setType(type);
        media.setVedaId(vedaId);
        media.setChapterId(chapterId);
        media.setVerseId(verseId);
        media.setUrl(url);
        media.setThumbnailUrl(thumbnailFor(type, vedaId));
        media.setDurationSeconds(durationSeconds);
        media.setLanguageCode("sa");
        media.setReciter(reciter);
        media.setDescriptions(List.of(
                new LocalizedText("en", enDesc),
                new LocalizedText("hi", hiDesc)));
        media.setFeatured(featured);
        mediaRepository.save(media);
    }

    private String thumbnailFor(MediaAsset.MediaType type, String vedaId) {
        if (type == MediaAsset.MediaType.VIDEO) {
            return "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800";
        }
        return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800";
    }

    private void updateChapterVerseCounts(String vedaId) {
        chapterRepository.findByVedaIdOrderByNumberAsc(vedaId).forEach(ch -> {
            int count = verseRepository.findByChapterIdOrderByNumberAsc(ch.getId()).size();
            if (ch.getVerseCount() != count) {
                ch.setVerseCount(count);
                chapterRepository.save(ch);
            }
        });
    }

    private List<LocalizedText> lt(String en, String hi) {
        return List.of(new LocalizedText("en", en), new LocalizedText("hi", hi), new LocalizedText("sa", en));
    }

    private List<LocalizedText> lt(String en, String hi, String sa) {
        return List.of(new LocalizedText("en", en), new LocalizedText("hi", hi), new LocalizedText("sa", sa));
    }

    private List<LocalizedText> pipe(String en, String hi) {
        List<LocalizedText> list = new ArrayList<>();
        list.add(new LocalizedText("en", en));
        list.add(new LocalizedText("hi", hi));
        return list;
    }
}
