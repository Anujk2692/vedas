package com.vedas.service;

import com.vedas.dto.PanchangDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Full Vedic Astrology (Rashi, Lagna estimation, Graha, Panchang, Dasha, All Life Areas)
 * and Numerology (Mulank, Bhagyank, Personal Year, Chaldean + Pythagorean Namank,
 * 3x3 Lo Shu Grid, Friendly/Avoid Numbers, Yogas) + Final Conclusion engine.
 */
@Service
public class VedicAstroNumerologyService {

    private record PlanetProfile(
            int number,
            String planetEn, String planetHi,
            String elementEn, String elementHi,
            String dayEn, String dayHi,
            String colorEn, String colorHi,
            String directionEn, String directionHi,
            String friendlyNums, String avoidNums,
            String gemEn, String gemHi,
            String mantra,
            String strengthEn, String strengthHi,
            String cautionEn, String cautionHi,
            String remedyEn, String remedyHi
    ) {}

    private static final Map<Integer, PlanetProfile> PLANETS = Map.of(
            1, new PlanetProfile(1, "Sun (Surya)", "सूर्य (Surya)", "Fire", "अग्नि",
                    "Sunday", "रविवार", "Saffron / Gold", "केसरिया / सुनहरा", "East", "पूर्व",
                    "1, 2, 3, 9", "8", "Ruby (Manikya) / 1-Mukhi Rudraksha", "माणिक्य / एकमुखी रुद्राक्ष",
                    "ॐ घृणि सूर्याय नमः",
                    "leadership, authority, government/management roles", "नेतृत्व, प्रशासन और स्पष्ट निर्णय क्षमता",
                    "Avoid ego clashes or impatience with seniors/family.", "अहंकार और क्रोध से बचें; बड़ों का सम्मान करें।",
                    "Offer water (Arghya) to rising Sun in copper vessel.", "तांबे के लोटे से उगते सूर्य को अर्घ्य दें और रविवार को गुड़ दान करें।"),
            2, new PlanetProfile(2, "Moon (Chandra)", "चन्द्रमा (Chandra)", "Water", "जल",
                    "Monday", "सोमवार", "White / Silver", "श्वेत / चाँदी", "North-West", "वायव्य (उत्तर-पश्चिम)",
                    "1, 2, 3, 5", "8, 9", "Pearl (Moti) / 2-Mukhi Rudraksha", "मोती / दोमुखी रुद्राक्ष",
                    "ॐ सों सोमाय नमः",
                    "intuition, counseling, healing, creative flow", "कला, परामर्श, अंतर्ज्ञान और मधुर संबंध",
                    "Guard against overthinking and emotional mood swings.", "अति-चिंतन और भावुक निर्णयों से बचें।",
                    "Offer water on Shivling on Mondays & drink from silver/clean glass.", "सोमवार को शिवलिंग पर जल अर्पित करें और 'ॐ नमः शिवाय' का जप करें।"),
            3, new PlanetProfile(3, "Jupiter (Brihaspati)", "बृहस्पति (गुरु)", "Ether", "आकाश",
                    "Thursday", "गुरुवार", "Yellow / Turmeric", "पीला / हल्दी", "North-East", "ईशान (उत्तर-पूर्व)",
                    "1, 2, 3, 9", "6", "Yellow Sapphire (Pukhraj) / 5-Mukhi Rudraksha", "पुखराज / पंचमुखी रुद्राक्ष",
                    "ॐ बृं बृहस्पतये नमः",
                    "wisdom, education, finance, advisory, dharmic growth", "शिक्षा, वित्त, सलाहकार और आध्यात्मिक उन्नति",
                    "Avoid over-promising or neglecting practical financial tracking.", "अधिक उदारता में व्यावहारिक लेखा-जोखा न भूलें।",
                    "Apply saffron/turmeric tilak on Thursdays and respect mentors.", "गुरुवार को हल्दी/केसर तिलक लगाएं और केले के वृक्ष को जल दें।"),
            4, new PlanetProfile(4, "Rahu", "राहु", "Air", "वायु",
                    "Saturday", "शनिवार", "Smoky Blue / Grey", "नीला / स्लेटी", "South-West", "नैऋत्य (दक्षिण-पश्चिम)",
                    "1, 5, 6, 7", "4, 8", "Hessonite (Gomed) / 8-Mukhi Rudraksha", "गोमेद / अष्टमुखी रुद्राक्ष",
                    "ॐ रां राहवे नमः",
                    "technology, research, analytics, unconventional breakthroughs", "तकनीक, शोध, मीडिया और नवीन प्रयोग",
                    "Avoid shortcuts, risky speculation, or scattered focus.", "शॉर्टकट, सट्टेबाजी और भ्रम से दूर रहें।",
                    "Keep desk clutter-free, feed birds, and plan in writing.", "कार्यस्थल व्यवस्थित रखें, पक्षियों को दाना डालें और लिखित योजना बनाएं।"),
            5, new PlanetProfile(5, "Mercury (Budha)", "बुध (Budha)", "Earth", "पृथ्वी",
                    "Wednesday", "बुधवार", "Emerald Green", "हरा", "North", "उत्तर",
                    "1, 2, 5, 6", "—", "Emerald (Panna) / 4-Mukhi Rudraksha", "पन्ना / चतुर्मुखी रुद्राक्ष",
                    "ॐ बुं बुधाय नमः",
                    "business, communication, trade, finance & adaptability", "व्यापार, लेखन, गणना और संवाद कौशल",
                    "Avoid juggling too many tasks at once without finishing one.", "एक साथ अनेक कार्यों में उलझने से बचें।",
                    "Water Tulsi daily, wear green on Wednesdays, chant Vishnu Sahasranama.", "प्रतिदिन तुलसी को जल दें, बुधवार को हरा रंग धारण करें।"),
            6, new PlanetProfile(6, "Venus (Shukra)", "शुक्र (शुक्र)", "Water", "जल",
                    "Friday", "शुक्रवार", "Cream / Rose White", "क्रीम / गुलाबी", "South-East", "आग्नेय (दक्षिण-पूर्व)",
                    "1, 5, 6, 7", "3", "Diamond / Opal / 6-Mukhi Rudraksha", "हीरा / ओपल / छहमुखी रुद्राक्ष",
                    "ॐ शुं शुक्राय नमः",
                    "harmony, design, luxury, hospitality & family prosperity", "कला, डिज़ाइन, वैभव और पारिवारिक सुख",
                    "Avoid overspending on luxuries or people-pleasing.", "दिखावे व अनावश्यक खर्च से बचें।",
                    "Keep surroundings fragrant & clean; recite Sri Suktam on Fridays.", "शुक्रवार को श्री सूक्त का पाठ करें और घर में स्वच्छता रखें।"),
            7, new PlanetProfile(7, "Ketu", "केतु", "Fire / Ether", "अग्नि / आकाश",
                    "Tuesday / Thursday", "मंगलवार / गुरुवार", "Ochre / Light Yellow", "गेरुआ / हल्का पीला", "North-East", "ईशान",
                    "1, 4, 5, 6", "2", "Cat's Eye (Lehsunia) / 9-Mukhi Rudraksha", "लहसुनिया / नौमुखी रुद्राक्ष",
                    "ॐ कें केतवे नमः",
                    "deep research, spirituality, healing & sharp intuition", "गूढ़ अध्ययन, ध्यान, शोध और आत्मबोध",
                    "Avoid isolation or over-skepticism in close relationships.", "अकेलेपन और अत्यधिक संदेह से बचें।",
                    "Practice 10 min Anulom-Vilom & Ganesh Atharvashirsha daily.", "गणेश अथर्वशीर्ष का पाठ व 10 मिनट अनुलोम-विलोम करें।"),
            8, new PlanetProfile(8, "Saturn (Shani)", "शनि (Shani)", "Air", "वायु",
                    "Saturday", "शनिवार", "Navy / Indigo", "गहरा नीला", "West", "पश्चिम",
                    "3, 5, 6, 7", "1, 2, 9", "Blue Sapphire (Neelam - after trial) / 7-Mukhi Rudraksha", "नीलम (परामर्श से) / सातमुखी रुद्राक्ष",
                    "ॐ शं शनैश्चराय नमः",
                    "long-term wealth, law, engineering, discipline & justice", "दीर्घकालिक सफलता, न्याय, निर्माण और स्थिरता",
                    "Avoid pessimism, delays from procrastination, or harsh speech.", "निराशा, आलस्य और कठोर वाणी से बचें।",
                    "Light sesame oil diya on Saturdays & help the needy honestly.", "शनिवार को सरसों/तिल के तेल का दीपक जलाएं और परिश्रम करें।"),
            9, new PlanetProfile(9, "Mars (Mangala)", "मंगल (Mangala)", "Fire", "अग्नि",
                    "Tuesday", "मंगलवार", "Coral Red / Vermilion", "लाल / सिंदूरी", "South", "दक्षिण",
                    "1, 2, 3, 9", "8", "Red Coral (Moonga) / 3-Mukhi Rudraksha", "मूंगा / तीनमुखी रुद्राक्ष",
                    "ॐ अं अंगारकाय नमः",
                    "courage, execution, sports, real estate & leadership", "साहस, भूमि-भवन, नेतृत्व और कर्मठता",
                    "Control anger, impulsiveness, and heated arguments.", "क्रोध, जल्दबाजी और व्यर्थ विवाद से बचें।",
                    "Recite Hanuman Chalisa on Tuesdays & channel energy into exercise.", "मंगलवार को हनुमान चालीसा का पाठ करें और नियमित व्यायाम करें।")
    );

