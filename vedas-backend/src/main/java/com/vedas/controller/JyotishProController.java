package com.vedas.controller;

import com.vedas.dto.JyotishProDtos.*;
import com.vedas.service.AstronomicalEphemerisService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jyotish")
public class JyotishProController {

    private final AstronomicalEphemerisService ephemerisService;

    public JyotishProController(AstronomicalEphemerisService ephemerisService) {
        this.ephemerisService = ephemerisService;
    }

    @PostMapping("/kundli")
    public KundliResponse kundli(@RequestBody KundliRequest request) {
        return ephemerisService.computeKundli(request);
    }

    @PostMapping("/milan")
    public MilanResponse milan(@RequestBody MilanRequest request) {
        return ephemerisService.computeKundliMilan(request);
    }

    @GetMapping("/panchang")
    public DetailedPanchangResponse detailedPanchang(
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude) {
        return ephemerisService.computeDetailedPanchang(date, latitude, longitude);
    }
}
