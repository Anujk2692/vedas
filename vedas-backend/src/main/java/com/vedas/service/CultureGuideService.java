package com.vedas.service;

import com.vedas.config.DeityCatalog;
import com.vedas.config.FestivalCatalog;
import com.vedas.config.TempleCatalog;
import com.vedas.dto.DeityDto;
import com.vedas.dto.FestivalGuideDto;
import com.vedas.dto.TempleDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CultureGuideService {

    public List<DeityDto> listDeities(String lang) {
        return DeityCatalog.all(lang);
    }

    public DeityDto getDeity(String slug, String lang) {
        return DeityCatalog.all(lang).stream()
                .filter(d -> d.getSlug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deity not found"));
    }

    public List<TempleDto> listTemples(String lang) {
        return TempleCatalog.all(lang);
    }

    public TempleDto getTemple(String slug, String lang) {
        return TempleCatalog.all(lang).stream()
                .filter(t -> t.getSlug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Temple not found"));
    }

    public List<FestivalGuideDto> listFestivals(String lang) {
        return FestivalCatalog.all(lang);
    }

    public FestivalGuideDto getFestival(String slug, String lang) {
        return FestivalCatalog.all(lang).stream()
                .filter(f -> f.getSlug().equals(slug))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Festival not found"));
    }
}
