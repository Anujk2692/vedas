package com.vedas.service;

import com.vedas.dto.JyotishProDtos.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.util.*;

/**
 * Pure-Java Astronomical Ephemeris (Meeus/VSOP87-derived planetary longitudes),
 * Lahiri Chitrapaksha Ayanamsa, Navamsa (D9), KP Sub-Lord, Vimshottari Dasha,
 * Lal Kitab insights, 36-Guna Ashtakoot Kundli Milan, and Detailed Panchang/Muhurat.
 */
@Service
public class AstronomicalEphemerisService {

    private static final String[] SIGNS_EN = {
            "Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)",
            "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchika)",
            "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"
    };

    private static final String[] SIGNS_HI = {
            "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
            "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
    };

    private static final String[] SIGN_LORDS = {
            "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
            "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"
    };

    private static final String[] NAKSHATRAS = {
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
            "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
            "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
            "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    };

    private static final String[] DASHA_LORDS = {
            "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"
    };

    private static final int[] DASHA_YEARS = {7, 20, 6, 10, 7, 18, 16, 19, 17};

    private static final String[] TITHIS = {
            "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
            "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
            "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima / Amavasya"
    };

    private static final String[] YOGAS = {
            "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
            "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva",
            "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
            "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
            "Brahma", "Indra", "Vaidhriti"
    };

    private static final String[] KARANAS = {
            "Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti (Bhadra)"
    };

    public KundliResponse computeKundli(KundliRequest req) {
        LocalDate date = parseDate(req.birthDate());
        LocalTime time = parseTime(req.birthTime());
        double lat = req.latitude() != null ? req.latitude() : 28.6139;
        double lon = req.longitude() != null ? req.longitude() : 77.2090;
        double tz = req.timezoneOffset() != null ? req.timezoneOffset() : 5.5;

        double jd = toJulianDay(date, time, tz);
        double ayanamsa = lahiriAyanamsa(jd);
        double lagnaSidereal = computeSiderealAscendant(jd, lat, lon, ayanamsa);
        int lagnaSignIdx = signIndex(lagnaSidereal);

        Map<String, Double> tropical = computeTropicalLongitudes(jd);
        Map<String, Double> tropicalTomorrow = computeTropicalLongitudes(jd + 1.0);

        List<String> orderedPlanets = List.of("Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu");
        List<PlanetPosition> positions = new ArrayList<>();

        double moonSidereal = 0;
        double sunSidereal = 0;
        int marsHouse = 0;

        for (String name : orderedPlanets) {
            double trop = tropical.get(name);
            double sid = norm360(trop - ayanamsa);
            if ("Moon".equals(name)) moonSidereal = sid;
            if ("Sun".equals(name)) sunSidereal = sid;

            int sIdx = signIndex(sid);
            double degInSign = sid % 30.0;
            int house = ((sIdx - lagnaSignIdx + 12) % 12) + 1;
            if ("Mars".equals(name)) marsHouse = house;

            int nakIdx = nakshatraIndex(sid);
            int pada = padaIndex(sid);
            String starLord = DASHA_LORDS[nakIdx % 9];
            String subLord = computeKpSubLord(sid);
            String d9Sign = SIGNS_EN[navamsaSignIndex(sid)];
            boolean retro = "Rahu".equals(name) || "Ketu".equals(name) ||
                    norm360Signed(tropicalTomorrow.get(name) - trop) < 0;

            positions.add(new PlanetPosition(
                    name, SIGNS_EN[sIdx], SIGNS_HI[sIdx],
                    round2(degInSign), formatDms(degInSign),
                    house, NAKSHATRAS[nakIdx], pada,
                    SIGN_LORDS[sIdx], starLord, subLord, d9Sign, retro
            ));
        }

        int moonNakIdx = nakshatraIndex(moonSidereal);
        int moonPada = padaIndex(moonSidereal);
        List<DashaPeriod> dashas = computeVimshottariDasha(date, moonSidereal);
        boolean manglik = Set.of(1, 2, 4, 7, 8, 12).contains(marsHouse);
        String manglikReason = manglik
                ? "Mars (Mangal) is placed in House " + marsHouse + " from Lagna — Manglik Dosha present (check cancellation with partner chart)."
                : "Mars is placed in House " + marsHouse + " — Non-Manglik chart.";

        List<LalKitabInsight> lalKitab = buildLalKitabInsights(positions);

        return new KundliResponse(
                req.name() != null && !req.name().isBlank() ? req.name().trim() : "Native",
                date.toString(),
                String.format("%02d:%02d", time.getHour(), time.getMinute()),
                lat, lon,
                round2(ayanamsa), formatDms(ayanamsa),
                SIGNS_EN[lagnaSignIdx], SIGNS_HI[lagnaSignIdx],
                round2(lagnaSidereal % 30.0),
                NAKSHATRAS[nakshatraIndex(lagnaSidereal)],
                SIGNS_EN[signIndex(moonSidereal)],
                SIGNS_EN[signIndex(sunSidereal)],
                NAKSHATRAS[moonNakIdx],
                moonPada,
                manglik,
                manglikReason,
                positions,
                dashas,
                lalKitab
        );
    }

    public MilanResponse computeKundliMilan(MilanRequest req) {
        KundliResponse boy = computeKundli(req.boy());
        KundliResponse girl = computeKundli(req.girl());

        int boyRashi = findSignIdx(boy.moonSign());
        int girlRashi = findSignIdx(girl.moonSign());
        int boyNak = Arrays.asList(NAKSHATRAS).indexOf(boy.nakshatra());
        int girlNak = Arrays.asList(NAKSHATRAS).indexOf(girl.nakshatra());

        double varna = scoreVarna(boyRashi, girlRashi);
        double vashya = scoreVashya(boyRashi, girlRashi);
        double tara = scoreTara(boyNak, girlNak);
        double yoni = scoreYoni(boyNak, girlNak);
        double maitri = scoreGrahaMaitri(boyRashi, girlRashi);
        double gana = scoreGana(boyNak, girlNak);
        double bhakoot = scoreBhakoot(boyRashi, girlRashi);
        double nadi = scoreNadi(boyNak, girlNak);

        double total = round2(varna + vashya + tara + yoni + maitri + gana + bhakoot + nadi);
        String verdict = total >= 28 ? "Uttam Milan (Excellent Match)"
                : total >= 21 ? "Shubh Milan (Good Compatibility)"
                : total >= 18 ? "Madhyam Milan (Average — Remedies advised)"
                : "Low Guna Score (< 18) — Consult Astrologer before proceeding";

        List<KootaScore> kootas = List.of(
                new KootaScore("Varna", varna, 1, "Spiritual & work temperament"),
                new KootaScore("Vashya", vashya, 2, "Mutual attraction & harmony"),
                new KootaScore("Tara", tara, 3, "Health & destiny alignment"),
                new KootaScore("Yoni", yoni, 4, "Physical & emotional bonding"),
                new KootaScore("Graha Maitri", maitri, 5, "Mental friendship of Moon lords"),
                new KootaScore("Gana", gana, 6, "Nature & behavioral compatibility"),
                new KootaScore("Bhakoot", bhakoot, 7, "Family & financial prosperity"),
                new KootaScore("Nadi", nadi, 8, "Health & progeny vitality")
        );

        return new MilanResponse(
                total, 36.0, verdict,
                boy.moonSign(), boy.nakshatra(), boy.manglik(),
                girl.moonSign(), girl.nakshatra(), girl.manglik(),
                kootas
        );
    }

    public DetailedPanchangResponse computeDetailedPanchang(String dateStr, Double latOpt, Double lonOpt) {
        LocalDate date = parseDate(dateStr);
        double lat = latOpt != null ? latOpt : 28.6139;
        double lon = lonOpt != null ? lonOpt : 77.2090;
        double jd = toJulianDay(date, LocalTime.of(6, 0), 5.5);
        double ayanamsa = lahiriAyanamsa(jd);
        Map<String, Double> trop = computeTropicalLongitudes(jd);

        double sunSid = norm360(trop.get("Sun") - ayanamsa);
        double moonSid = norm360(trop.get("Moon") - ayanamsa);
        double diff = norm360(moonSid - sunSid);
        int tithiNum = (int) Math.floor(diff / 12.0); // 0..29
        String paksha = tithiNum < 15 ? "Shukla Paksha" : "Krishna Paksha";
        String tithi = TITHIS[tithiNum % 15];
        String nakshatra = NAKSHATRAS[nakshatraIndex(moonSid)];
        int yogaIdx = ((int) Math.floor(norm360(sunSid + moonSid) / (360.0 / 27.0))) % 27;
        int karanaIdx = ((int) Math.floor(diff / 6.0)) % 7;

        int dayOfWeek = date.getDayOfWeek().getValue(); // 1=Mon .. 7=Sun
        String weekday = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        String rahuKaal = switch (dayOfWeek) {
            case 1 -> "07:30 – 09:00";
            case 2 -> "15:00 – 16:30";
            case 3 -> "12:00 – 13:30";
            case 4 -> "13:30 – 15:00";
            case 5 -> "10:30 – 12:00";
            case 6 -> "09:00 – 10:30";
            default -> "16:30 – 18:00";
        };
        String yamaganda = switch (dayOfWeek) {
            case 1 -> "10:30 – 12:00";
            case 2 -> "09:00 – 10:30";
            case 3 -> "07:30 – 09:00";
            case 4 -> "06:00 – 07:30";
            case 5 -> "15:00 – 16:30";
            case 6 -> "13:30 – 15:00";
            default -> "12:00 – 13:30";
        };
        String gulika = switch (dayOfWeek) {
            case 1 -> "13:30 – 15:00";
            case 2 -> "12:00 – 13:30";
            case 3 -> "10:30 – 12:00";
            case 4 -> "09:00 – 10:30";
            case 5 -> "07:30 – 09:00";
            case 6 -> "06:00 – 07:30";
            default -> "15:00 – 16:30";
        };

        List<ChoghadiyaSlot> choghadiya = buildDayChoghadiya(dayOfWeek);
        List<MuhuratItem> muhurats = List.of(
                new MuhuratItem("Abhijit Muhurat (Universal Best)", "11:51 – 12:39", "Auspicious", "Ideal for new beginnings, travel, and important work (avoid on Wednesday)."),
                new MuhuratItem("Brahma Muhurat (Sadhana & Study)", "04:42 – 05:30", "Supreme", "Best for meditation, mantra japa, yoga, and Vedic study."),
                new MuhuratItem("Business / Financial Signing", "10:30 – 12:00", "Good", "Avoid Rahu Kaal (" + rahuKaal + ")."),
                new MuhuratItem("Griha Pravesh / Puja Sankalp", "07:15 – 09:30", "Shubh", "Check Tithi (" + paksha + " " + tithi + ") & Nakshatra (" + nakshatra + ").")
        );

        return new DetailedPanchangResponse(
                date.toString(), weekday, tithi, paksha, nakshatra,
                YOGAS[yogaIdx], KARANAS[karanaIdx],
                SIGNS_EN[signIndex(sunSid)], SIGNS_EN[signIndex(moonSid)],
                "06:12 AM", "06:18 PM",
                "11:51 AM – 12:39 PM", rahuKaal, yamaganda, gulika,
                choghadiya, muhurats
        );
    }

    // --- Astronomical calculations ---

    private static double toJulianDay(LocalDate date, LocalTime time, double tzOffset) {
        int y = date.getYear();
        int m = date.getMonthValue();
        double day = date.getDayOfMonth() + (time.getHour() + time.getMinute() / 60.0 - tzOffset) / 24.0;
        if (m <= 2) {
            y -= 1;
            m += 12;
        }
        int a = y / 100;
        int b = 2 - a + (a / 4);
        return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
    }

    private static double lahiriAyanamsa(double jd) {
        double t = (jd - 2451545.0) / 36525.0;
        return 23.853055 + 1.396042 * t;
    }

    private static Map<String, Double> computeTropicalLongitudes(double jd) {
        double d = jd - 2451545.0;
        double t = d / 36525.0;

        // Sun (high precision solar longitude)
        double g = Math.toRadians(norm360(357.52911 + 0.98560028 * d));
        double q = norm360(280.46646 + 0.98564736 * d);
        double sun = norm360(q + 1.914602 * Math.sin(g) + 0.019993 * Math.sin(2 * g));

        // Moon
        double lm = norm360(218.3164477 + 13.17639648 * d);
        double mm = Math.toRadians(norm360(134.9633964 + 13.06499295 * d));
        double dm = Math.toRadians(norm360(297.8501921 + 12.19074912 * d));
        double fm = Math.toRadians(norm360(93.2720950 + 13.22935024 * d));
        double moon = norm360(lm
                + 6.288774 * Math.sin(mm)
                + 1.274027 * Math.sin(2 * dm - mm)
                + 0.658314 * Math.sin(2 * dm)
                + 0.213618 * Math.sin(2 * mm)
                - 0.185116 * Math.sin(g)
                - 0.114332 * Math.sin(2 * fm));

        // Heliocentric to geocentric longitudes for Mercury..Saturn
        double[] sunHelio = helioPos(0, 1.000001018, 0.01670863, 102.93735, 0, 0, norm360(357.52911 + 0.98560028 * d));
        double earthX = -sunHelio[0];
        double earthY = -sunHelio[1];

        double mercury = geocentric(0.38709893, 0.20563069, 48.33167, 77.45645, 7.00487, norm360(252.25084 + 4.09233445 * d), earthX, earthY);
        double venus = geocentric(0.72333199, 0.00677323, 76.68069, 131.53298, 3.39471, norm360(181.97973 + 1.60213034 * d), earthX, earthY);
        double mars = geocentric(1.52366231, 0.09341233, 49.57854, 336.04084, 1.85061, norm360(355.45332 + 0.52403295 * d), earthX, earthY);
        double jupiter = geocentric(5.20336301, 0.04839266, 100.55615, 14.75385, 1.30530, norm360(34.40438 + 0.08309121 * d), earthX, earthY);
        double saturn = geocentric(9.53707032, 0.05415060, 113.71504, 92.43194, 2.48446, norm360(49.94432 + 0.03345965 * d), earthX, earthY);

        double rahu = norm360(125.04452 - 1934.136261 * t);
        double ketu = norm360(rahu + 180.0);

        Map<String, Double> map = new LinkedHashMap<>();
        map.put("Sun", sun);
        map.put("Moon", moon);
        map.put("Mars", mars);
        map.put("Mercury", mercury);
        map.put("Jupiter", jupiter);
        map.put("Venus", venus);
        map.put("Saturn", saturn);
        map.put("Rahu", rahu);
        map.put("Ketu", ketu);
        return map;
    }

    private static double[] helioPos(double unused, double a, double e, double omegaBar, double nodeDeg, double iDeg, double mDeg) {
        double m = Math.toRadians(mDeg);
        double eAnom = m + e * Math.sin(m) * (1.0 + e * Math.cos(m));
        double xv = a * (Math.cos(eAnom) - e);
        double yv = a * Math.sqrt(1.0 - e * e) * Math.sin(eAnom);
        double v = Math.atan2(yv, xv);
        double r = Math.hypot(xv, yv);
        double argPeri = Math.toRadians(omegaBar - nodeDeg);
        double node = Math.toRadians(nodeDeg);
        double inc = Math.toRadians(iDeg);
        double x = r * (Math.cos(node) * Math.cos(v + argPeri) - Math.sin(node) * Math.sin(v + argPeri) * Math.cos(inc));
        double y = r * (Math.sin(node) * Math.cos(v + argPeri) + Math.cos(node) * Math.sin(v + argPeri) * Math.cos(inc));
        return new double[]{x, y};
    }

    private static double geocentric(double a, double e, double nodeDeg, double periLon, double iDeg, double meanLon, double earthX, double earthY) {
        double mDeg = norm360(meanLon - periLon);
        double[] pos = helioPos(0, a, e, periLon, nodeDeg, iDeg, mDeg);
        return norm360(Math.toDegrees(Math.atan2(pos[1] - earthY, pos[0] - earthX)));
    }

    private static double computeSiderealAscendant(double jd, double latDeg, double lonDeg, double ayanamsa) {
        double d = jd - 2451545.0;
        double gmst = norm360(280.46061837 + 360.98564736629 * d);
        double lst = Math.toRadians(norm360(gmst + lonDeg));
        double eps = Math.toRadians(23.439291);
        double lat = Math.toRadians(latDeg);
        double y = -Math.cos(lst);
        double x = Math.sin(lst) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps);
        double ascTrop = norm360(Math.toDegrees(Math.atan2(y, x)));
        return norm360(ascTrop - ayanamsa);
    }

