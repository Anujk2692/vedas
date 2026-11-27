package com.vedas.service;

import com.vedas.dto.PanchangDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Multi-method Vedic Astrology (Jyotish), Numerology (Ank Jyotish), Panchang, Vastu,
 * and Scriptural Remedy engine for AI Guru.
 */
@Service
public class VedicAstroNumerologyService {

    private record PlanetProfile(
            int number,
            String planetEn, String planetHi,
            String natureEn, String natureHi,
            String dayEn, String dayHi,
            String colorEn, String colorHi,
            String mantra,
            String strengthEn, String strengthHi
    ) {}

    private static final Map<Integer, PlanetProfile> PLANETS = Map.of(
            1, new PlanetProfile(1, "Sun (Surya)", "सूर्य (Surya)", "Leadership, vitality & soul power", "नेतृत्व, तेज और आत्मबल",
                    "Sunday", "रविवार", "Saffron / Gold", "केसरिया / सुनहरा", "ॐ घृणि सूर्याय नमः",
                    "authority, government/management roles, and decisive clarity", "नेतृत्व, प्रशासन और स्पष्ट निर्णय क्षमता"),
            2, new PlanetProfile(2, "Moon (Chandra)", "चन्द्रमा (Chandra)", "Intuition, empathy & emotional flow", "संवेदनशीलता, अंतर्ज्ञान और मन की शांति",
                    "Monday", "सोमवार", "White / Silver", "श्वेत / चाँदी", "ॐ सों सोमाय नमः",
                    "counseling, creativity, healing, and harmonious relationships", "कला, परामर्श, सेवा और मधुर संबंध"),
            3, new PlanetProfile(3, "Jupiter (Brihaspati)", "बृहस्पति (गुरु)", "Wisdom, teaching & expansion", "ज्ञान, धर्म, शिक्षा और विस्तार",
                    "Thursday", "गुरुवार", "Yellow / Turmeric", "पीला / हल्दी", "ॐ बृं बृहस्पतये नमः",
                    "education, finance, advisory, and dharmic growth", "शिक्षा, वित्त, सलाहकार और आध्यात्मिक उन्नति"),
            4, new PlanetProfile(4, "Rahu", "राहु", "Innovation, unconventional mastery & focus", "नवीन सोच, तकनीक और असाधारण दृष्टि",
                    "Saturday", "शनिवार", "Smoky Blue / Grey", "नीला / स्लेटी", "ॐ रां राहवे नमः",
                    "technology, research, media, and bold breakthroughs", "तकनीक, शोध, मीडिया और नए प्रयोग"),
            5, new PlanetProfile(5, "Mercury (Budha)", "बुध (Budha)", "Intellect, communication & commerce", "बुद्धि, वाणी, व्यापार और संवाद",
                    "Wednesday", "बुधवार", "Emerald Green", "हरा", "ॐ बुं बुधाय नमः",
                    "business, writing, analytics, and adaptable problem-solving", "व्यापार, लेखन, गणना और संवाद कौशल"),
            6, new PlanetProfile(6, "Venus (Shukra)", "शुक्र (Shukra)", "Harmony, beauty, comfort & devotion", "प्रेम, कला, सौंदर्य और समृद्धि",
                    "Friday", "शुक्रवार", "Cream / Rose", "क्रीम / गुलाबी", "ॐ शुं शुक्राय नमः",
                    "design, hospitality, wealth stewardship, and family harmony", "कला, डिज़ाइन, वैभव और पारिवारिक सुख"),
            7, new PlanetProfile(7, "Ketu", "केतु", "Spirituality, research & inner detachment", "अध्यात्म, शोध, ध्यान और अंतर्दृष्टि",
                    "Tuesday / Thursday", "मंगलवार / गुरुवार", "Earthy / Ochre", "गेरुआ / हल्का पीला", "ॐ कें केतवे नमः",
                    "deep study, healing, analytics, and inner awakening", "गूढ़ अध्ययन, ध्यान, शोध और आत्मबोध"),
            8, new PlanetProfile(8, "Saturn (Shani)", "शनि (Shani)", "Discipline, justice & enduring karma", "अनुशासन, न्याय, धैर्य और कर्मफल",
                    "Saturday", "शनिवार", "Navy / Indigo", "गहरा नीला", "ॐ शं शनैश्चराय नमः",
                    "long-term wealth, law, engineering, and steady mastery", "दीर्घकालिक सफलता, न्याय, निर्माण और स्थिरता"),
            9, new PlanetProfile(9, "Mars (Mangala)", "मंगल (Mangala)", "Courage, energy & protective action", "साहस, ऊर्जा, पराक्रम और रक्षा",
                    "Tuesday", "मंगलवार", "Coral Red / Vermilion", "लाल / सिंदूरी", "ॐ अं अंगारकाय नमः",
                    "sports, leadership, real estate, and fearless execution", "साहस, भूमि-भवन, नेतृत्व और कर्मठता")
    );