    private static final String[] RASHI_EN = {
            "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
            "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
            "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
    };
    private static final String[] RASHI_HI = {
            "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
            "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
    };
    private static final int[] RASHI_PLANET = {9, 6, 5, 2, 1, 5, 6, 9, 3, 8, 8, 3};

    private static final Pattern DATE_PATTERN = Pattern.compile("(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}|\\d{1,2}[-/]\\d{1,2}[-/]\\d{4})");

    public String buildHolisticInsight(
            String question,
            String lang,
            String personName,
            String birthDate,
            String birthTime,
            String birthPlace,
            String gender,
            String category,
            PanchangDto panchang) {

        boolean hi = "hi".equalsIgnoreCase(lang) || "sa".equalsIgnoreCase(lang);
        String resolvedDate = (birthDate != null && !birthDate.isBlank()) ? birthDate.trim() : extractDateFromQuestion(question);
        LocalDate parsedDate = parseDate(resolvedDate);
        String cleanName = personName != null ? personName.trim() : "";

        Integer mulank = parsedDate != null ? reduceToSingleDigit(parsedDate.getDayOfMonth()) : null;
        Integer bhagyank = parsedDate != null ? computeLifePath(parsedDate) : null;
        Integer personalYear = parsedDate != null ? computePersonalYear(parsedDate) : null;
        Integer chaldeanNamank = !cleanName.isBlank() ? computeChaldeanNameNumber(cleanName) : null;
        Integer pythagoreanNamank = !cleanName.isBlank() ? computePythagoreanNameNumber(cleanName) : null;

        int coreNum = bhagyank != null ? bhagyank : (mulank != null ? mulank : (chaldeanNamank != null ? chaldeanNamank : 3));
        PlanetProfile primary = PLANETS.get(coreNum);

        StringBuilder sb = new StringBuilder();

        // 1. ASTROLOGY SECTION
        sb.append(hi ? "🔮 1. वैदिक ज्योतिष (Astrology & Kundli Overview):\n" : "🔮 1. Vedic Astrology (Kundli & Planetary Overview):\n");
        if (parsedDate != null) {
            int sunIdx = sunRashiIndex(parsedDate.getMonthValue(), parsedDate.getDayOfMonth());
            PlanetProfile rashiLord = PLANETS.get(RASHI_PLANET[sunIdx]);
            sb.append(hi
                    ? String.format("• सूर्य राशि: %s | स्वामी: %s | तत्व: %s\n", RASHI_HI[sunIdx], rashiLord.planetHi(), rashiLord.elementHi())
                    : String.format("• Solar Rashi: %s | Ruler: %s | Element: %s\n", RASHI_EN[sunIdx], rashiLord.planetEn(), rashiLord.elementEn()));

            if (birthTime != null && !birthTime.isBlank()) {
                int lagnaIdx = estimateLagnaIndex(sunIdx, birthTime.trim());
                PlanetProfile lagnaLord = PLANETS.get(RASHI_PLANET[lagnaIdx]);
                String placeStr = (birthPlace != null && !birthPlace.isBlank()) ? " · " + birthPlace.trim() : "";
                sb.append(hi
                        ? String.format("• अनुमानित जन्म लग्न (%s%s): %s लग्न (लग्नेश: %s)\n", birthTime.trim(), placeStr, RASHI_HI[lagnaIdx], lagnaLord.planetHi())
                        : String.format("• Estimated Ascendant (%s%s): %s Lagna (Lord: %s)\n", birthTime.trim(), placeStr, RASHI_EN[lagnaIdx], lagnaLord.planetEn()));
            }
            int age = Math.max(1, Period.between(parsedDate, LocalDate.now()).getYears());
            sb.append(buildAgeDashaCue(age, hi));
        } else if (!cleanName.isBlank()) {
            sb.append("• ").append(computeNameRashi(cleanName, hi)).append("\n");
        }
        if (panchang != null) {
            sb.append(hi
                    ? String.format("• आज का पंचांग: %s | %s | नक्षत्र: %s\n", panchang.getWeekday(), panchang.getTithi(), panchang.getNakshatra())
                    : String.format("• Today's Panchang: %s | %s | Nakshatra: %s\n", panchang.getWeekday(), panchang.getTithi(), panchang.getNakshatra()));
        }
        sb.append("\n");

        // 2. NUMEROLOGY SECTION + 3x3 LO SHU GRID
        sb.append(hi ? "🔢 2. संपूर्ण अंक ज्योतिष (Numerology & 3×3 Lo Shu Grid):\n" : "🔢 2. Complete Numerology & 3×3 Lo Shu Grid:\n");
        if (parsedDate != null) {
            PlanetProfile mp = PLANETS.get(mulank);
            PlanetProfile bp = PLANETS.get(bhagyank);
            PlanetProfile yp = PLANETS.get(personalYear);
            sb.append(hi
                    ? String.format("• मूलांक (Mulank): %d [%s] | भाग्यांक (Bhagyank): %d [%s] | वर्षांक (%d): %d [%s]\n",
                    mulank, mp.planetHi(), bhagyank, bp.planetHi(), LocalDate.now().getYear(), personalYear, yp.planetHi())
                    : String.format("• Mulank: %d [%s] | Bhagyank: %d [%s] | Personal Year (%d): %d [%s]\n",
                    mulank, mp.planetEn(), bhagyank, bp.planetEn(), LocalDate.now().getYear(), personalYear, yp.planetEn()));
            sb.append(buildLoShuAnalysis(parsedDate, mulank, bhagyank, hi));
        }
        if (chaldeanNamank != null) {
            PlanetProfile np = PLANETS.get(chaldeanNamank);
            String compat = (mulank != null) ? compatibilityLabel(chaldeanNamank, mulank, hi) : "";
            sb.append(hi
                    ? String.format("• नामांक (%s): Chaldean %d (%s) | Pythagorean %d%s\n", cleanName, chaldeanNamank, np.planetHi(), pythagoreanNamank, compat)
                    : String.format("• Name Number (%s): Chaldean %d (%s) | Pythagorean %d%s\n", cleanName, chaldeanNamank, np.planetEn(), pythagoreanNamank, compat));
        }
        sb.append(hi
                ? String.format("• मित्र अंक: %s | सावधान अंक: %s | रत्न/रुद्राक्ष: %s\n\n", primary.friendlyNums(), primary.avoidNums(), primary.gemHi())
                : String.format("• Friendly Numbers: %s | Avoid: %s | Gem/Rudraksha: %s\n\n", primary.friendlyNums(), primary.avoidNums(), primary.gemEn()));

        // 2B. ASTROLOGICAL DOSHA & MUHURAT CHECKS (AstroTalk-style)
        sb.append(hi ? "⚖️ ग्रह-दोष एवं शुभ तिथि जांच (Dosha & Timing Check):\n" : "⚖️ Planetary Dosha & Shubh Timing Check:\n");
        boolean marsStrong = (mulank != null && mulank == 9) || (bhagyank != null && bhagyank == 9);
        boolean shaniStrong = (mulank != null && mulank == 8) || (bhagyank != null && bhagyank == 8);
        boolean rahuKetu = (mulank != null && (mulank == 4 || mulank == 7));
        sb.append(hi
                ? String.format("• मंगल ऊर्जा (Mangal): %s\n", marsStrong ? "उच्च पराक्रम योग — क्रोध नियंत्रण व मंगलवार हनुमान चालीसा शुभ।" : "संतुलित — सामान्य स्थिति।")
                : String.format("• Mars (Mangal) Energy: %s\n", marsStrong ? "High drive — channel into action & Tuesdays Hanuman Chalisa." : "Balanced."));
        sb.append(hi
                ? String.format("• शनि दशा/अनुशासन (Shani): %s\n", shaniStrong ? "कर्म-प्रधान शनि योग — धैर्य और शनिवार दीपदान से बड़ा लाभ।" : "स्थिर व सहायक।")
                : String.format("• Saturn (Shani) Karma: %s\n", shaniStrong ? "Karma-focused — steady patience & Saturday sesame diya brings breakthroughs." : "Steady & supportive."));
        sb.append(hi
                ? String.format("• राहु-केतु स्थिति: %s\n", rahuKetu ? "आकस्मिक परिवर्तन संभव — निर्णय लिखित व सोच-समझकर लें।" : "संतुलित।")
                : String.format("• Rahu-Ketu Balance: %s\n", rahuKetu ? "Avoid rushed shortcuts; verify details in writing." : "Balanced."));
        sb.append(hi
                ? String.format("• शुभ तिथियाँ (हर माह): %s | उत्तम समय: प्रातः सूर्योदय से 2 घंटे\n\n", primary.friendlyNums())
                : String.format("• Lucky Monthly Dates: %s | Best Daily Window: Within 2 hrs of sunrise\n\n", primary.friendlyNums()));

        // 3. ALL LIFE AREAS ACCORDING TO ASTROLOGY + NUMEROLOGY
        sb.append(hi ? "🌐 3. जीवन के सभी प्रमुख क्षेत्र (All Life Areas):\n" : "🌐 3. Complete Life-Areas Breakdown:\n");
        sb.append(hi
                ? String.format("• करियर व व्यवसाय: %s प्रबल — %s को प्रमुख निर्णय लें और %s दिशा में कार्य करें।\n", primary.strengthHi(), primary.dayHi(), primary.directionHi())
                : String.format("• Career & Business: Strong in %s — schedule key moves on %s facing %s.\n", primary.strengthEn(), primary.dayEn(), primary.directionEn()));
        sb.append(hi
                ? String.format("• धन व समृद्धि: स्थिर वृद्धि योग — %s रंग व उत्तर/ईशान कोण (वास्तु) की स्वच्छता से धन प्रवाह बढ़ेगा।\n", primary.colorHi())
                : String.format("• Wealth & Finance: Steady growth — using %s hues and keeping North/North-East clean boosts flow.\n", primary.colorEn()));
        sb.append(hi
                ? String.format("• विवाह व संबंध: %s\n", primary.cautionHi())
                : String.format("• Love, Marriage & Family: %s\n", primary.cautionEn()));
        sb.append(hi
                ? String.format("• स्वास्थ्य व ऊर्जा: %s तत्व सक्रिय — प्रातः 10 मिनट अनुलोम-विलोम व सूर्य नमस्कार करें।\n\n", primary.elementHi())
                : String.format("• Health & Vitality: %s element active — practice 10 min morning Anulom-Vilom & Surya Namaskar.\n\n", primary.elementEn()));

        // 4. FINAL OVERALL CONCLUSION & ACTION PLAN
        String intent = (category != null && !category.isBlank() && !"General".equalsIgnoreCase(category))
                ? category.trim().toUpperCase(Locale.ROOT)
                : detectIntent(question);
        sb.append(hi ? "✅ 4. अंतिम निष्कर्ष व सटीक उपाय (Final Conclusion):\n" : "✅ 4. Final Conclusion & Action Plan:\n");
        sb.append("• ").append(buildDirectVerdict(intent, hi, mulank, bhagyank, personalYear, chaldeanNamank)).append("\n");
        sb.append(hi
                ? String.format("• शुभ दिन: %s | शुभ रंग: %s | शुभ दिशा: %s\n", primary.dayHi(), primary.colorHi(), primary.directionHi())
                : String.format("• Best Day: %s | Lucky Color: %s | Best Direction: %s\n", primary.dayEn(), primary.colorEn(), primary.directionEn()));
        sb.append(hi
                ? "• मंत्र व उपाय: " + primary.mantra() + " (11/27 बार) — " + primary.remedyHi()
                : "• Mantra & Remedy: " + primary.mantra() + " (11/27x daily) — " + primary.remedyEn());

        return sb.toString().trim();
    }