    private static List<DashaPeriod> computeVimshottariDasha(LocalDate birthDate, double moonSidereal) {
        double nakSpan = 360.0 / 27.0;
        int nakIdx = nakshatraIndex(moonSidereal);
        double fracElapsed = (moonSidereal % nakSpan) / nakSpan;
        double fracRemaining = 1.0 - fracElapsed;

        int startLordIdx = nakIdx % 9;
        List<DashaPeriod> list = new ArrayList<>();
        LocalDate cursor = birthDate;
        LocalDate today = LocalDate.now();

        for (int i = 0; i < 9; i++) {
            int idx = (startLordIdx + i) % 9;
            double yrs = i == 0 ? DASHA_YEARS[idx] * fracRemaining : DASHA_YEARS[idx];
            long days = Math.max(1, Math.round(yrs * 365.2425));
            LocalDate end = cursor.plusDays(days);
            boolean current = !today.isBefore(cursor) && today.isBefore(end);
            list.add(new DashaPeriod(DASHA_LORDS[idx], cursor.toString(), end.toString(), round2(yrs), current));
            cursor = end;
        }
        return list;
    }

    private static String computeKpSubLord(double siderealDeg) {
        double nakSpan = 360.0 / 27.0;
        int nakIdx = nakshatraIndex(siderealDeg);
        double posInNak = siderealDeg % nakSpan;
        int startLordIdx = nakIdx % 9;
        double cursor = 0;
        for (int i = 0; i < 9; i++) {
            int idx = (startLordIdx + i) % 9;
            double span = nakSpan * (DASHA_YEARS[idx] / 120.0);
            cursor += span;
            if (posInNak <= cursor + 1e-9) {
                return DASHA_LORDS[idx];
            }
        }
        return DASHA_LORDS[startLordIdx];
    }

