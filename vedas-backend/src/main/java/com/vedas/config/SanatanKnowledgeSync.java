package com.vedas.config;

import com.vedas.model.ExternalResource;
import com.vedas.model.StudyPath;
import com.vedas.model.Topic;
import com.vedas.repository.ExternalResourceRepository;
import com.vedas.repository.StudyPathRepository;
import com.vedas.repository.TopicRepository;
import org.springframework.stereotype.Component;

@Component
public class SanatanKnowledgeSync {

    private final TopicRepository topicRepository;
    private final StudyPathRepository studyPathRepository;
    private final ExternalResourceRepository externalResourceRepository;

    public SanatanKnowledgeSync(TopicRepository topicRepository,
                                StudyPathRepository studyPathRepository,
                                ExternalResourceRepository externalResourceRepository) {
        this.topicRepository = topicRepository;
        this.studyPathRepository = studyPathRepository;
        this.externalResourceRepository = externalResourceRepository;
    }

    public void syncAll() {
        syncTopics();
        syncStudyPaths();
        syncResources();
    }

    private void syncTopics() {
        for (Topic def : SanatanKnowledgeCatalog.topics()) {
            topicRepository.findBySlug(def.getSlug()).ifPresentOrElse(existing -> {
                def.setId(existing.getId());
                topicRepository.save(def);
            }, () -> topicRepository.save(def));
        }
    }

    private void syncStudyPaths() {
        for (StudyPath def : SanatanKnowledgeCatalog.studyPaths()) {
            studyPathRepository.findBySlug(def.getSlug()).ifPresentOrElse(existing -> {
                def.setId(existing.getId());
                studyPathRepository.save(def);
            }, () -> studyPathRepository.save(def));
        }
    }

    private void syncResources() {
        for (ExternalResource def : SanatanKnowledgeCatalog.resources()) {
            externalResourceRepository.findBySlug(def.getSlug()).ifPresentOrElse(existing -> {
                def.setId(existing.getId());
                externalResourceRepository.save(def);
            }, () -> externalResourceRepository.save(def));
        }
    }
}