    private String buildDirectVerdict(String intent, boolean hi, Integer mulank, Integer bhagyank, Integer yearNum, Integer namank) {
        PlanetProfile focus = PLANETS.get(yearNum != null ? yearNum : (bhagyank != null ? bhagyank : (mulank != null ? mulank : 3)));
        return switch (intent) {
            case "CAREER" -> hi
                    ? String.format("निष्कर्ष (करियर): %s आपके पक्ष में है (%s)। %s को महत्वपूर्ण आवेदन/निर्णय लें।", focus.planetHi(), focus.strengthHi(), focus.dayHi())
                    : String.format("Conclusion (Career): %s favors you (%s). Make key career moves on %s.", focus.planetEn(), focus.strengthEn(), focus.dayEn());
            case "WEALTH", "BUSINESS" -> hi
                    ? String.format("निष्कर्ष (धन/व्यापार): %s के अनुसार योजनाबद्ध वृद्धि शुभ है। %s को वित्तीय कार्य करें।", focus.planetHi(), focus.dayHi())
                    : String.format("Conclusion (Wealth): %s supports planned financial growth; execute key steps on %s.", focus.planetEn(), focus.dayEn());
            case "RELATIONSHIP", "MARRIAGE" -> hi
                    ? String.format("निष्कर्ष (संबंध): %s व धैर्य से संबंध मधुर रहेंगे। %s को संवाद पहल करें।", focus.planetHi(), focus.dayHi())
                    : String.format("Conclusion (Relationships): %s with calm dialogue brings harmony; initiate talks on %s.", focus.planetEn(), focus.dayEn());
            case "HEALTH" -> hi
                    ? String.format("निष्कर्ष (स्वास्थ्य): %s तत्व संतुलित रखने के लिए प्राणायाम व नियमित दिनचर्या अपनाएं।", focus.elementHi())
                    : String.format("Conclusion (Health): Daily pranayama and steady routine balance your %s element.", focus.elementEn());
            case "VASTU" -> hi
                    ? String.format("निष्कर्ष (वास्तु): %s और ईशान कोण को प्रकाशमय रखें; %s रंग शुभ है।", focus.directionHi(), focus.colorHi())
                    : String.format("Conclusion (Vastu): Keep %s and North-East bright; %s tones bring harmony.", focus.directionEn(), focus.colorEn());
            default -> hi
                    ? String.format("समग्र निष्कर्ष: आपके लिए %s (%s) सबसे प्रबल शक्ति है। %s, %s दिशा और %s रंग सफलता देंगे%s।",
                    focus.planetHi(), focus.strengthHi(), focus.dayHi(), focus.directionHi(), focus.colorHi(),
                    namank != null ? " (नामांक " + namank + " सहायक)" : "")
                    : String.format("Overall Conclusion: %s (%s) is your strongest asset. %s, %s direction & %s color bring peak alignment%s.",
                    focus.planetEn(), focus.strengthEn(), focus.dayEn(), focus.directionEn(), focus.colorEn(),
                    namank != null ? " (Name #" + namank + " active)" : "");
        };
    }

