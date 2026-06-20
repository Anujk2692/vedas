package com.vedas.config;

import com.vedas.model.AartiRecording;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Authentic aarti PDF, multi-singer audio (traditional + latest artists), and ceremonial video.
 */
public final class AartiMediaLibrary {

    private AartiMediaLibrary() {}

    private static final String PDF_ARCHIVE = "HindiBookAartiSangrahCompletebyGitaPress";
    private static final String PDF_FILE = "Hindi Book-Aarti-Sangrah (Complete )by Gita Press.pdf";
    private static final String VEDIC = "VedicChantings";
    private static final String DEVI_MODERN = "ShreeKaliJiKiAartiVarious48Raag.Me";
    private static final String KALI_STOTRAS = "SriBhadraKaliStotras";
    private static final String LATA_GANESHA = "01-shri-ganpati-chi-aarti";
    private static final String ANURADHA_KRISHNA = "KrishnaBhajan";
    private static final String ANURADHA_MEERA = "anuradha-paudwal-collection";

    private static final String[] IGNCA_VIDEOS = {
            "dni.ncaa.IGNCA-IG_08_DV_60_345-MDV/IGNCA-IG_08_DV_60_345-MDV.mp4",
            "dni.ncaa.IGNCA-IG_13_DV_60_878-MDV/IGNCA-IG_13_DV_60_878-MDV.mp4",
            "dni.ncaa.IGNCA-IG_13_DV_60_882-MDV/IGNCA-IG_13_DV_60_882-MDV.mp4",
            "dni.ncaa.IGNCA-IG_11_DV_60_1275-MDV/IGNCA-IG_11_DV_60_1275-MDV.mp4",
    };

    public static String pdfUrl() {
        return download(PDF_ARCHIVE, PDF_FILE);
    }

    public static String thumbnailUrl(int order) {
        return "https://archive.org/services/img/" + PDF_ARCHIVE + "?v=" + order;
    }

    public static List<AartiRecording> recordingsFor(String slug) {
        List<AartiRecording> list = new ArrayList<>(recordingsForSlug(slug));
        if (list.stream().noneMatch(r -> "VIDEO".equals(r.getType()))) {
            list.add(video(slug + "-ceremony", "Temple ceremony & ritual", "IGNCA Cultural Archive",
                    "Documentary · sacred ritual", slug, 480));
        }
        return list;
    }

    public static String primaryAudioUrl(String slug) {
        return recordingsFor(slug).stream()
                .filter(r -> "AUDIO".equals(r.getType()))
                .map(AartiRecording::getUrl)
                .findFirst()
                .orElse(download(VEDIC, "Shantimantrah.mp3"));
    }

    public static String primaryVideoUrl(String slug) {
        return recordingsFor(slug).stream()
                .filter(r -> "VIDEO".equals(r.getType()))
                .map(AartiRecording::getUrl)
                .findFirst()
                .orElse(videoUrl(slug));
    }

    public static String primaryReciter(String slug) {
        return recordingsFor(slug).stream()
                .filter(r -> "AUDIO".equals(r.getType()))
                .map(AartiRecording::getSinger)
                .findFirst()
                .orElse("Traditional singers");
    }

    public static int primaryAudioDuration(String slug) {
        return recordingsFor(slug).stream()
                .filter(r -> "AUDIO".equals(r.getType()))
                .mapToInt(AartiRecording::getDurationSeconds)
                .findFirst()
                .orElse(240);
    }

    public static int primaryVideoDuration() {
        return 600;
    }

