package com.vedas.config;

import com.vedas.dto.ScripturePdfEditionDto;
import com.vedas.model.LocalizedText;
import com.vedas.model.Veda;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Authentic full-text PDF links (Gita Press, Archive.org) per scripture module. */
public final class ScripturePdfLibrary {

    private ScripturePdfLibrary() {}

    public record PdfEdition(String titleHi, String titleEn, String archiveId, String fileName, String source) {}

    private static final Map<String, List<PdfEdition>> EDITIONS = new LinkedHashMap<>();

    static {
        editions("gita",
                ed("श्रीमद्भगवद्गीता — गीता प्रेस (पूर्ण)", "Bhagavad Gita — Gita Press (Complete)",
                        "lKxu_shrimad-bhagavad-gita-gita-press", "Shrimad Bhagavad Gita - Gita Press.pdf"),
                ed("गीता संस्कृत + हिंदी — गोरखपुर प्रेस", "Gita Sanskrit + Hindi — Gorakhpur Press",
                        "shrimad-bhagwat-geeta-hindi-sanskrit-gorkhpur-press",
                        "Shrimad Bhagwat Geeta Hindi-Sanskrit (Gorkhpur Press).pdf"),
                ed("गीता साधारण भाषा टीका — गीता प्रेस", "Gita with Sadharan Bhasha Tika — Gita Press",
                        "gqGX_bhagvad-gita-with-sadharan-bhasha-tika-gita-press-gorakhpur",
                        "gqGX_bhagvad-gita-with-sadharan-bhasha-tika-gita-press-gorakhpur.pdf"));

        editions("ramcharitmanas",
                ed("श्री रामचरितमानस — गीता प्रेस (पूर्ण)", "Ramcharitmanas — Gita Press (Complete Hindi)",
                        "shri-ramcharitmanas-gita-press-hindi_202407",
                        "Shri Ramcharitmanas - Gita Press (Hindi).pdf"));

        editions("ramayana",
                ed("वाल्मीकि रामायण — गीता प्रेस (हिंदी)", "Valmiki Ramayana — Gita Press Hindi",
                        "WTRU_srimad-valmiki-ramayana-of-maharshi-valmiki-with-hindi-trans.-part-2-sundara-khn",
                        "Srimad Valmiki Ramayana Of Maharshi Valmiki With Hindi Trans., Part 2 (Sundara Khnada To Uttara Khanda) - Gita Press, Gorakhpur.pdf"));

        editions("mahabharata",
                ed("महाभारत — गीता प्रेस (हिंदी)", "Mahabharata — Gita Press Hindi",
                        "MNBX_mahabharata-of-maharshi-veda-vyasa-with-hindi-trans.-by-pt.-ramnarain-shastri-pa",
                        "Mahabharata Of Maharshi Veda Vyasa With Hindi Trans. By Pt. Ramnarain Shastri Pandey, Part 2 (Vana Parva To Virata Parva) - Gita Press, Gorakhpur.pdf"),
                ed("महाभारत — 6 खंड (संपूर्ण)", "Mahabharata — 6 Volume Set",
                        "mahabharata-6-vol.-set-veda-vyasa-veda-vyasa-z-library",
                        "Mahabharata (6 Vol. Set) (Veda Vyasa) (Veda vyasa) (Z-Library).pdf"));

        editions("upnishads",
                ed("ऐतरेय उपनिषद — शंकराचार्य (गीता प्रेस)", "Aitareya Upanishad — Shankaracharya (Gita Press)",
                        "ltbB_aitareya-upanishad-by-shankaracharya-gita-press-gorakhpur",
                        "Aitareya Upanishad By Shankaracharya - Gita Press, Gorakhpur.pdf"),
                ed("कल्याण उपनिषद् अंक — गीता प्रेस", "Kalyan Upanishad Special — Gita Press",
                        "eRee_kalyan-upanishad-ankha-hindi-editor-hanuman-prasad-poddar-23th-annual-special-ed",
                        "Kalyan Upanishad Ankha (Hindi) Editor Hanuman Prasad Poddar (23th Annual Special Edition) - Kalyan Office, Gita Press, Gorakhpur.pdf"));

        editions("puranas",
                ed("श्रीमद्भागवत महापुराण — संस्कृत + हिंदी", "Srimad Bhagavata Mahapuran — Sanskrit + Hindi",
                        "srimad-bhagavat-mahapuran-2-volume-set-sanskrit-hindi",
                        "Srimad Bhagavat Mahapuran Volume 1 Sanskrit Hindi.pdf"),
                ed("भागवत एकादश स्कंध — गीता प्रेस", "Bhagavata Ekadasha Skandha — Gita Press",
                        "lxmh_shrimad-bhagavata-antargata-ekadasha-skandha-sateeka-translated-by-munilal-",
                        "Shrimad Bhagavata Antargata Ekadasha Skandha Sateeka Translated By Munilal Sanskrit and Hindi Bhagavata Purana Illustrated Gorakhpur 1924 - Gita Press.pdf"));

        editions("yoga-sutra",
                ed("पतंजल योगदर्शन — हिंदी", "Patanjali Yoga Darshan — Hindi",
                        "PatanjalDarshanam", "Patanjal-Darshanam.pdf"));

        editions("rigveda",
                ed("ऋग्वेद संहिता — हिंदी भाष्य", "Rigveda Samhita — Hindi Commentary",
                        "cxgm-rigveda-samhita-vaidika-jivana-bhashya-yuta-editor-shivanatha-agnihotri-shankardatta-shastri-sanskrit-and-hindi-vedas-delhi-1991-nag-publishers",
                        "Rigveda Samhita Vaidika Jivana Bhashya Yuta Editor Shivanatha Agnihotri Shankardatta Shastri Sanskrit and Hindi Vedas Delhi 1991 - Nag Publishers.pdf"));

        editions("samaveda",
                ed("सामवेद संपूर्ण — हिंदी", "Samaveda Complete — Hindi",
                        "zqqw_20240611_20240611_1214",
                        "सामवेद सम्पूर्ण हिंदी भाष्य.pdf"));

        editions("yajurveda",
                ed("यजुर्वेद — सरल हिंदी भावार्थ", "Yajurveda — Simple Hindi Meaning",
                        "cjgt_yajurveda-saral-hindi-bhavarth-sahit-by-shriram-sharma-acharya-sanskrit-and",
                        "Yajurveda Saral Hindi Bhavarth Sahit By Shriram Sharma Acharya Sanskrit and Hindi Veda Bareilly 1981 - Sanskriti Sansthan.pdf"));

        editions("atharvaveda",
                ed("अथर्ववेद — हिंदी (Dr. Raj Bahadur Pandey)", "Atharvaveda — Hindi",
                        "atharvaveda-by-dr-raj-bahadur-pandey-hindi-vedas-n_202605",
                        "Atharvaveda by Dr Raj Bahadur Pandey Hindi Vedas New Delhi 2016 Diamond Pocket Books Pvt Ltd.pdf"));

        editions("manusmriti",
                ed("मनुस्मृति — आर्काइव संस्करण", "Manusmriti — Archive edition",
                        "Manusmriti",
                        "Manusmriti.pdf"));
        editions("arthashastra",
                ed("अर्थशास्त्र — कौटिल्य (आर्काइव)", "Arthashastra — Kautilya (Archive)",
                        "KautilyasArthasastra",
                        "KautilyasArthasastra.pdf"));
        editions("chanakya-niti",
                ed("चाणक्य नीति — आर्काइव", "Chanakya Niti — Archive",
                        "ChanakyaNiti",
                        "ChanakyaNiti.pdf"));
    }

