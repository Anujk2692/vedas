package com.vedas.model;

import com.vedas.model.converter.LocalizedTextListConverter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "external_resources")
public class ExternalResource {

    public enum ResourceType { PDF, WEB, VIDEO, LIBRARY, YOUTUBE }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true)
    private String slug;
    @Column(name = "sort_order")
    private int order;
    @Enumerated(EnumType.STRING)
    private ResourceType type;
    @Column(columnDefinition = "TEXT")
    private String url;
    private String sourceName;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> titles;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
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
