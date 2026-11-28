package com.vedas.controller;

import com.vedas.dto.SevaDtos.*;
import com.vedas.model.ConsultationMessage;
import com.vedas.model.PujaBooking;
import com.vedas.service.PujaConsultationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seva")
public class PujaConsultationController {

    private final PujaConsultationService sevaService;

    public PujaConsultationController(PujaConsultationService sevaService) {
        this.sevaService = sevaService;
    }

    @GetMapping("/catalog")
    public SevaCatalogResponse catalog() {
        return sevaService.getCatalog();
    }

    @PostMapping("/pujas/book")
    public PujaBooking bookPuja(@Valid @RequestBody BookPujaRequest request) {
        return sevaService.bookPuja(request);
    }

    @GetMapping("/pujas/my")
    public List<PujaBooking> myPujas(@RequestParam String accountKey) {
        return sevaService.myPujas(accountKey);
    }

    @GetMapping("/astrologers")
    public List<AstrologerProfile> astrologers() {
        return sevaService.getAstrologers();
    }

    @PostMapping("/consultations/book")
    public ConsultationSessionView bookConsultation(@Valid @RequestBody BookConsultationRequest request) {
        return sevaService.bookConsultation(request);
    }

    @GetMapping("/consultations/my")
    public List<ConsultationSessionView> myConsultations(@RequestParam String accountKey) {
        return sevaService.myConsultations(accountKey);
    }

    @GetMapping("/consultations/{sessionId}/messages")
    public List<ConsultationMessage> getMessages(@PathVariable Long sessionId) {
        return sevaService.getMessages(sessionId);
    }

    @PostMapping("/consultations/{sessionId}/messages")
    public List<ConsultationMessage> sendMessage(
            @PathVariable Long sessionId,
            @Valid @RequestBody SendMessageRequest request) {
        return sevaService.sendMessage(sessionId, request);
    }
}
