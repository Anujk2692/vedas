package com.vedas.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Loads curated Gita verses from classpath JSON (expandable to full 700). */
@Component
public class GitaVerseLoader {

    private final Map<Integer, List<VedaChapterCatalog.VerseDef>> versesByChapter;

    public GitaVerseLoader(ObjectMapper objectMapper) {
        this.versesByChapter = load(objectMapper);
    }

    public List<VedaChapterCatalog.VerseDef> versesForChapter(int chapterNumber) {
        return versesByChapter.getOrDefault(chapterNumber, List.of());
    }

    public int totalVerseCount() {
        return versesByChapter.values().stream().mapToInt(List::size).sum();
    }

    private static Map<Integer, List<VedaChapterCatalog.VerseDef>> load(ObjectMapper mapper) {
        try (InputStream in = new ClassPathResource("gita/gita-verses.json").getInputStream()) {
            List<GitaVerseRecord> records = mapper.readValue(in, new TypeReference<>() {});
            return records.stream()
                    .collect(Collectors.groupingBy(
                            r -> r.chapter,
                            Collectors.mapping(GitaVerseLoader::toVerseDef, Collectors.toList())));
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }

    private static VedaChapterCatalog.VerseDef toVerseDef(GitaVerseRecord r) {
        VedaChapterCatalog.VerseDef v = new VedaChapterCatalog.VerseDef();
        v.number = r.verse;
        v.sanskrit = r.sa;
        v.transliteration = r.tr != null ? r.tr : "";
        v.enTranslation = r.en;
        v.hiTranslation = r.hi;
        v.enCommentary = r.enCom != null ? r.enCom : "";
        v.hiCommentary = r.hiCom != null ? r.hiCom : "";
        v.suktaReference = r.chapter + "." + r.verse;
        return v;
    }

    static class GitaVerseRecord {
        public int chapter;
        public int verse;
        public String sa;
        public String tr;
        public String en;
        public String hi;
        public String enCom;
        public String hiCom;
    }
}