    private static List<AartiRecording> recordingsForSlug(String slug) {
        return switch (slug) {
            case "ganesha" -> List.of(
                    audio("ganesha-shendur", "Shendur Laal Chadhayo", "Traditional Temple Singer",
                            "Classic Ganesha aarti", "shendur-laal-chadhayo-aarti", "Shendur Laal Chadhayo (Aarti).mp3", 195),
                    audio("ganesha-lata", "Shri Ganpati Chi Aarti", "Lata & Usha Mangeshkar",
                            "Marathi Ganesha aarti · classic", LATA_GANESHA, "01 shri ganpati chi aarti.mp3", 240),
                    audio("ganesha-siddhivinayak", "Siddhivinayak Mantra & Aarti", "Shree Siddhivinayak Temple",
                            "Mumbai temple recording", "shree-siddhivinayak-mantra-and-aarti",
                            "Shree_Siddhivinayak_Mantra_And_Aarti.mp3", 420),
                    audio("ganesha-gajanan", "Ghar Mein Padharo Gajanan Ji", "Devotional Bhajan Singer",
                            "Latest bhajan aarti · 2024", "ghar-mein-padharo-gajanan-ji_202409",
                            "Ghar-Mein-Padharo-Gajanan-Ji.mp3", 360),
                    vedic("ganesha-vedic", "Ganesh Atharvasheersham", "Ganeshatharvasheersham.mp3", 300)
            );
            case "shiva" -> List.of(
                    audio("shiva-aarti-hi", "Om Jai Shiv Omkara", "Traditional Hindi Singer",
                            "Latest Shiva aarti · 2026", "20260420_20260420_1940", "शिव आरती.mp3", 240),
                    audio("shiva-classical", "Shiva Bhajan", "Shruti Sadolikar",
                            "Classical devotional", "a_20210624_20210624", "A.mp3", 300),
                    audio("shiva-suresh", "Om Jayanti Mangala Kali", "Suresh Wadkar",
                            "Popular devotional path", KALI_STOTRAS,
                            "3.Mahakali Mantra-Om Jayanti Mangala Kali-Suresh Wadkar.MP3", 280),
                    vedic("shiva-sivopasana", "Shiva Upasana Path", "Sivopasana.mp3", 360),
                    vedic("shiva-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180)
            );
            case "vishnu", "vitthal" -> List.of(
                    audio("vishnu-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal Vishnu aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    audio("vishnu-anuradha-ram", "Jai Jai Ram Ramaia", "Anuradha Paudwal",
                            "Ram / Vishnu bhajan", ANURADHA_KRISHNA, "ASideTrack2JaiJaiRamRamaia.mp3", 300),
                    audio("vishnu-meera", "Meera Bhajans", "Anuradha Paudwal",
                            "Meera devotional · classic", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/01 Meera Bhajans - Side A.mp3", 320),
                    vedic("vishnu-suktam", "Vishnu Suktam", "Vishnu Suktam.mp3", 240),
                    vedic("vishnu-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            case "krishna" -> List.of(
                    audio("krishna-anuradha-latest", "Aarti Kunj Bihari Ki", "Anuradha Paudwal",
                            "Latest Janmashtami aarti · 2026", "20260517_20260517_1331",
                            "जन्माष्टमी_आरती__आरती_कुंज_बिहारी_की,_Aarti_Kunj_Bihari_Ki,_Krishna_Ji_Ki_Aarti,_ANURADHA_PAUDWAL(256k).mp3", 320),
                    audio("krishna-kunj-bihari", "Aarti Kunj Bihari Ki", "Traditional Singer",
                            "Classic Krishna aarti", "MainAartiTeriGaun_201609", "aarti-kunj-bihari-ki.mp3", 260),
                    audio("krishna-anuradha-bhajan", "Krishna Bhajan", "Anuradha Paudwal",
                            "Studio Krishna bhajan", ANURADHA_KRISHNA, "ASideTrack1.mp3", 280),
                    vedic("krishna-purusha", "Purusha Suktam", "Purusha Suktam.mp3", 300),
                    vedic("krishna-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            case "rama" -> List.of(
                    audio("rama-anuradha", "Jai Jai Ram Ramaia", "Anuradha Paudwal",
                            "Popular Ram bhajan", ANURADHA_KRISHNA, "ASideTrack2JaiJaiRamRamaia.mp3", 300),
                    audio("rama-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Ram / Vishnu aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    audio("rama-meera", "Meera Bhajans", "Anuradha Paudwal",
                            "Meera Ram devotion", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/02 Meera Bhajans - Side B.mp3", 310),
                    vedic("rama-purusha", "Purusha Suktam", "Purusha Suktam.mp3", 300),
                    vedic("rama-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            case "hanuman" -> List.of(
                    audio("hanuman-aarti", "Aarti Keejai Hanuman Lala Ki", "Traditional Bhajan Singer",
                            "Classic Hanuman aarti", "fptu_aarti-keejei-hanuman-lala-ki", "AartiKeejeiHanumanLalaKi.mp3", 240),
                    audio("hanuman-nirmal", "Hanuman Aarti", "Bhai Nirmal Singh",
                            "Gurbani-style devotion", "bhai-nirmal-singh-aarti", "Bhai Nirmal Singh - Aarti.mp3", 300),
                    audio("hanuman-anuradha-ram", "Jai Jai Ram Ramaia", "Anuradha Paudwal",
                            "Hanuman–Ram devotion", ANURADHA_KRISHNA, "ASideTrack2JaiJaiRamRamaia.mp3", 300),
                    vedic("hanuman-bali", "Balittha Suktam", "Balittha Suktam.mp3", 180),
                    vedic("hanuman-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180)
            );
            case "durga" -> List.of(
                    audio("durga-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Classic Durga aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    modern("durga-jai-ambe", "Jai Ambe Gauri", "Various Artists · Raag.me",
                            "Popular Mata aarti", "Jai Ambe Gauri-Various[48]--Raag.Me--.mp3", 270),
                    modern("durga-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Devi aarti · modern", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("durga-anuradha-argala", "Argala Stotram", "Anuradha Paudwal",
                            "Durga Saptashati · studio", KALI_STOTRAS,
                            "8.Argala Stotram-Shri Durga Saptashati-Anuradha Paudwal.MP3", 300),
                    audio("durga-anuradha-kali", "Om Jayanti Mangla Kali", "Anuradha Paudwal",
                            "Devi aarti · Anuradha", KALI_STOTRAS,
                            "23.Om Jayanti Mangla Kali-Anuradha Paudwal.MP3", 290),
                    vedic("durga-suktam", "Durga Suktam", "Durga Suktam.mp3", 200)
            );
            case "kali" -> List.of(
                    modern("kali-jai-maa", "Aarti Jai Maa", "Various Artists · Raag.me",
                            "Kali aarti collection", "Aarti Jai Maa-Various[48]--Raag.Me--.mp3", 300),
                    modern("kali-shree", "Shree Kali Ji Ki Aarti", "Various Artists · Raag.me",
                            "Popular Kali aarti", "Shree Kali Ji Ki Aarti-Various[48]--Raag.Me--.mp3", 295),
                    audio("kali-anuradha-sahasranam", "Shri Kali Sahastranam", "Anuradha Paudwal",
                            "Kali stotram · studio", KALI_STOTRAS,
                            "19.Shri Kali Sahastranam Stotram-Anuradha Paudwal.MP3", 360),
                    audio("kali-anuradha-jayanti", "Om Jayanti Mangla Kali", "Anuradha Paudwal",
                            "Latest Kali aarti", KALI_STOTRAS,
                            "23.Om Jayanti Mangla Kali-Anuradha Paudwal.MP3", 290),
                    audio("kali-arti", "Kali Arti", "Shruti Vishwakarma & Artists",
                            "Traditional Kali arti", KALI_STOTRAS, "11.Kali Arti.MP3", 250),
                    vedic("kali-devi", "Devi Suktam", "Devi Suktam.mp3", 240)
            );
            case "lakshmi" -> List.of(
                    vedic("lakshmi-sri", "Sri Suktam", "Sri Suktam.mp3", 240),
                    audio("lakshmi-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Lakshmi / Vishnu aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    modern("lakshmi-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Maa Lakshmi devotion", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("lakshmi-anuradha", "Meera Bhajans", "Anuradha Paudwal",
                            "Bhakti for Maa", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/01 Meera Bhajans - Side A.mp3", 320),
                    vedic("lakshmi-bhagya", "Bhagya Suktam", "Bhagya Suktam.mp3", 180)
            );
            case "saraswati" -> List.of(
                    vedic("saraswati-suktam", "Saraswati Suktam", "Saraswati Suktam.mp3", 220),
                    vedic("saraswati-medha", "Medha Suktam", "Medha Suktam.mp3", 200),
                    audio("saraswati-anuradha", "Meera Bhajans", "Anuradha Paudwal",
                            "Classical devotion", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/01 Meera Bhajans - Side A.mp3", 320),
                    audio("saraswati-anuradha-bhajan", "Krishna Bhajan", "Anuradha Paudwal",
                            "Vidyā & bhakti", ANURADHA_KRISHNA, "BSideTrack1.mp3", 270),
                    vedic("saraswati-devi", "Devi Suktam", "Devi Suktam.mp3", 240)
            );
            case "parvati" -> List.of(
                    modern("parvati-jai-ambe", "Jai Ambe Gauri", "Various Artists · Raag.me",
                            "Parvati / Durga aarti", "Jai Ambe Gauri-Various[48]--Raag.Me--.mp3", 270),
                    audio("parvati-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Classic Mata aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    modern("parvati-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Devi aarti · modern", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("parvati-anuradha", "Argala Stotram", "Anuradha Paudwal",
                            "Durga Saptashati", KALI_STOTRAS,
                            "8.Argala Stotram-Shri Durga Saptashati-Anuradha Paudwal.MP3", 300),
                    vedic("parvati-devi", "Devi Suktam", "Devi Suktam.mp3", 240)
            );
            case "shani-dev" -> List.of(
                    audio("shani-aarti", "Jai Jai Shani Dev Aarti", "Traditional Singer",
                            "Shani Dev aarti", "shani_dev_aarti", "shani_dev_aarti.mp3", 240),
                    audio("shani-suresh", "Om Jayanti Mangala Kali", "Suresh Wadkar",
                            "Devotional path", KALI_STOTRAS,
                            "3.Mahakali Mantra-Om Jayanti Mangala Kali-Suresh Wadkar.MP3", 280),
                    audio("shani-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    vedic("shani-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180),
                    vedic("shani-bhagya", "Bhagya Suktam", "Bhagya Suktam.mp3", 180)
            );
            case "surya" -> List.of(
                    vedic("surya-bhagya", "Bhagya Suktam", "Bhagya Suktam.mp3", 180),
                    audio("surya-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    audio("surya-anuradha", "Jai Jai Ram Ramaia", "Anuradha Paudwal",
                            "Surya–Ram devotion", ANURADHA_KRISHNA, "ASideTrack2JaiJaiRamRamaia.mp3", 300),
                    vedic("surya-purusha", "Purusha Suktam", "Purusha Suktam.mp3", 300),
                    vedic("surya-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180)
            );
            case "kartikeya" -> List.of(
                    vedic("kartikeya-neela", "Neela Suktam", "Neela Suktam.mp3", 200),
                    audio("kartikeya-anuradha", "Krishna Bhajan", "Anuradha Paudwal",
                            "Skanda devotion", ANURADHA_KRISHNA, "BSideTrack2.mp3", 275),
                    modern("kartikeya-jai-ambe", "Jai Ambe Gauri", "Various Artists · Raag.me",
                            "Devi family aarti", "Jai Ambe Gauri-Various[48]--Raag.Me--.mp3", 270),
                    vedic("kartikeya-devi", "Devi Suktam", "Devi Suktam.mp3", 240),
                    vedic("kartikeya-ganesha", "Ganesh Atharvasheersham", "Ganeshatharvasheersham.mp3", 300)
            );
            case "ganga-maa" -> List.of(
                    modern("ganga-jai-ambe", "Jai Ambe Gauri", "Various Artists · Raag.me",
                            "River goddess aarti", "Jai Ambe Gauri-Various[48]--Raag.Me--.mp3", 270),
                    audio("ganga-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Classic Mata aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    modern("ganga-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Maa Ganga devotion", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    vedic("ganga-bhoo", "Bhoo Suktam", "Bhoo Suktam.mp3", 200),
                    vedic("ganga-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            case "annapurna" -> List.of(
                    vedic("annapurna-sri", "Sri Suktam", "Sri Suktam.mp3", 240),
                    modern("annapurna-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Annapurna as Maa", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("annapurna-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Maa aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    audio("annapurna-anuradha", "Meera Bhajans", "Anuradha Paudwal",
                            "Bhakti for Maa", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/01 Meera Bhajans - Side A.mp3", 320),
                    vedic("annapurna-go", "Go Suktam", "Go Suktam.mp3", 180)
            );
            case "santoshi-maa" -> List.of(
                    modern("santoshi-jai", "Jai Santoshi Mata", "Various Artists · Raag.me",
                            "Santoshi Maa aarti · popular", "Jai Santoshi Mata-Various[48]--Raag.Me--.mp3", 280),
                    audio("santoshi-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Devi aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    modern("santoshi-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Mata aarti", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("santoshi-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    vedic("santoshi-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180)
            );
            case "vaishno-devi" -> List.of(
                    modern("vaishno-jai-ambe", "Jai Ambe Gauri", "Various Artists · Raag.me",
                            "Vaishno Devi aarti", "Jai Ambe Gauri-Various[48]--Raag.Me--.mp3", 270),
                    modern("vaishno-jagdambe", "Ambe Tu Hai Jagdambe", "Various Artists · Raag.me",
                            "Maa Vaishno devotion", "Ambe Tu Hai Jagdambe-Various[48]--Raag.Me--.mp3", 265),
                    audio("vaishno-ambe", "Om Jai Ambe Gauri", "Traditional Mata Singer",
                            "Classic Mata aarti", "om-jai-ambe-mayiya", "Om Jai Ambe Mayiya.mp3", 260),
                    audio("vaishno-anuradha", "Argala Stotram", "Anuradha Paudwal",
                            "Durga Saptashati", KALI_STOTRAS,
                            "8.Argala Stotram-Shri Durga Saptashati-Anuradha Paudwal.MP3", 300),
                    vedic("vaishno-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            case "jagannath" -> List.of(
                    audio("jagannath-krishna-latest", "Aarti Kunj Bihari Ki", "Anuradha Paudwal",
                            "Latest Krishna aarti · 2026", "20260517_20260517_1331",
                            "जन्माष्टमी_आरती__आरती_कुंज_बिहारी_की,_Aarti_Kunj_Bihari_Ki,_Krishna_Ji_Ki_Aarti,_ANURADHA_PAUDWAL(256k).mp3", 320),
                    audio("jagannath-kunj", "Aarti Kunj Bihari Ki", "Traditional Singer",
                            "Jagannath–Krishna aarti", "MainAartiTeriGaun_201609", "aarti-kunj-bihari-ki.mp3", 260),
                    audio("jagannath-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    vedic("jagannath-purusha", "Purusha Suktam", "Purusha Suktam.mp3", 300),
                    vedic("jagannath-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180)
            );
            case "sai-baba" -> List.of(
                    audio("sai-jagdish", "Om Jai Jagdish Hare", "Bhakti Songs Ensemble",
                            "Universal Sai aarti", "y2mate.comomjaijagdishhareaartibhaktisongsvzx5jqnzd6u",
                            "y2mate.com - om_jai_jagdish_hare_aarti_bhakti_songs_Vzx5jQnzd6U.mp3", 280),
                    audio("sai-anuradha", "Meera Bhajans", "Anuradha Paudwal",
                            "Sai–Meera devotion", ANURADHA_MEERA,
                            "Anuradha Paudwal/Meera Bhajans/01 Meera Bhajans - Side A.mp3", 320),
                    modern("sai-santoshi", "Jai Santoshi Mata", "Various Artists · Raag.me",
                            "Mata aarti", "Jai Santoshi Mata-Various[48]--Raag.Me--.mp3", 280),
                    vedic("sai-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180),
                    vedic("sai-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
            default -> List.of(
                    vedic("default-shanti", "Shanti Mantra", "Shantimantrah.mp3", 180),
                    vedic("default-narayana", "Narayana Suktam", "Narayana Suktam.mp3", 210)
            );
        };
    }

    private static AartiRecording audio(String id, String title, String singer, String style,
                                        String archive, String file, int duration) {
        return new AartiRecording(id, "AUDIO", title, singer, style, download(archive, file), duration);
    }

    private static AartiRecording modern(String id, String title, String singer, String style,
                                         String file, int duration) {
        return new AartiRecording(id, "AUDIO", title, singer, style, download(DEVI_MODERN, file), duration);
    }

    private static AartiRecording vedic(String id, String title, String file, int duration) {
        return new AartiRecording(id, "AUDIO", title, "Vedic Chantings Archive",
                "Traditional Vedic patha", download(VEDIC, file), duration);
    }

    private static AartiRecording video(String id, String title, String singer, String style, String slug, int duration) {
        return new AartiRecording(id, "VIDEO", title, singer, style, videoUrl(slug), duration);
    }

    private static String videoUrl(String slug) {
        int idx = Math.abs(slug.hashCode()) % IGNCA_VIDEOS.length;
        return "https://archive.org/download/" + IGNCA_VIDEOS[idx];
    }

    private static String download(String item, String file) {
        return "https://archive.org/download/" + item + "/" + encode(file);
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
