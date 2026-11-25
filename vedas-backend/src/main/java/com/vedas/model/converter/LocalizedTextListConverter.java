package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vedas.model.LocalizedText;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class LocalizedTextListConverter extends JsonListConverter<LocalizedText> {
    public LocalizedTextListConverter() {
        super(new TypeReference<List<LocalizedText>>() {});
    }
}
