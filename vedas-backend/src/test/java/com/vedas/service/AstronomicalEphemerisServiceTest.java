package com.vedas.service;

import com.vedas.dto.JyotishProDtos.*;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AstronomicalEphemerisServiceTest {

    @Test
    void computesKundliMilanAndDetailedPanchang() {
        AstronomicalEphemerisService svc = new AstronomicalEphemerisService();

        KundliResponse kundli = svc.computeKundli(new KundliRequest("Anuj", "1992-06-26", "09:15", 28.6139, 77.2090, 5.5));
        assertEquals(9, kundli.planets().size());
        assertEquals(9, kundli.mahadashas().size());
        assertFalse(kundli.lagnaSign().isBlank());
        assertFalse(kundli.planets().get(0).subLord().isBlank());
        assertFalse(kundli.planets().get(0).navamsaSign().isBlank());
        assertFalse(kundli.lalKitab().isEmpty());

        MilanResponse milan = svc.computeKundliMilan(new MilanRequest(
                new KundliRequest("Boy", "1992-06-26", "09:15", 28.6139, 77.2090, 5.5),
                new KundliRequest("Girl", "1994-08-15", "14:30", 28.6139, 77.2090, 5.5)
        ));
        assertEquals(8, milan.kootas().size());
        assertEquals(36.0, milan.maxScore());
        assertTrue(milan.totalScore() >= 0 && milan.totalScore() <= 36.0);

        DetailedPanchangResponse panchang = svc.computeDetailedPanchang("2026-11-28", 28.6139, 77.2090);
        assertEquals("2026-11-28", panchang.date());
        assertEquals(8, panchang.dayChoghadiya().size());
        assertFalse(panchang.shubhMuhurats().isEmpty());
    }
}
