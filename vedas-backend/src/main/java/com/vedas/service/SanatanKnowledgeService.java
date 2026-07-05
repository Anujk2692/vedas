package com.vedas.service;

import com.vedas.dto.*;
import com.vedas.model.ExternalResource;
import com.vedas.model.StudyPath;
import com.vedas.model.StudyPathStep;
import com.vedas.model.Topic;
import com.vedas.repository.ExternalResourceRepository;
import com.vedas.repository.StudyPathRepository;
import com.vedas.repository.TopicRepository;
import com.vedas.util.LocalizationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SanatanKnowledgeService {

    private final TopicRepository topicRepository;
    private final StudyPathRepository studyPathRepository;
    private final ExternalResourceRepository externalResourceRepository;
    private final VedasService vedasService;

    public SanatanKnowledgeService(TopicRepository topicRepository,
                                   StudyPathRepository studyPathRepository,
                                   ExternalResourceRepository externalResourceRepository,
                                   VedasService vedasService) {
        this.topicRepository = topicRepository;
        this.studyPathRepository = studyPathRepository;
        this.externalResourceRepository = externalResourceRepository;
        this.vedasService = vedasService;
    }

    public SanatanHubDto getHub(String lang) {
        SanatanHubDto hub = new SanatanHubDto();
        hub.setTopics(getTopics(lang));
        hub.setStudyPaths(getStudyPaths(lang));
        hub.setResources(getResources(lang, null, null));
        hub.setScripturesByType(vedasService.getAllVedas(lang));
        return hub;
    }

    public List<TopicDto> getTopics(String lang) {
        return topicRepository.findByActiveTrueOrderByOrderAsc().stream()
                .map(t -> toTopicDto(t, lang))
                .collect(Collectors.toList());
    }

    public TopicDto getTopic(String slug, String lang) {
        Topic topic = topicRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found"));
        return toTopicDto(topic, lang);
    }

    public List<StudyPathDto> getStudyPaths(String lang) {
        return studyPathRepository.findByActiveTrueOrderByOrderAsc().stream()
                .map(p -> toStudyPathDto(p, lang))
                .collect(Collectors.toList());
    }

    public StudyPathDto getStudyPath(String slug, String lang) {
        StudyPath path = studyPathRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Study path not found"));
        return toStudyPathDto(path, lang);
    }

    public List<ExternalResourceDto> getResources(String lang, String scriptureSlug, String topicSlug) {
        List<ExternalResource> resources;
        if (scriptureSlug != null && !scriptureSlug.isBlank()) {
            resources = externalResourceRepository.findByScriptureSlugAndActiveTrueOrderByOrderAsc(scriptureSlug);
        } else if (topicSlug != null && !topicSlug.isBlank()) {
            resources = externalResourceRepository.findByTopicSlugAndActiveTrueOrderByOrderAsc(topicSlug);
        } else {
            resources = externalResourceRepository.findByActiveTrueOrderByOrderAsc();
        }
        return resources.stream().map(r -> toResourceDto(r, lang)).collect(Collectors.toList());
    }

    private TopicDto toTopicDto(Topic t, String lang) {
        TopicDto dto = new TopicDto();
        dto.setId(t.getId());
        dto.setSlug(t.getSlug());
        dto.setOrder(t.getOrder());
        dto.setIcon(t.getIcon());
        dto.setTitle(LocalizationUtil.resolve(t.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(t.getDescriptions(), lang));
        dto.setSummary(LocalizationUtil.resolve(t.getSummaries(), lang));
        dto.setRelatedScriptureSlugs(t.getRelatedScriptureSlugs());
        return dto;
    }

    private StudyPathDto toStudyPathDto(StudyPath p, String lang) {
        StudyPathDto dto = new StudyPathDto();
        dto.setId(p.getId());
        dto.setSlug(p.getSlug());
        dto.setOrder(p.getOrder());
        dto.setLevel(p.getLevel());
        dto.setDurationLabel(p.getDurationLabel());
        dto.setIcon(p.getIcon());
        dto.setTitle(LocalizationUtil.resolve(p.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(p.getDescriptions(), lang));
        if (p.getSteps() != null) {
            dto.setSteps(p.getSteps().stream().map(s -> toStepDto(s, lang)).collect(Collectors.toList()));
        }
        return dto;
    }

    private StudyPathStepDto toStepDto(StudyPathStep s, String lang) {
        StudyPathStepDto dto = new StudyPathStepDto();
        dto.setOrder(s.getOrder());
        dto.setTitle(LocalizationUtil.resolve(s.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(s.getDescriptions(), lang));
        dto.setDurationHint(s.getDurationHint());
        dto.setScriptureSlug(s.getScriptureSlug());
        dto.setActionType(s.getActionType());
        return dto;
    }

    private ExternalResourceDto toResourceDto(ExternalResource r, String lang) {
        ExternalResourceDto dto = new ExternalResourceDto();
        dto.setId(r.getId());
        dto.setSlug(r.getSlug());
        dto.setOrder(r.getOrder());
        dto.setType(r.getType().name());
        dto.setUrl(r.getUrl());
        dto.setSourceName(r.getSourceName());
        dto.setTitle(LocalizationUtil.resolve(r.getTitles(), lang));
        dto.setDescription(LocalizationUtil.resolve(r.getDescriptions(), lang));
        dto.setScriptureSlug(r.getScriptureSlug());
        dto.setTopicSlug(r.getTopicSlug());
        return dto;
    }
}