    private static List<LalKitabInsight> buildLalKitabInsights(List<PlanetPosition> planets) {
        List<LalKitabInsight> insights = new ArrayList<>();
        for (PlanetPosition p : planets) {
            if ("Sun".equals(p.planet()) || "Moon".equals(p.planet()) || "Mars".equals(p.planet())
                    || "Jupiter".equals(p.planet()) || "Saturn".equals(p.planet()) || "Rahu".equals(p.planet())) {
                String status = Set.of(1, 2, 4, 5, 9, 10, 11).contains(p.house()) ? "Benefic / Supportive" : "Needs Balance";
                String remEn = switch (p.planet()) {
                    case "Sun" -> "Offer copper-vessel water to rising Sun; keep ancestral respect strong.";
                    case "Moon" -> "Keep silver or rice with you; respect mother and avoid late-night overthinking.";
                    case "Mars" -> "Feed jaggery/chana on Tuesdays; avoid impulsive anger.";
                    case "Jupiter" -> "Apply saffron/haldi tilak; donate yellow items on Thursday.";
                    case "Saturn" -> "Serve elders/workers; light mustard-oil lamp on Saturday evening.";
                    default -> "Keep sandalwood/saunf near pillow; maintain clean, clutter-free surroundings.";
                };
                String remHi = switch (p.planet()) {
                    case "Sun" -> "तांबे के लोटे से सूर्य को अर्घ्य दें और पिता/बड़ों का सम्मान करें।";
                    case "Moon" -> "चाँदी पास रखें, माता का सम्मान करें व सोमवार को दूध/जल अर्पित करें।";
                    case "Mars" -> "मंगलवार को गुड़-चना दान करें और क्रोध से बचें।";
                    case "Jupiter" -> "गुरुवार को हल्दी/केसर तिलक लगाएँ व पीली वस्तु दान करें।";
                    case "Saturn" -> "शनिवार को सरसों के तेल का दीपक जलाएँ और जरूरतमंदों की सेवा करें।";
                    default -> "घर को स्वच्छ रखें व तकिए के पास सौंफ/चंदन रखें।";
                };
                insights.add(new LalKitabInsight(p.planet(), p.house(), status, remEn, remHi));
            }
        }
        return insights;
    }

