package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.vedas.model.AartiLine;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class AartiLineListConverter extends JsonListConverter<AartiLine> {
    public AartiLineListConverter() {
        super(new TypeReference<List<AartiLine>>() {});
    }
}
