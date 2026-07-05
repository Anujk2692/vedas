package com.vedas.dto;

import java.util.List;

public class AskResponseDto {
    private String answer;
    private List<VedaSummaryDto> relatedScriptures;
    private List<ChapterSummaryDto> relatedChapters;
    private List<VerseDto> relatedVerses;
    private List<TopicDto> relatedTopics;

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public List<VedaSummaryDto> getRelatedScriptures() { return relatedScriptures; }
    public void setRelatedScriptures(List<VedaSummaryDto> relatedScriptures) { this.relatedScriptures = relatedScriptures; }
    public List<ChapterSummaryDto> getRelatedChapters() { return relatedChapters; }
    public void setRelatedChapters(List<ChapterSummaryDto> relatedChapters) { this.relatedChapters = relatedChapters; }
    public List<VerseDto> getRelatedVerses() { return relatedVerses; }
    public void setRelatedVerses(List<VerseDto> relatedVerses) { this.relatedVerses = relatedVerses; }
    public List<TopicDto> getRelatedTopics() { return relatedTopics; }
    public void setRelatedTopics(List<TopicDto> relatedTopics) { this.relatedTopics = relatedTopics; }
}