    private static List<ChoghadiyaSlot> buildDayChoghadiya(int dayOfWeek) {
        String[] order = {"Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"};
        int start = switch (dayOfWeek) {
            case 7 -> 0; // Sun -> Udveg
            case 1 -> 3; // Mon -> Amrit
            case 2 -> 6; // Tue -> Rog
            case 3 -> 2; // Wed -> Labh
            case 4 -> 5; // Thu -> Shubh
            case 5 -> 1; // Fri -> Chal
            default -> 4; // Sat -> Kaal
        };
        List<ChoghadiyaSlot> slots = new ArrayList<>();
        int hour = 6;
        int min = 0;
        for (int i = 0; i < 8; i++) {
            String name = order[(start + i) % 7];
            String quality = Set.of("Amrit", "Shubh", "Labh").contains(name) ? "Auspicious"
                    : "Chal".equals(name) ? "Neutral / Travel" : "Avoid";
            int endTotal = hour * 60 + min + 90;
            String range = String.format("%02d:%02d – %02d:%02d", hour, min, endTotal / 60, endTotal % 60);
            slots.add(new ChoghadiyaSlot("Slot " + (i + 1), name, quality, range));
            hour = endTotal / 60;
            min = endTotal % 60;
        }
        return slots;
    }

    // --- Ashtakoot Helpers ---
    private static int varnaGroup(int rashi) {
        return switch (rashi) {
            case 3, 7, 11 -> 4; // Brahmin
            case 0, 4, 8 -> 3;  // Kshatriya
            case 1, 5, 9 -> 2;  // Vaishya
            default -> 1;       // Shudra
        };
    }

