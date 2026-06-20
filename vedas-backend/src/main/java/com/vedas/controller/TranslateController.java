package com.vedas.controller;

import com.vedas.dto.TranslateRequestDto;
import com.vedas.dto.TranslateResultDto;
import com.vedas.service.TranslateService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TranslateController {

    private final TranslateService translateService;

    public TranslateController(TranslateService translateService) {
        this.translateService = translateService;
    }

    @PostMapping("/translate")
    public TranslateResultDto translate(@RequestBody TranslateRequestDto request) {
        return translateService.translate(request.getText(), request.getLang());
    }
}
