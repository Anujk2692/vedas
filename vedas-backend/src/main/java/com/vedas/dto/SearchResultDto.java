package com.vedas.dto;

import java.util.List;

public class SearchResultDto {
    private List<VedaSummaryDto> vedas;
    private List<ChapterSummaryDto> chapters;
    private List<VerseDto> verses;
    private List<MediaDto> media;
    private List<AartiSummaryDto> aartis;

    public List<VedaSummaryDto> getVedas() { return vedas; }
    public void setVedas(List<VedaSummaryDto> vedas) { this.vedas = vedas; }
    public List<ChapterSummaryDto> getChapters() { return chapters; }
    public void setChapters(List<ChapterSummaryDto> chapters) { this.chapters = chapters; }
    public List<VerseDto> getVerses() { return verses; }
    public void setVerses(List<VerseDto> verses) { this.verses = verses; }
    public List<MediaDto> getMedia() { return media; }
    public void setMedia(List<MediaDto> media) { this.media = media; }
    public List<AartiSummaryDto> getAartis() { return aartis; }
    public void setAartis(List<AartiSummaryDto> aartis) { this.aartis = aartis; }
}