    private static final Pattern DATE_PATTERN = Pattern.compile("(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}|\\d{1,2}[-/]\\d{1,2}[-/]\\d{4})");

    public String buildHolisticInsight(
            String question,
            String lang,
            String personName,
            String birthDate,
            String birthTime,
            String birthPlace,
            PanchangDto panchang) {

        boolean hi = "hi".equalsIgnoreCase(lang) || "sa".equalsIgnoreCase(lang);
        String resolvedDate = (birthDate != null && !birthDate.isBlank()) ? birthDate.trim() : extractDateFromQuestion(question);
        LocalDate parsedDate = parseDate(resolvedDate);
        String cleanName = personName != null ? personName.trim() : "";

        Integer mulank = parsedDate != null ? reduceToSingleDigit(parsedDate.getDayOfMonth()) : null;
        Integer bhagyank = parsedDate != null ? computeLifePath(parsedDate) : null;
        Integer namank = !cleanName.isBlank() ? computeChaldeanNameNumber(cleanName) : null;

        String rashiInfo = computeRashi(cleanName, parsedDate, hi);
        String intent = detectIntent(question);

        StringBuilder sb = new StringBuilder();

        // 1. Numerology Section
        if (mulank != null || namank != null) {
            sb.append(hi ? "🔢 अंक ज्योतिष (Numerology) विश्लेषण:\n" : "🔢 Vedic Numerology (Ank Jyotish):\n");
            if (mulank != null) {
                PlanetProfile mp = PLANETS.get(mulank);
                PlanetProfile bp = PLANETS.get(bhagyank != null ? bhagyank : mulank);
                sb.append(hi
                        ? String.format("• मूलांक (Mulank): %d — स्वामी %s (%s)\n", mulank, mp.planetHi(), mp.natureHi())
                        : String.format("• Mulank (Birth Day): %d — Ruled by %s (%s)\n", mulank, mp.planetEn(), mp.natureEn()));
                if (bhagyank != null) {
                    sb.append(hi
                            ? String.format("• भाग्यांक (Bhagyank): %d — स्वामी %s (%s)\n", bhagyank, bp.planetHi(), bp.strengthHi())
                            : String.format("• Bhagyank (Destiny): %d — Ruled by %s (favors %s)\n", bhagyank, bp.planetEn(), bp.strengthEn()));
                }
                sb.append(hi
                        ? String.format("• शुभ दिन: %s | शुभ रंग: %s | मंत्र: %s\n", bp.dayHi(), bp.colorHi(), bp.mantra())
                        : String.format("• Auspicious Day: %s | Lucky Color: %s | Mantra: %s\n", bp.dayEn(), bp.colorEn(), bp.mantra()));
            }
            if (namank != null) {
                PlanetProfile np = PLANETS.get(namank);
                sb.append(hi
                        ? String.format("• नामांक (%s): %d — %s ऊर्जा (%s)\n", cleanName, namank, np.planetHi(), np.strengthHi())
                        : String.format("• Name Number (%s): %d — %s vibration (%s)\n", cleanName, namank, np.planetEn(), np.strengthEn()));
            }
            sb.append("\n");
        }

        // 2. Astrology & Live Panchang Section
        sb.append(hi ? "🔮 वैदिक ज्योतिष व आज का पंचांग:\n" : "🔮 Vedic Astrology (Jyotish) & Live Panchang:\n");
        if (rashiInfo != null) {
            sb.append("• ").append(rashiInfo).append("\n");
        }
        if (birthTime != null && !birthTime.isBlank()) {
            sb.append(hi
                    ? "• जन्म समय (" + birthTime.trim() + (birthPlace != null && !birthPlace.isBlank() ? ", " + birthPlace.trim() : "") + "): लग्न एवं दशा-संतुलन हेतु प्रातः सूर्योदय काल शुभ माना गया है।\n"
                    : "• Birth Time (" + birthTime.trim() + (birthPlace != null && !birthPlace.isBlank() ? ", " + birthPlace.trim() : "") + "): Align major decisions with sunrise / Brahma Muhurta clarity.\n");
        }
        if (panchang != null) {
            sb.append(hi
                    ? String.format("• आज का पंचांग: %s | %s | नक्षत्र: %s%s\n",
                    panchang.getWeekday(), panchang.getTithi(), panchang.getNakshatra(),
                    panchang.getYoga() != null ? " | योग: " + panchang.getYoga() : "")
                    : String.format("• Today's Panchang: %s | %s | Nakshatra: %s%s\n",
                    panchang.getWeekday(), panchang.getTithi(), panchang.getNakshatra(),
                    panchang.getYoga() != null ? " | Yoga: " + panchang.getYoga() : ""));
        }
        sb.append("\n");

        // 3. Method-by-Method Guidance for the User's Specific Question
        sb.append(buildIntentGuidance(intent, hi, mulank, bhagyank));

        return sb.toString().trim();
    }

