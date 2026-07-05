package com.vedas.dto;

import java.util.List;

public class SanatanHubDto {
    private List<TopicDto> topics;
    private List<StudyPathDto> studyPaths;
    private List<ExternalResourceDto> resources;
    private List<VedaSummaryDto> scripturesByType;

    public List<TopicDto> getTopics() { return topics; }
    public void setTopics(List<TopicDto> topics) { this.topics = topics; }
    public List<StudyPathDto> getStudyPaths() { return studyPaths; }
    public void setStudyPaths(List<StudyPathDto> studyPaths) { this.studyPaths = studyPaths; }
    public List<ExternalResourceDto> getResources() { return resources; }
    public void setResources(List<ExternalResourceDto> resources) { this.resources = resources; }
    public List<VedaSummaryDto> getScripturesByType() { return scripturesByType; }
    public void setScripturesByType(List<VedaSummaryDto> scripturesByType) { this.scripturesByType = scripturesByType; }
}
