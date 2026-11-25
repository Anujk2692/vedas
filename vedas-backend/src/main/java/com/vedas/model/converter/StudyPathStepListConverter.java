package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vedas.model.StudyPathStep;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class StudyPathStepListConverter extends JsonListConverter<StudyPathStep> {
    public StudyPathStepListConverter() {
        super(new TypeReference<List<StudyPathStep>>() {});
    }
}