    private String buildIntentGuidance(String intent, boolean hi, Integer mulank, Integer bhagyank) {
        PlanetProfile focus = PLANETS.get(bhagyank != null ? bhagyank : (mulank != null ? mulank : 3));
        return switch (intent) {
            case "CAREER" -> hi
                    ? "💼 करियर, व्यवसाय व निर्णय (ज्योतिष + अंक + गीता):\n"
                    + "• कर्मयोग (गीता 2.47): परिणाम की चिंता छोड़कर आज के कर्म की गुणवत्ता पर ध्यान दें।\n"
                    + "• ज्योतिष व वास्तु: कार्यस्थल पर उत्तर या पूर्व दिशा में बैठें; " + focus.dayHi() + " को नया कार्य आरंभ करना विशेष शुभ है।\n"
                    + "• उपाय: प्रतिदिन " + focus.mantra() + " का 11 बार जप करें और सूर्य को अर्घ्य दें।"
                    : "💼 Career, Business & Decisions (Jyotish + Numerology + Gita):\n"
                    + "• Karma Yoga (Gita 2.47): Focus fully on excellence in today's action without attachment to anxiety.\n"
                    + "• Jyotish & Vastu: Face North or East while working; " + focus.dayEn() + " aligns strongly with your planetary energy.\n"
                    + "• Remedy: Chant " + focus.mantra() + " (11x daily) and keep your workspace clutter-free.";
            case "RELATIONSHIP" -> hi
                    ? "🤝 संबंध, विवाह व परिवार (ज्योतिष + अंक + उपनिषद):\n"
                    + "• चंद्र व शुक्र संतुलन: संवाद में कोमलता और धैर्य रखें; मौन और सुनने से 80% मतभेद शांत होते हैं।\n"
                    + "• उपनिषद दृष्टि: प्रेम स्वतंत्रता और सम्मान में खिलता है, नियंत्रण या अपेक्षा में नहीं।\n"
                    + "• उपाय: सोमवार/शुक्रवार को शिव-पार्वती स्मरण और 'ॐ नमः शिवाय' का शांत जप करें।"
                    : "🤝 Relationships, Marriage & Family (Jyotish + Numerology + Upanishads):\n"
                    + "• Moon & Venus Harmony: Speak gently and listen deeply; patience resolves most planetary friction.\n"
                    + "• Upanishadic Insight: True love nurtures mutual growth rather than attachment or control.\n"
                    + "• Remedy: Practice calm evening reflection and chant 'Om Namah Shivaya' on Mondays/Fridays.";
            case "WEALTH" -> hi
                    ? "🪙 धन, समृद्धि व स्थिरता (ज्योतिष + अंक + वास्तु):\n"
                    + "• गुरु व शुक्र कृपा: ईमानदार कर्म, बचत-अनुशासन और दान से धन में स्थिरता आती है।\n"
                    + "• वास्तु संकेत: घर की उत्तर (कुबेर) और ईशान कोण को स्वच्छ व प्रकाशमय रखें।\n"
                    + "• उपाय: गुरुवार को श्री सूक्त या कनकधारा पाठ व " + focus.mantra() + " का जप करें।"
                    : "🪙 Wealth, Finance & Stability (Jyotish + Numerology + Vastu):\n"
                    + "• Jupiter & Venus Grace: Ethical effort, disciplined saving, and charity stabilize abundance.\n"
                    + "• Vastu Tip: Keep the North (Kubera) and North-East corners clean, bright, and clutter-free.\n"
                    + "• Remedy: Recite Sri Suktam on Fridays/Thursdays alongside " + focus.mantra() + ".";
            case "HEALTH" -> hi
                    ? "🌿 स्वास्थ्य, मानसिक शांति व आयुर्वेद:\n"
                    + "• त्रिदोष व प्राण संतुलन: प्रातः 10 मिनट अनुलोम-विलोम व भ्रामरी प्राणायाम मन और चंद्र को शांत करते हैं।\n"
                    + "• गीता 6.17 (युक्त-आहार-विहार): संतुलित भोजन, समय पर निद्रा और सात्विक दिनचर्या सर्वोत्तम औषधि है।\n"
                    + "• उपाय: शवासन व 'ॐ' का नाद ध्यान (5–10 मिनट) करें।"
                    : "🌿 Health, Peace & Ayurveda:\n"
                    + "• Prana & Moon Balance: 10 minutes of Anulom-Vilom and Bhramari Pranayama calm the nervous system.\n"
                    + "• Gita 6.17 (Yukta-Ahara-Vihara): Moderation in food, sleep, and daily routine restores vitality.\n"
                    + "• Remedy: Practice Shavasana and 5–10 minutes of quiet Om meditation.";
            case "VASTU" -> hi
                    ? "🏡 वास्तु शास्त्र व गृह शांति:\n"
                    + "• ईशान कोण (उत्तर-पूर्व): पूजा स्थल और जल तत्व के लिए श्रेष्ठ — इसे सदैव खुला व स्वच्छ रखें।\n"
                    + "• आग्नेय कोण (दक्षिण-पूर्व): रसोई व अग्नि ऊर्जा के लिए उत्तम।\n"
                    + "• उपाय: प्रातः व संध्या घर में दीपक और हल्की धूप/कपूर आरती करें।"
                    : "🏡 Vastu Shastra & Home Harmony:\n"
                    + "• North-East (Ishanya): Ideal for prayer/meditation — keep it bright, clean, and open.\n"
                    + "• South-East (Agni): Best aligned for the kitchen and vitality.\n"
                    + "• Remedy: Light a morning/evening diya and keep entrance spaces welcoming.";
            default -> hi
                    ? "🕉 समग्र सनातन मार्गदर्शन (ज्योतिष + अंक + गीता):\n"
                    + "• आज का सूत्र (गीता 6.5): 'उद्धरेदात्मनात्मानम्' — शांत विवेक और नियमित साधना से जीवन की हर दिशा स्पष्ट होती है।\n"
                    + "• ज्योतिष-अंक संकेत: " + focus.dayHi() + " और " + focus.colorHi() + " रंग आपके लिए सहायक हैं।\n"
                    + "• दैनिक उपाय: 5 मिनट ध्यान + " + focus.mantra() + " का जप करें।"
                    : "🕉 Holistic Vedic Guidance (Jyotish + Numerology + Gita):\n"
                    + "• Gita 6.5 Principle: Elevate yourself through self-understanding, calm discernment, and steady action.\n"
                    + "• Jyotish-Numerology Cue: " + focus.dayEn() + " and " + focus.colorEn() + " hues support clarity.\n"
                    + "• Daily Practice: 5 minutes of quiet breath awareness + " + focus.mantra() + ".";
        };
    }

