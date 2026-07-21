package com.vedas.service;

import com.vedas.config.GitaVerseLoader;
import com.vedas.config.VedaChapterCatalog;
import com.vedas.dto.DailyShlokDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class GitaOfDayService {

    private final GitaVerseLoader gitaVerseLoader;

    public GitaOfDayService(GitaVerseLoader gitaVerseLoader) {
        this.gitaVerseLoader = gitaVerseLoader;
    }

    public DailyShlokDto getToday(String lang) {
        List<VedaChapterCatalog.VerseDef> verses = gitaVerseLoader.allVersesInOrder();
        if (verses.isEmpty()) {
            DailyShlokDto empty = new DailyShlokDto();
            empty.setSanskrit("");
            empty.setTransliteration("");
            empty.setTranslation("Gita verses are still loading.");
            empty.setCommentary("");
            empty.setSource("Bhagavad Gita");
            empty.setScriptureSlug("gita");
            empty.setTheme("Gita");
            return empty;
        }
        int index = Math.floorMod(LocalDate.now().getDayOfYear() - 1, verses.size());
        VedaChapterCatalog.VerseDef verse = verses.get(index);
        boolean hindi = "hi".equalsIgnoreCase(lang);

        DailyShlokDto dto = new DailyShlokDto();
        dto.setSanskrit(verse.sanskrit);
        dto.setTransliteration(verse.transliteration);
        dto.setTranslation(hindi ? verse.hiTranslation : verse.enTranslation);
        dto.setCommentary(hindi ? verse.hiCommentary : verse.enCommentary);
        dto.setSource("Bhagavad Gita " + verse.suktaReference);
        dto.setScriptureSlug("gita");
        dto.setTheme("Gita of the Day");
        return dto;
    }
}
