package com.vedas.service;

import com.vedas.dto.PanchangDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Deterministic educational panchang for MVP — approximate tithi/nakshatra/yoga
 * from calendar day (no paid API). Festival blurbs are curated fixed-date highlights.
 */
@Service
public class PanchangService {

    private static final List<String> TITHIS_EN = List.of(
            "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
            "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
            "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya"
    );
    private static final List<String> TITHIS_HI = List.of(
            "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
            "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
            "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा / अमावस्या"
    );
    private static final List<String> NAKSHATRAS_EN = List.of(
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
            "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
            "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
            "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
            "Uttara Bhadrapada", "Revati"
    );
    private static final List<String> NAKSHATRAS_HI = List.of(
            "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु",
            "पुष्य", "आश्लेषा", "मघा", "पूर्व फाल्गुनी", "उत्तर फाल्गुनी", "हस्त",
            "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल", "पूर्वाषाढ़ा",
            "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद",
            "उत्तर भाद्रपद", "रेवती"
    );
    private static final List<String> YOGAS_EN = List.of(
            "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma",
            "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
            "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya",
            "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
    );
    private static final List<String> YOGAS_HI = List.of(
            "विष्कम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्म",
            "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र",
            "सिद्धि", "व्यतीपात", "वरीयान्", "परिघ", "शिव", "सिद्ध", "साध्य",
            "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"
    );

    private record Festival(String nameEn, String nameHi, String whyEn, String whyHi, String ritualEn, String ritualHi) {}

    private static final Map<String, Festival> FESTIVALS = Map.ofEntries(
            Map.entry("01-14", new Festival(
                    "Makar Sankranti", "मकर संक्रांति",
                    "Sun enters Capricorn — harvest gratitude and the turn toward longer days.",
                    "सूर्य मकर राशि में प्रवेश — फसल और उष्णता की ओर प्रस्थान का उत्सव।",
                    "Offer til-gud, take a holy bath, and give charity.",
                    "तिल-गुड़ का दान, स्नान और पुण्य कर्म करें।")),
            Map.entry("02-26", new Festival(
                    "Maha Shivaratri", "महाशिवरात्रि",
                    "Night of Shiva — awakening through austerity and devotion.",
                    "शिव की रात्रि — तप और भक्ति से जागरण।",
                    "Fast, offer bilva leaves, and chant Om Namah Shivaya.",
                    "व्रत रखें, बिल्व पत्र चढ़ाएँ, ॐ नमः शिवाय जप करें।")),
            Map.entry("03-14", new Festival(
                    "Holi", "होली",
                    "Festival of colors celebrating Holika Dahan and the triumph of devotion.",
                    "रंगों का उत्सव — होलिका दहन और भक्ति की विजय।",
                    "Play with colors, share sweets, and forgive past grudges.",
                    "रंग खेलें, मिठाई बाँटें, पुरानी बातें भूलें।")),
            Map.entry("04-14", new Festival(
                    "Vaisakhi / Solar New Year", "बैसाखी / नववर्ष",
                    "Harvest thanksgiving and regional solar new year across Bharat.",
                    "फसल कृतज्ञता और क्षेत्रीय सौर नववर्ष।",
                    "Visit a temple, share langar or community meal.",
                    "मंदिर जाएँ, सामुदायिक भोजन या लंगर करें।")),
            Map.entry("08-15", new Festival(
                    "Independence / Krishna season", "स्वाधीनता / कृष्ण उत्सव काल",
                    "Late monsoon season often near Janmashtami observances (date varies).",
                    "श्रावण-भाद्र काल में जन्माष्टमी के निकट (तिथि बदलती है)।",
                    "Read Gita 4.7–8 and chant Krishna mantras.",
                    "गीता ४.७–८ पढ़ें और कृष्ण मंत्र जप करें।")),
            Map.entry("08-26", new Festival(
                    "Janmashtami (approx)", "जन्माष्टमी (अनुमानित)",
                    "Birth of Krishna — dharma restored through divine play.",
                    "श्रीकृष्ण जन्मोत्सव — लीला द्वारा धर्म की स्थापना।",
                    "Fast until midnight, sing bhajans, read Bhagavata stories.",
                    "आधी रात तक व्रत, भजन और भागवत कथा।")),
            Map.entry("09-17", new Festival(
                    "Ganesh Chaturthi (approx)", "गणेश चतुर्थी (अनुमानित)",
                    "Welcome of Ganesha — remover of obstacles and lord of beginnings.",
                    "गणेश आगमन — विघ्नहर्ता और शुभारंभ के देव।",
                    "Install a murti, offer modak, and chant Ganapati Atharvashirsha.",
                    "मूर्ति स्थापना, मोदक भोग, गणपति अथर्वशीर्ष पाठ।")),
            Map.entry("10-12", new Festival(
                    "Navratri begins (approx)", "नवरात्रि आरंभ (अनुमानित)",
                    "Nine nights of Devi — Shakti worship and inner discipline.",
                    "देवी की नौ रात्रियाँ — शक्ति उपासना और अनुशासन।",
                    "Light a diya, recite Durga Saptashati or Devi stotras.",
                    "दीप जलाएँ, दुर्गा सप्तशती या देवी स्तोत्र पढ़ें।")),
            Map.entry("10-20", new Festival(
                    "Dussehra (approx)", "दशहरा (अनुमानित)",
                    "Victory of Rama over Ravana — triumph of dharma.",
                    "राम द्वारा रावण-वध — धर्म की विजय।",
                    "Burn the effigy of Ravana or read Ramayana victory chapters.",
                    "रावण दहन या रामायण विजय प्रसंग पढ़ें।")),
            Map.entry("11-01", new Festival(
                    "Diwali (approx)", "दीपावली (अनुमानित)",
                    "Festival of lights — return of Rama and worship of Lakshmi.",
                    "प्रकाश का पर्व — राम की वापसी और लक्ष्मी पूजा।",
                    "Clean the home, light diyas, do Lakshmi-Ganesh puja.",
                    "घर स्वच्छ करें, दीप जलाएँ, लक्ष्मी-गणेश पूजा करें।")),
            Map.entry("11-15", new Festival(
                    "Dev Deepawali", "देव दीपावली",
                    "Gods illuminate Kashi after Diwali — Tripurari Purnima.",
                    "दीपावली के बाद काशी में देवों का दीपोत्सव।",
                    "Offer lamps to Ganga or a nearby sacred water body.",
                    "गंगा या पवित्र जल में दीपदान करें।"))
    );

