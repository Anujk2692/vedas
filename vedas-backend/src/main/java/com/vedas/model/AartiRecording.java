package com.vedas.model;

public class AartiRecording {
    private String id;
    private String type;
    private String title;
    private String singer;
    private String style;
    private String url;
    private int durationSeconds;

    public AartiRecording() {}

    public AartiRecording(String id, String type, String title, String singer, String style, String url, int durationSeconds) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.singer = singer;
        this.style = style;
        this.url = url;
        this.durationSeconds = durationSeconds;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSinger() { return singer; }
    public void setSinger(String singer) { this.singer = singer; }
    public String getStyle() { return style; }
    public void setStyle(String style) { this.style = style; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public int getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(int durationSeconds) { this.durationSeconds = durationSeconds; }
}
