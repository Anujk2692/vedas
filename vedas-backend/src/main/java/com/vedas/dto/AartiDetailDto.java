package com.vedas.dto;

import java.util.List;

public class AartiDetailDto extends AartiSummaryDto {
    private String pdfUrl;
    private String audioUrl;
    private String videoUrl;
    private int audioDurationSeconds;
    private int videoDurationSeconds;
    private String reciter;
    private List<AartiLineDto> lines;
    private List<AartiRecordingDto> recordings;

    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getAudioDurationSeconds() { return audioDurationSeconds; }
    public void setAudioDurationSeconds(int audioDurationSeconds) { this.audioDurationSeconds = audioDurationSeconds; }
    public int getVideoDurationSeconds() { return videoDurationSeconds; }
    public void setVideoDurationSeconds(int videoDurationSeconds) { this.videoDurationSeconds = videoDurationSeconds; }
    public String getReciter() { return reciter; }
    public void setReciter(String reciter) { this.reciter = reciter; }
    public List<AartiLineDto> getLines() { return lines; }
    public void setLines(List<AartiLineDto> lines) { this.lines = lines; }
    public List<AartiRecordingDto> getRecordings() { return recordings; }
    public void setRecordings(List<AartiRecordingDto> recordings) { this.recordings = recordings; }
}