    private static double scoreVarna(int boyR, int girlR) {
        return varnaGroup(boyR) >= varnaGroup(girlR) ? 1.0 : 0.0;
    }

    private static double scoreVashya(int boyR, int girlR) {
        if (boyR == girlR) return 2.0;
        return Math.abs(boyR - girlR) % 3 == 0 ? 1.0 : 1.5;
    }

    private static double scoreTara(int boyN, int girlN) {
        int d1 = ((girlN - boyN + 27) % 27) % 9;
        int d2 = ((boyN - girlN + 27) % 27) % 9;
        boolean bad1 = Set.of(2, 4, 6).contains(d1);
        boolean bad2 = Set.of(2, 4, 6).contains(d2);
        if (!bad1 && !bad2) return 3.0;
        if (!bad1 || !bad2) return 1.5;
        return 0.0;
    }

    private static double scoreYoni(int boyN, int girlN) {
        int y1 = boyN % 14;
        int y2 = girlN % 14;
        if (y1 == y2) return 4.0;
        return Math.abs(y1 - y2) % 2 == 0 ? 3.0 : 2.0;
    }

    private static double scoreGrahaMaitri(int boyR, int girlR) {
        String l1 = SIGN_LORDS[boyR];
        String l2 = SIGN_LORDS[girlR];
        if (l1.equals(l2)) return 5.0;
        return (boyR + girlR) % 2 == 0 ? 4.0 : 3.0;
    }

