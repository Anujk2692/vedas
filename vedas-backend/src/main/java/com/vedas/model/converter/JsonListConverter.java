package com.vedas.model.converter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;

import java.util.Collections;
import java.util.List;

public abstract class JsonListConverter<T> implements AttributeConverter<List<T>, String> {

    private static final ObjectMapper MAPPER = new ObjectMapper();
    private final TypeReference<List<T>> typeRef;

    protected JsonListConverter(TypeReference<List<T>> typeRef) {
        this.typeRef = typeRef;
    }

    @Override
    public String convertToDatabaseColumn(List<T> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to serialize list to JSON", e);
        }
    }

    @Override
    public List<T> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return Collections.emptyList();
        }
        try {
            return MAPPER.readValue(dbData, typeRef);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to deserialize JSON to list", e);
        }
    }
}
