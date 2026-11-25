package com.vedas.model;

import com.vedas.model.converter.LocalizedTextListConverter;
import com.vedas.model.converter.StudyPathStepListConverter;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "study_paths")
public class StudyPath {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(unique = true)
    private String slug;
    @Column(name = "sort_order")
    private int order;
    private String level;
    private String durationLabel;
    private String icon;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> titles;
    @Convert(converter = LocalizedTextListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<LocalizedText> descriptions;
    @Convert(converter = StudyPathStepListConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<StudyPathStep> steps;
    private boolean active;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDurationLabel() { return durationLabel; }
    public void setDurationLabel(String durationLabel) { this.durationLabel = durationLabel; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public List<LocalizedText> getTitles() { return titles; }
    public void setTitles(List<LocalizedText> titles) { this.titles = titles; }
    public List<LocalizedText> getDescriptions() { return descriptions; }
    public void setDescriptions(List<LocalizedText> descriptions) { this.descriptions = descriptions; }
    public List<StudyPathStep> getSteps() { return steps; }
    public void setSteps(List<StudyPathStep> steps) { this.steps = steps; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