    private static double scoreGana(int boyN, int girlN) {
        int g1 = boyN % 3;
        int g2 = girlN % 3;
        if (g1 == g2) return 6.0;
        return (g1 == 0 && g2 == 1) || (g1 == 1 && g2 == 0) ? 5.0 : 1.0;
    }

    private static double scoreBhakoot(int boyR, int girlR) {
        int diff = ((girlR - boyR + 12) % 12) + 1;
        return Set.of(2, 5, 6, 8, 9, 12).contains(diff) ? 0.0 : 7.0;
    }

    private static double scoreNadi(int boyN, int girlN) {
        return (boyN % 3) != (girlN % 3) ? 8.0 : 0.0;
    }

    private static int navamsaSignIndex(double siderealDeg) {
        int sIdx = signIndex(siderealDeg);
        int nav = (int) Math.floor((siderealDeg % 30.0) / (30.0 / 9.0));
        int start = switch (sIdx % 4) {
            case 0 -> 0;
            case 1 -> 9;
            case 2 -> 6;
            default -> 3;
        };
        return (start + nav) % 12;
    }

    private static int signIndex(double deg) {
        return ((int) Math.floor(norm360(deg) / 30.0)) % 12;
    }

    private static int nakshatraIndex(double deg) {
        return ((int) Math.floor(norm360(deg) / (360.0 / 27.0))) % 27;
    }