    private String detectIntent(String question) {
        String q = question == null ? "" : question.toLowerCase(Locale.ROOT);
        if (containsAny(q, "career", "job", "work", "business", "promotion", "exam", "study", "करियर", "नौकरी", "व्यापार", "पढ़ाई")) {
            return "CAREER";
        }
        if (containsAny(q, "marriage", "love", "wife", "husband", "partner", "relation", "family", "शादी", "विवाह", "प्रेम", "रिश्त", "परिवार")) {
            return "RELATIONSHIP";
        }
        if (containsAny(q, "money", "wealth", "finance", "debt", "rich", "lakshmi", "धन", "पैसा", "लक्ष्मी", "कर्ज", "संपत्ति")) {
            return "WEALTH";
        }
        if (containsAny(q, "health", "stress", "anxiety", "fear", "peace", "sleep", "sick", "स्वास्थ्य", "तनाव", "चिंता", "शांति", "डर", "नींद")) {
            return "HEALTH";
        }
        if (containsAny(q, "vastu", "house", "home", "direction", "वास्तु", "घर", "दिशा")) {
            return "VASTU";
        }
        return "GENERAL";
    }

    private boolean containsAny(String haystack, String... terms) {
        for (String t : terms) {
            if (haystack.contains(t)) return true;
        }
        return false;
    }