    private String buildLoShuAnalysis(LocalDate d, int mulank, int bhagyank, boolean hi) {
        String digits = String.format("%02d%02d%04d", d.getDayOfMonth(), d.getMonthValue(), d.getYear())
                + mulank + bhagyank;
        int[] counts = new int[10];
        for (char c : digits.toCharArray()) {
            if (c >= '1' && c <= '9') {
                counts[c - '0']++;
            }
        }
        List<Integer> present = new ArrayList<>();
        List<Integer> missing = new ArrayList<>();
        for (int i = 1; i <= 9; i++) {
            if (counts[i] > 0) present.add(i);
            else missing.add(i);
        }
        String grid = String.format("  [ %s | %s | %s ]\n  [ %s | %s | %s ]\n  [ %s | %s | %s ]\n",
                cell(counts, 4), cell(counts, 9), cell(counts, 2),
                cell(counts, 3), cell(counts, 5), cell(counts, 7),
                cell(counts, 8), cell(counts, 1), cell(counts, 6));

        List<String> yogas = new ArrayList<>();
        if (counts[4] > 0 && counts[9] > 0 && counts[2] > 0) yogas.add(hi ? "मानसिक योग (4-9-2)" : "Mental Plane (4-9-2)");
        if (counts[3] > 0 && counts[5] > 0 && counts[7] > 0) yogas.add(hi ? "आध्यात्मिक योग (3-5-7)" : "Spiritual/Emotional Plane (3-5-7)");
        if (counts[8] > 0 && counts[1] > 0 && counts[6] > 0) yogas.add(hi ? "व्यावहारिक सफलता योग (8-1-6)" : "Practical Success Plane (8-1-6)");
        if (counts[4] > 0 && counts[5] > 0 && counts[6] > 0) yogas.add(hi ? "राज योग / धन योग (4-5-6)" : "Raj Yoga Plane (4-5-6)");
        if (counts[2] > 0 && counts[5] > 0 && counts[8] > 0) yogas.add(hi ? "भूमि-भवन योग (2-5-8)" : "Silver Property Yoga (2-5-8)");

        StringBuilder out = new StringBuilder();
        out.append(hi ? "• 3×3 लो शू ग्रिड (Lo Shu Grid):\n" : "• 3×3 Lo Shu Grid:\n").append(grid);
        out.append(hi
                ? String.format("• उपस्थित अंक: %s | अनुपस्थित अंक: %s\n", present, missing)
                : String.format("• Present Digits: %s | Missing Digits: %s\n", present, missing));
        if (!yogas.isEmpty()) {
            out.append(hi ? "• सक्रिय योग: " : "• Active Planes/Yogas: ").append(String.join(", ", yogas)).append("\n");
        }
        if (!missing.isEmpty()) {
            int keyMissing = missing.get(0);
            PlanetProfile mp = PLANETS.get(keyMissing);
            out.append(hi
                    ? String.format("• अनुपस्थित अंक (%d - %s) संतुलन: %s\n", keyMissing, mp.planetHi(), mp.remedyHi())
                    : String.format("• Missing Digit (%d - %s) Remedy: %s\n", keyMissing, mp.planetEn(), mp.remedyEn()));
        }
        return out.toString();
    }