    public PanchangDto getToday(String lang) {
        return forDate(LocalDate.now(), lang);
    }

    public PanchangDto forDate(LocalDate today, String lang) {
        boolean hindi = "hi".equalsIgnoreCase(lang);
        int dayIndex = today.getDayOfYear() - 1;
        // Approximate lunar indices from day-of-year (educational, not ephemeris-accurate).
        int tithiIdx = dayIndex % 15;
        int nakshatraIdx = dayIndex % 27;
        int yogaIdx = (dayIndex * 2) % 27;
        String paksha = ((dayIndex / 15) % 2 == 0)
                ? (hindi ? "शुक्ल पक्ष" : "Shukla Paksha")
                : (hindi ? "कृष्ण पक्ष" : "Krishna Paksha");

        PanchangDto p = new PanchangDto();
        p.setDateLabel(today.format(DateTimeFormatter.ofPattern(hindi ? "d MMMM yyyy" : "d MMMM yyyy",
                hindi ? new Locale("hi") : Locale.ENGLISH)));
        p.setWeekday(today.getDayOfWeek().getDisplayName(TextStyle.FULL, hindi ? new Locale("hi") : Locale.ENGLISH));
        String tithiName = hindi ? TITHIS_HI.get(tithiIdx) : TITHIS_EN.get(tithiIdx);
        p.setTithi(paksha + " · " + tithiName);
        p.setNakshatra(hindi ? NAKSHATRAS_HI.get(nakshatraIdx) : NAKSHATRAS_EN.get(nakshatraIdx));
        p.setYoga(hindi ? YOGAS_HI.get(yogaIdx) : YOGAS_EN.get(yogaIdx));

        String key = String.format("%02d-%02d", today.getMonthValue(), today.getDayOfMonth());
        Festival festival = FESTIVALS.get(key);
        if (festival != null) {
            p.setFestival(hindi ? festival.nameHi() : festival.nameEn());
            p.setFestivalWhy(hindi ? festival.whyHi() : festival.whyEn());
            p.setFestivalRitual(hindi ? festival.ritualHi() : festival.ritualEn());
        } else {
            p.setFestival(hindi ? "कोई प्रमुख त्योहार नहीं" : "No major festival today");
            p.setFestivalWhy(hindi
                    ? "आज अध्ययन, जप या ध्यान का साधारण दिन बनाएँ।"
                    : "Make today a quiet day of study, japa, or meditation.");
            p.setFestivalRitual(hindi
                    ? "एक श्लोक पढ़ें और ५ मिनट ध्यान करें।"
                    : "Read one shlok and sit for 5 minutes of meditation.");
        }
        p.setNote(hindi
                ? "शैक्षिक पंचांग — तिथि/नक्षत्र अनुमानित हैं। सटीक मुहूर्त के लिए स्थानीय मंदिर पंचांग देखें।"
                : "Educational panchang — tithi/nakshatra are approximate. Use a temple calendar for exact muhurta.");
        return p;
    }
}
