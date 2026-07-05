package com.vedas.service;

import com.vedas.dto.PanchangDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.Map;

@Service
public class PanchangService {

    private static final Map<String, String> FESTIVALS = Map.ofEntries(
            Map.entry("01-14", "मकर संक्रांति"),
            Map.entry("02-26", "महाशिवरात्रि"),
            Map.entry("03-14", "होली"),
            Map.entry("04-14", "बैसाखी / नववर्ष"),
            Map.entry("08-26", "Janmashtami (approx)"),
            Map.entry("09-17", "Ganesh Chaturthi (approx)"),
            Map.entry("10-12", "Navratri begins (approx)"),
            Map.entry("10-20", "Dussehra (approx)"),
            Map.entry("11-01", "Diwali (approx)"),
            Map.entry("11-15", "Dev Deepawali")
    );

    public PanchangDto getToday(String lang) {
        LocalDate today = LocalDate.now();
        boolean hindi = "hi".equalsIgnoreCase(lang);
        PanchangDto p = new PanchangDto();
        p.setDateLabel(today.format(DateTimeFormatter.ofPattern("d MMMM yyyy")));
        p.setWeekday(today.getDayOfWeek().getDisplayName(TextStyle.FULL, hindi ? new Locale("hi") : Locale.ENGLISH));
        p.setTithi(hindi ? "सटीक तिथि के लिए स्थानीय पंचांग देखें" : "See local panchang for exact tithi");
        p.setNakshatra(hindi ? "नक्षत्र — स्थानीय समयानुसार" : "Nakshatra — location based");
        p.setYoga(hindi ? "योग — पारंपरिक पंचांग में" : "Yoga — in traditional panchang");
        String key = String.format("%02d-%02d", today.getMonthValue(), today.getDayOfMonth());
        String festival = FESTIVALS.get(key);
        p.setFestival(festival != null ? festival : (hindi ? "कोई प्रमुख त्योहार नहीं" : "No major festival today"));
        p.setNote(hindi
                ? "पूर्ण पंचांग (तिथि, नक्षत्र, राहुकाल) के लिए Drik Panchang या स्थानीय मंदिर पंचांग देखें।"
                : "For full panchang (tithi, nakshatra, rahu kaal) use Drik Panchang or local temple calendar.");
        return p;
    }
}