    private String cell(int[] counts, int num) {
        return counts[num] > 0 ? String.valueOf(num).repeat(Math.min(counts[num], 3)) : "—";
    }

    private String compatibilityLabel(int namank, int mulank, boolean hi) {
        if (namank == mulank) return hi ? " [अति शुभ मेल]" : " [Strong Harmony]";
        int diff = Math.abs(namank - mulank);
        if (diff == 2 || diff == 4) return hi ? " [मध्यम — धैर्य रखें]" : " [Moderate]";
        return hi ? " [शुभ सहायक]" : " [Supportive]";
    }

    private int estimateLagnaIndex(int sunIdx, String birthTime) {
        int hour = 6;
        try {
            String[] parts = birthTime.replaceAll("[^0-9:]", "").split(":");
            if (parts.length >= 1 && !parts[0].isEmpty()) {
                hour = Integer.parseInt(parts[0]) % 24;
            }
        } catch (Exception ignored) {
        }
        int offset = ((hour - 6 + 24) % 24) / 2;
        return (sunIdx + offset) % 12;
    }

    private String buildAgeDashaCue(int age, boolean hi) {
        String phase = age <= 24 ? (hi ? "विद्या एवं आधार निर्माण काल (बुध/गुरु बल)" : "Foundation & Learning Cycle (Mercury/Jupiter)")
                : age <= 42 ? (hi ? "कर्म, करियर व गृहस्थ उत्कर्ष काल (सूर्य/मंगल/शुक्र बल)" : "Career & Expansion Cycle (Sun/Mars/Venus)")
                : (hi ? "परिपक्वता, नेतृत्व व आध्यात्मिक स्थिरता काल (गुरु/शनि बल)" : "Mastery, Advisory & Wisdom Cycle (Jupiter/Saturn)");
        return (hi ? "• आयु दशा चरण (" + age + " वर्ष): " : "• Life-Cycle Phase (Age " + age + "): ") + phase + "\n";
    }

