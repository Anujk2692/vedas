package com.vedas.controller;

import com.vedas.dto.ChildNameRequestDto;
import com.vedas.dto.ChildNameResponseDto;
import com.vedas.service.ChildNameService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/child-names")
public class ChildNameController {

    private final ChildNameService childNameService;

    public ChildNameController(ChildNameService childNameService) {
        this.childNameService = childNameService;
    }

    @GetMapping("/options")
    public Map<String, List<String>> getOptions() {
        return childNameService.getOptions();
    }

    @PostMapping("/suggest")
    public ChildNameResponseDto suggest(@Valid @RequestBody ChildNameRequestDto request) {
        return childNameService.suggest(request);
    }
}
