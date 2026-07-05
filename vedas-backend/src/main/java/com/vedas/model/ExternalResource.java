package com.vedas.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "external_resources")
public class ExternalResource {

    public enum ResourceType { PDF, WEB, VIDEO, LIBRARY, YOUTUBE }

    @Id
    private String id;
    private String slug;
    private int order;
    private ResourceType type;
    private String url;
    private String sourceName;
    private List<LocalizedText> titles;
    private List<LocalizedText> descriptions;
    private String scriptureSlug;
    private String topicSlug;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public ResourceType getType() { return type; }
    public void setType(ResourceType type) { this.type = type; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public String getScriptureSlug() { return scriptureSlug; }
    public void setScriptureSlug(String scriptureSlug) { this.scriptureSlug = scriptureSlug; }
    public String getTopicSlug() { return topicSlug; }
    public void setTopicSlug(String topicSlug) { this.topicSlug = topicSlug; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
