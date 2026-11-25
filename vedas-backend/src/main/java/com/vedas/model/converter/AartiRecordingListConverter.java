package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vedas.model.AartiRecording;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class AartiRecordingListConverter extends JsonListConverter<AartiRecording> {
    public AartiRecordingListConverter() {
        super(new TypeReference<List<AartiRecording>>() {});
    }
}