    public static void applyPdf(Veda v) {
        List<PdfEdition> list = EDITIONS.get(v.getSlug());
        if (list == null || list.isEmpty()) {
            return;
        }
        PdfEdition primary = list.get(0);
        v.setPdfUrl(buildUrl(primary));
        v.setPdfSourceName(primary.source());
        v.setPdfTitles(List.of(
                new LocalizedText("hi", primary.titleHi()),
                new LocalizedText("en", primary.titleEn())));
    }

    public static String primaryPdfUrl(String slug) {
        List<PdfEdition> list = EDITIONS.get(slug);
        return list == null || list.isEmpty() ? null : buildUrl(list.get(0));
    }

    public static List<ScripturePdfEditionDto> allEditions(String slug, String lang) {
        List<PdfEdition> list = EDITIONS.get(slug);
        if (list == null) {
            return List.of();
        }
        boolean hindi = "hi".equalsIgnoreCase(lang);
        List<ScripturePdfEditionDto> out = new ArrayList<>();
        for (PdfEdition e : list) {
            ScripturePdfEditionDto dto = new ScripturePdfEditionDto();
            dto.setTitle(hindi ? e.titleHi() : e.titleEn());
            dto.setUrl(buildUrl(e));
            dto.setSourceName(e.source());
            dto.setLanguage(hindi ? "Hindi" : "English label / Hindi text");
            out.add(dto);
        }
        return out;
    }

    private static void editions(String slug, PdfEdition... items) {
        EDITIONS.put(slug, List.of(items));
    }

    private static PdfEdition ed(String titleHi, String titleEn, String archiveId, String fileName) {
        return new PdfEdition(titleHi, titleEn, archiveId, fileName, "Gita Press / Archive.org");
    }

    private static String buildUrl(PdfEdition e) {
        return "https://archive.org/download/" + e.archiveId() + "/" + encode(e.fileName());
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
