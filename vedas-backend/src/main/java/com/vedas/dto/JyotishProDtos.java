package com.vedas.dto;

import java.util.List;

public final class JyotishProDtos {

    public record KundliRequest(
            String name,
            String birthDate,     // YYYY-MM-DD
            String birthTime,     // HH:mm
            Double latitude,      // default 28.6139 (New Delhi)
            Double longitude,     // default 77.2090 (New Delhi)
            Double timezoneOffset // default 5.5 (IST)
    ) {}

    public record PlanetPosition(
            String planet,
            String sign,
            String signHi,
            double degreeInSign,
            String degreeFormatted,
            int house,
            String nakshatra,
            int pada,
            String signLord,
            String starLord,
            String subLord,
            String navamsaSign,
            boolean retrograde
    ) {}

    public record DashaPeriod(
            String planet,
            String startDate,
            String endDate,
            double years,
            boolean current
    ) {}

    public record LalKitabInsight(
            String planet,
            int house,
            String status,
            String remedyEn,
            String remedyHi
    ) {}

    public record KundliResponse(
            String name,
            String birthDate,
            String birthTime,
            double latitude,
            double longitude,
            double ayanamsa,
            String ayanamsaFormatted,
            String lagnaSign,
            String lagnaSignHi,
            double lagnaDegree,
            String lagnaNakshatra,
            String moonSign,
            String sunSign,
            String nakshatra,
            int pada,
            boolean manglik,
            String manglikReason,
            List<PlanetPosition> planets,
            List<DashaPeriod> mahadashas,
            List<LalKitabInsight> lalKitab
    ) {}

    public record MilanRequest(
            KundliRequest boy,
            KundliRequest girl
    ) {}

    public record KootaScore(
            String name,
            double obtained,
            double max,
            String detail
    ) {}

    public record MilanResponse(
            double totalScore,
            double maxScore,
            String verdict,
            String boyRashi,
            String boyNakshatra,
            boolean boyManglik,
            String girlRashi,
            String girlNakshatra,
            boolean girlManglik,
            List<KootaScore> kootas
    ) {}

    public record ChoghadiyaSlot(
            String period,
            String name,
            String quality,
            String timeRange
    ) {}

    public record MuhuratItem(
            String activity,
            String window,
            String quality,
            String notes
    ) {}

    public record DetailedPanchangResponse(
            String date,
            String weekday,
            String tithi,
            String paksha,
            String nakshatra,
            String yoga,
            String karana,
            String sunSign,
            String moonSign,
            String sunrise,
            String sunset,
            String abhijitMuhurat,
            String rahuKaal,
            String yamaganda,
            String gulikaKaal,
            List<ChoghadiyaSlot> dayChoghadiya,
            List<MuhuratItem> shubhMuhurats
    ) {}

    private JyotishProDtos() {}
}