    private String extractDateFromQuestion(String q) {
        if (q == null) return null;
        Matcher m = DATE_PATTERN.matcher(q);
        return m.find() ? m.group(1) : null;
    }

    private LocalDate parseDate(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String s = raw.trim().replace('/', '-');
        String[] parts = s.split("-");
        if (parts.length != 3) return null;
        try {
            int p0 = Integer.parseInt(parts[0]);
            int p1 = Integer.parseInt(parts[1]);
            int p2 = Integer.parseInt(parts[2]);
            if (parts[0].length() == 4) {
                return LocalDate.of(p0, p1, p2);
            }
            if (parts[2].length() == 4) {
                return LocalDate.of(p2, p1, p0);
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    private int reduceToSingleDigit(int n) {
        int val = Math.abs(n);
        while (val > 9) {
            int sum = 0;
            while (val > 0) {
                sum += val % 10;
                val /= 10;
            }
            val = sum;
        }
        return val == 0 ? 9 : val;
    }

    private int computeLifePath(LocalDate d) {
        int sum = d.getYear() + d.getMonthValue() + d.getDayOfMonth();
        return reduceToSingleDigit(sum);
    }

    private int computeChaldeanNameNumber(String name) {
        String clean = name.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");
        if (clean.isEmpty()) {
            return reduceToSingleDigit(Math.max(1, name.trim().length()));
        }
        int total = 0;
        for (char c : clean.toCharArray()) {
            total += switch (c) {
                case 'A', 'I', 'J', 'Q', 'Y' -> 1;
                case 'B', 'K', 'R' -> 2;
                case 'C', 'G', 'L', 'S' -> 3;
                case 'D', 'M', 'T' -> 4;
                case 'E', 'H', 'N', 'X' -> 5;
                case 'U', 'V', 'W' -> 6;
                case 'O', 'Z' -> 7;
                case 'F', 'P' -> 8;
                default -> 1;
            };
        }
        return reduceToSingleDigit(total);
    }

    private String computeRashi(String name, LocalDate date, boolean hi) {
        if (date != null) {
            int m = date.getMonthValue();
            int d = date.getDayOfMonth();
            String[] rashi = sunRashi(m, d);
            return hi
                    ? String.format("जन्म-तिथि राशि: %s (स्वामी: %s)", rashi[1], rashi[3])
                    : String.format("Solar Rashi: %s (Ruler: %s)", rashi[0], rashi[2]);
        }
        if (name != null && !name.isBlank()) {
            char ch = Character.toLowerCase(name.trim().charAt(0));
            String r = switch (ch) {
                case 'a', 'l', 'e', 'i' -> hi ? "मेष (Aries) — स्वामी मंगल" : "Mesha (Aries) — Ruled by Mars";
                case 'b', 'v', 'u' -> hi ? "वृषभ (Taurus) — स्वामी शुक्र" : "Vrishabha (Taurus) — Ruled by Venus";
                case 'k', 'c', 'g' -> hi ? "मिथुन (Gemini) — स्वामी बुध" : "Mithuna (Gemini) — Ruled by Mercury";
                case 'h', 'd' -> hi ? "कर्क (Cancer) — स्वामी चंद्र" : "Karka (Cancer) — Ruled by Moon";
                case 'm', 't' -> hi ? "सिंह (Leo) — स्वामी सूर्य" : "Simha (Leo) — Ruled by Sun";
                case 'p', 's', 'n' -> hi ? "कन्या / कुंभ — बुध व शनि संतुलन" : "Kanya / Kumbha — Mercury & Saturn balance";
                case 'r', 'y' -> hi ? "तुला (Libra) — स्वामी शुक्र" : "Tula (Libra) — Ruled by Venus";
                default -> hi ? "धनु / मीन — स्वामी बृहस्पति (गुरु)" : "Dhanu / Meena — Ruled by Jupiter";
            };
            return (hi ? "नामाक्षर राशि संकेत: " : "Name-Akshar Rashi Cue: ") + r;
        }
        return null;
    }

    private String[] sunRashi(int m, int d) {
        int md = m * 100 + d;
        if (md >= 414 && md <= 514) return new String[]{"Mesha (Aries)", "मेष", "Mars", "मंगल"};
        if (md >= 515 && md <= 614) return new String[]{"Vrishabha (Taurus)", "वृषभ", "Venus", "शुक्र"};
        if (md >= 615 && md <= 715) return new String[]{"Mithuna (Gemini)", "मिथुन", "Mercury", "बुध"};
        if (md >= 716 && md <= 816) return new String[]{"Karka (Cancer)", "कर्क", "Moon", "चन्द्रमा"};
        if (md >= 817 && md <= 916) return new String[]{"Simha (Leo)", "सिंह", "Sun", "सूर्य"};
        if (md >= 917 && md <= 1016) return new String[]{"Kanya (Virgo)", "कन्या", "Mercury", "बुध"};
        if (md >= 1017 && md <= 1115) return new String[]{"Tula (Libra)", "तुला", "Venus", "शुक्र"};
        if (md >= 1116 && md <= 1215) return new String[]{"Vrishchika (Scorpio)", "वृश्चिक", "Mars", "मंगल"};
        if (md >= 1216 || md <= 114) return new String[]{"Dhanu (Sagittarius)", "धनु", "Jupiter", "बृहस्पति"};
        if (md >= 115 && md <= 212) return new String[]{"Makara (Capricorn)", "मकर", "Saturn", "शनि"};
        if (md >= 213 && md <= 314) return new String[]{"Kumbha (Aquarius)", "कुंभ", "Saturn", "शनि"};
        return new String[]{"Meena (Pisces)", "मीन", "Jupiter", "बृहस्पति"};
    }
}