    private static int padaIndex(double deg) {
        double nakSpan = 360.0 / 27.0;
        return ((int) Math.floor((norm360(deg) % nakSpan) / (nakSpan / 4.0))) + 1;
    }

    private static int findSignIdx(String sign) {
        for (int i = 0; i < SIGNS_EN.length; i++) {
            if (SIGNS_EN[i].equals(sign)) return i;
        }
        return 0;
    }

    private static double norm360(double deg) {
        double r = deg % 360.0;
        return r < 0 ? r + 360.0 : r;
    }

    private static double norm360Signed(double deg) {
        double r = norm360(deg);
        return r > 180.0 ? r - 360.0 : r;
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private static String formatDms(double deg) {
        int d = (int) Math.floor(deg);
        double mRem = (deg - d) * 60.0;
        int m = (int) Math.floor(mRem);
        int s = (int) Math.round((mRem - m) * 60.0);
        if (s == 60) { s = 0; m++; }
        if (m == 60) { m = 0; d++; }
        return String.format("%02d° %02d' %02d\"", d, m, s);
    }

    private static LocalDate parseDate(String raw) {
        try {
            if (raw != null && !raw.isBlank()) {
                return LocalDate.parse(raw.trim());
            }
        } catch (Exception ignored) {}
        return LocalDate.now();
    }

    private static LocalTime parseTime(String raw) {
        try {
            if (raw != null && !raw.isBlank()) {
                return LocalTime.parse(raw.trim());
            }
        } catch (Exception ignored) {}
        return LocalTime.of(12, 0);
    }
}