    private String detectIntent(String question) {
        String q = question == null ? "" : question.toLowerCase(Locale.ROOT);
        if (containsAny(q, "career", "job", "work", "promotion", "exam", "study", "करियर", "नौकरी", "पढ़ाई")) return "CAREER";
        if (containsAny(q, "business", "money", "wealth", "finance", "debt", "rich", "lakshmi", "व्यापार", "धन", "पैसा", "लक्ष्मी", "कर्ज")) return "WEALTH";
        if (containsAny(q, "marriage", "love", "wife", "husband", "partner", "relation", "family", "शादी", "विवाह", "प्रेम", "रिश्त", "परिवार")) return "RELATIONSHIP";
        if (containsAny(q, "health", "stress", "anxiety", "fear", "peace", "sleep", "sick", "स्वास्थ्य", "तनाव", "चिंता", "शांति", "डर", "नींद")) return "HEALTH";
        if (containsAny(q, "vastu", "house", "home", "direction", "वास्तु", "घर", "दिशा")) return "VASTU";
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
            if (parts[0].length() == 4) return LocalDate.of(p0, p1, p2);
            if (parts[2].length() == 4) return LocalDate.of(p2, p1, p0);
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
        return reduceToSingleDigit(d.getYear() + d.getMonthValue() + d.getDayOfMonth());
    }

