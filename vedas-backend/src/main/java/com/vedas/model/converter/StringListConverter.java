package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class StringListConverter extends JsonListConverter<String> {
    public StringListConverter() {
        super(new TypeReference<List<String>>() {});
    }
}