    private int computePersonalYear(LocalDate d) {
        int yr = LocalDate.now().getYear();
        return reduceToSingleDigit(d.getDayOfMonth() + d.getMonthValue() + yr);
    }

    private int computeChaldeanNameNumber(String name) {
        String clean = name.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");
        if (clean.isEmpty()) return reduceToSingleDigit(Math.max(1, name.trim().length()));
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

    private int computePythagoreanNameNumber(String name) {
        String clean = name.toUpperCase(Locale.ROOT).replaceAll("[^A-Z]", "");
        if (clean.isEmpty()) return reduceToSingleDigit(Math.max(1, name.trim().length()));
        int total = 0;
        for (char c : clean.toCharArray()) {
            total += ((c - 'A') % 9) + 1;
        }
        return reduceToSingleDigit(total);
    }

    private int sunRashiIndex(int m, int d) {
        int md = m * 100 + d;
        if (md >= 414 && md <= 514) return 0;
        if (md >= 515 && md <= 614) return 1;
        if (md >= 615 && md <= 715) return 2;
        if (md >= 716 && md <= 816) return 3;
        if (md >= 817 && md <= 916) return 4;
        if (md >= 917 && md <= 1016) return 5;
        if (md >= 1017 && md <= 1115) return 6;
        if (md >= 1116 && md <= 1215) return 7;
        if (md >= 1216 || md <= 114) return 8;
        if (md >= 115 && md <= 212) return 9;
        if (md >= 213 && md <= 314) return 10;
        return 11;
    }

    private String computeNameRashi(String name, boolean hi) {
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
}
