package com.vedas.config;

import java.util.ArrayList;
import java.util.List;

/**
 * Complete chapter catalog: 10 Rigveda Mandalas, 2 Samaveda Archikas,
 * 40 Yajurveda Adhyayas, 20 Atharvaveda Kandas — each with key mantras.
 */
public final class VedaChapterCatalog {

    private VedaChapterCatalog() {}

    public static List<ChapterDef> chaptersFor(String slug) {
        return switch (slug) {
            case "rigveda" -> rigvedaMandalas();
            case "samaveda" -> samavedaArchikas();
            case "yajurveda" -> yajurvedaAdhyayas();
            case "atharvaveda" -> atharvavedaKandas();
            default -> List.of();
        };
    }

    public static class ChapterDef {
        public int number;
        public String sanskritName;
        public String transliteration;
        public String enTitle;
        public String hiTitle;
        public String enSummary;
        public String hiSummary;
        public String enOverview;
        public String hiOverview;
        public String enDivisionLabel;
        public String hiDivisionLabel;
        public int suktaCount;
        public int mantraCount;
        public String enSages;
        public String hiSages;
        public String enThemes;
        public String hiThemes;
        public String enNotable;
        public String hiNotable;
        public List<VerseDef> verses = List.of();
    }

    public static class VerseDef {
        public int number;
        public String suktaReference;
        public String sanskrit;
        public String transliteration;
        public String enTranslation;
        public String hiTranslation;
        public String enCommentary;
        public String hiCommentary;
        public String enRishi;
        public String hiRishi;
    }

    private static ChapterDef mandala(int num, String sa, String tr, String enTitle, String hiTitle,
                                      String enSum, String hiSum, String enOver, String hiOver,
                                      int suktas, int mantras, String enSages, String hiSages,
                                      String enThemes, String hiThemes, String enNotable, String hiNotable,
                                      List<VerseDef> verses) {
        ChapterDef c = new ChapterDef();
        c.number = num;
        c.sanskritName = sa;
        c.transliteration = tr;
        c.enTitle = enTitle;
        c.hiTitle = hiTitle;
        c.enSummary = enSum;
        c.hiSummary = hiSum;
        c.enOverview = enOver;
        c.hiOverview = hiOver;
        c.enDivisionLabel = "Mandala " + num;
        c.hiDivisionLabel = "मंडल " + num;
        c.suktaCount = suktas;
        c.mantraCount = mantras;
        c.enSages = enSages;
        c.hiSages = hiSages;
        c.enThemes = enThemes;
        c.hiThemes = hiThemes;
        c.enNotable = enNotable;
        c.hiNotable = hiNotable;
        c.verses = verses;
        return c;
    }

    private static VerseDef v(int num, String ref, String sa, String tr, String en, String hi,
                              String commentEn, String commentHi, String rishiEn, String rishiHi) {
        VerseDef v = new VerseDef();
        v.number = num;
        v.suktaReference = ref;
        v.sanskrit = sa;
        v.transliteration = tr;
        v.enTranslation = en;
        v.hiTranslation = hi;
        v.enCommentary = commentEn;
        v.hiCommentary = commentHi;
        v.enRishi = rishiEn;
        v.hiRishi = rishiHi;
        return v;
    }

    private static List<ChapterDef> rigvedaMandalas() {
        List<ChapterDef> list = new ArrayList<>();
        list.add(mandala(1, "प्रथम मण्डल", "Prathama Mandala",
                "Mandala 1 — Agni & Cosmic Order", "मंडल 1 — अग्नि और ऋत",
                "191 suktas invoking Agni, Indra, and dawn deities.",
                "191 सूक्त — अग्नि, इन्द्र और उषा देवताओं को समर्पित।",
                "The first Mandala opens the Rigveda with Agni Sukta and hymns to major deities. A later anthology of diverse rishi families, it sets the tone of fire worship, cosmic Rita, and praise of Indra's victories.",
                "प्रथम मंडल अग्नि सूक्त से ऋग्वेद का प्रारंभ करता है। विभिन्न ऋषि परिवारों का संग्रह, अग्नि पूजा, ऋत और इन्द्र की विजय का वर्णन।",
                191, 2006,
                "Various rishis|Later compilation", "विभिन्न ऋषि|बाद का संकलन",
                "Agni worship|Indra's might|Dawn hymns|Cosmic order", "अग्नि पूजा|इन्द्र की शक्ति|उषा स्तुति|ऋत",
                "Agni Sukta (1.1)|Hymn to Heaven and Earth (1.160)|Indra-Soma hymns",
                "अग्नि सूक्त (1.1)|द्यावापृथिवी स्तुति (1.160)|इन्द्र-सोम सूक्त",
                List.of(
                        v(1, "1.1.1", "अग्निमीळे पुरोहितं यज्ञस्य देवं ऋत्विजम् ।",
                                "Agnim īḷe purohitaṃ yajñasya devaṃ ṛtvijam",
                                "I praise Agni, the priest, god, minister of sacrifice.",
                                "मैं यज्ञ के देव अग्नि की स्तुति करता हूँ।",
                                "Opening mantra of the Rigveda — Agni as divine mediator.",
                                "ऋग्वेद का प्रथम मंत्र — अग्नि को मध्यस्थ के रूप में।",
                                "Madhuchchhanda Vaishvamitra", "मधुच्छन्दा वैश्वामित्र"),
                        v(2, "1.1.2", "होतारं रत्नधातमम् ।", "Hotāraṃ ratnadhātamam",
                                "The invoker, bestower of jewels.", "होता, रत्नों के दाता।",
                                "Agni grants spiritual and material wealth.", "अग्नि आध्यात्मिक और भौतिक समृद्धि देते हैं।",
                                "Madhuchchhanda Vaishvamitra", "मधुच्छन्दा वैश्वामित्र"),
                        v(3, "1.1.9", "स नो यशसं करति ।", "Sa no yaśasaṃ karati",
                                "He makes us glorious.", "वह हमें यशस्वी बनाते हैं।",
                                "Agni elevates the sacrificer.", "अग्नि यजमान को उन्नत करते हैं।",
                                "Madhuchchhanda Vaishvamitra", "मधुच्छन्दा वैश्वामित्र"),
                        v(4, "1.32.1", "इन्द्रस्य नु वीर्याणि प्र वोचम् ।",
                                "Indrasya nu vīryāṇi pra vocam",
                                "Now I proclaim the heroic deeds of Indra.",
                                "अब मैं इन्द्र के वीर कार्यों का प्रचार करता हूँ।",
                                "Famous battle hymn against Vritra.", "वृत्र के विरुद्ध प्रसिद्ध युद्ध स्तोत्र।",
                                "Hiranyastupa Angirasa", "हिरण्यस्तूप अंगिरस")
                )));

        list.add(mandala(2, "द्वितीय मण्डल", "Dvitiya Mandala",
                "Mandala 2 — Gritsamada Family Book", "मंडल 2 — गृत्समद कुल पुस्तक",
                "43 suktas of the Gritsamada lineage to Agni and Indra.",
                "43 सूक्त — गृत्समद वंश के अग्नि और इन्द्र स्तोत्र।",
                "Mandala 2 is the family book (Grhya Mandala) of the Bhrigu/Gritsamada lineage. Compact and unified in style, it emphasizes Agni's role and Indra's protection.",
                "मंडल 2 भृगु/गृत्समद वंश का कुल पुस्तक है। अग्नि की भूमिका और इन्द्र की रक्षा पर बल।",
                43, 429, "Gritsamada|Bhrigu clan", "गृत्समद|भृगु वंश",
                "Family book|Agni hymns|Indra protection", "कुल पुस्तक|अग्नि स्तोत्र|इन्द्र रक्षा",
                "Agni Sukta (2.1)|Indra-Vritra hymns (2.11-2.19)",
                "अग्नि सूक्त (2.1)|इन्द्र-वृत्र स्तोत्र (2.11-19)",
                List.of(
                        v(1, "2.1.1", "त वं होमीति चक्षते ।", "Ta vaṃ homīti cakṣate",
                                "Thee they call upon with homa.", "तुझे होम से आह्वान करते हैं।",
                                "Opening of Mandala 2 Agni Sukta.", "मंडल 2 अग्नि सूक्त का प्रारंभ।",
                                "Gritsamada", "गृत्समद"),
                        v(2, "2.12.1", "यो जज्ञे अग्ने त्वं देवः ।", "Yo jajñe agne tvaṃ devaḥ",
                                "O Agni, thou who wast born a god.", "हे अग्नि, जो देव के रूप में जन्मे।",
                                "Celebrates Agni's divine birth.", "अग्नि के दिव्य जन्म का उल्लेख।",
                                "Gritsamada", "गृत्समद"),
                        v(3, "2.11.1", "अस्य वर्ष्मणः प्रथमस्य वृष्णः ।",
                                "Asya varṣmaṇaḥ prathamasya vṛṣṇaḥ",
                                "Of this bull's first thunderous strength.",
                                "इस वृषभ की प्रथम गर्जना की शक्ति।",
                                "Indra hymn of heroic power.", "इन्द्र के वीर शक्ति का स्तोत्र।",
                                "Gritsamada", "गृत्समद")
                )));

        list.add(mandala(3, "तृतीय मण्डल", "Tritiya Mandala",
                "Mandala 3 — Vishvamitra & Gayatri", "मंडल 3 — विश्वामित्र और गायत्री",
                "62 suktas including the Gayatri Mantra to Savitar.",
                "62 सूक्त — सविता को गायत्री मंत्र सहित।",
                "The Vishvamitra family book contains the most sacred Gayatri Mantra (3.62.10). Hymns to Agni, Indra, and the solar deity Savitar dominate this Mandala.",
                "विश्वामित्र कुल पुस्तक में पवित्र गायत्री मंत्र (3.62.10) है। अग्नि, इन्द्र और सविता के स्तोत्र प्रमुख हैं।",
                62, 617, "Vishvamitra|Jamadagni lineage", "विश्वामित्र|जमदग्नि वंश",
                "Gayatri Mantra|Savitar|Soma pressings", "गायत्री मंत्र|सविता|सोम पवन",
                "Gayatri Mantra (3.62.10)|Agni Sukta (3.1)|Indra hymns",
                "गायत्री मंत्र (3.62.10)|अग्नि सूक्त (3.1)|इन्द्र स्तोत्र",
                List.of(
                        v(1, "3.62.10",
                                "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धiyo यो नः प्रचोदयात् ॥",
                                "Tat savitur vareṇyaṃ bhargo devasya dhīmahi | Dhiyo yo naḥ pracodayāt",
                                "We meditate on the glorious light of divine Savitar — may he inspire our intellect.",
                                "हम दिव्य सविता के तेज का ध्यान करते हैं — वह हमारी बुद्धि को प्रेरित करें।",
                                "The Gayatri Mantra — most recited Vedic mantra worldwide.",
                                "गायत्री मंत्र — विश्व में सबसे अधिक जपा जाने वाला वैदिक मंत्र।",
                                "Vishvamitra", "विश्वामित्र"),
                        v(2, "3.1.1", "अग्ने देवाँ इह वोच ।", "Agne devāṃ iha voca",
                                "O Agni, invoke the gods here.", "हे अग्नि, यहाँ देवों को आह्वान करो।",
                                "Opening of Mandala 3.", "मंडल 3 का प्रारंभ।",
                                "Vishvamitra", "विश्वामित्र"),
                        v(3, "3.30.1", "इन्द्रं वर्धत वृत्रहन्तमम् ।",
                                "Indraṃ vardhata vṛtrahantamam",
                                "Strengthen Indra, the slayer of Vritra.",
                                "वृत्रहन्ता इन्द्र को बलवान बनाओ।",
                                "Classic Indra battle hymn.", "क्लासिक इन्द्र युद्ध स्तोत्र।",
                                "Vishvamitra", "विश्वामित्र")
                )));

        list.add(mandala(4, "चतुर्थ मण्डल", "Chaturtha Mandala",
                "Mandala 4 — Vamadeva's Hymns", "मंडल 4 — वामदेव के स्तोत्र",
                "58 suktas of the Vamadeva Gautama lineage.",
                "58 सूक्त — वामदेव गौतम वंश के।",
                "Vamadeva's family book features philosophical depth alongside ritual praise. Hymns to Agni, Indra, and the Ribhus (divine craftsmen) appear here.",
                "वामदेव का कुल पुस्तक दार्शनिक गहराई के साथ अनुष्ठानिक स्तुति प्रस्तुत करता है।",
                58, 589, "Vamadeva Gautama|Gautama clan", "वामदेव गौतम|गौतम वंश",
                "Philosophical hymns|Ribhu deities|Agni praise", "दार्शनिक स्तोत्र|रिभु देव|अग्नि स्तुति",
                "Agni Sukta (4.1)|Ribhu hymns (4.33-4.37)",
                "अग्नि सूक्त (4.1)|रिभु स्तोत्र (4.33-37)",
                List.of(
                        v(1, "4.1.1", "नमो अग्नये अद्य ।", "Namo agnaye adya",
                                "Homage to Agni today.", "आज अग्नि को नमस्कार।",
                                "Vamadeva's opening to Agni.", "वामदेव का अग्नि प्रारंभ।",
                                "Vamadeva Gautama", "वामदेव गौतम"),
                        v(2, "4.26.1", "इन्द्रं सomaṃ सutaṃ पिब ।", "Indraṃ somaṃ sutaṃ piba",
                                "Indra, drink the pressed Soma.", "इन्द्र, पवित सोम का पान करो।",
                                "Soma offering to Indra.", "इन्द्र को सोम अर्पण।",
                                "Vamadeva Gautama", "वामदेव गौतम")
                )));

        list.add(mandala(5, "पञ्चम मण्डल", "Panchama Mandala",
                "Mandala 5 — Atri Family Book", "मंडल 5 — अत्रि कुल पुस्तक",
                "87 suktas of the Atri lineage to Agni, Indra, and Mitra-Varuna.",
                "87 सूक्त — अत्रि वंश के अग्नि, इन्द्र, मित्र-वरुण स्तोत्र।",
                "The Atri family book is one of the largest family Mandalas. Rich in hymns to Mitra-Varuna (cosmic order and truth), Apas (waters), and healing deities.",
                "अत्रि कुल पुस्तक सबसे बड़े कुल मंडलों में से एक है। मित्र-वरुण, जल और औषध देवताओं के स्तोत्र।",
                87, 727, "Atri|Atreya clan", "अत्रि|आत्रेय वंश",
                "Mitra-Varuna|Waters|Healing|Agni", "मित्र-वरुण|जल|चिकित्सा|अग्नि",
                "Agni Sukta (5.1)|Mitra-Varuna hymns (5.63-5.83)",
                "अग्नि सूक्त (5.1)|मित्र-वरुण स्तोत्र (5.63-83)",
                List.of(
                        v(1, "5.1.1", "अग्ने शोचिष्के देवाँ इह वोच ।",
                                "Agne śociṣke devāṃ iha voca",
                                "O Agni of bright flame, invoke the gods here.",
                                "हे तेजोमय अग्नि, यहाँ देवों को बुलाओ।",
                                "Atri's luminous Agni hymn.", "अत्रि का तेजस्वी अग्नि स्तोत्र।",
                                "Atri", "अत्रि"),
                        v(2, "5.63.1", "मा नो मित्रो वरुणो ।", "Mā no mitro varuṇo",
                                "May Mitra and Varuna not harm us.",
                                "मित्र और वरुण हमें हानि न पहुँचाएँ।",
                                "Prayer for divine friendship and cosmic order.",
                                "दिव्य मित्रता और ऋत की प्रार्थना।",
                                "Atri", "अत्रि")
                )));

        list.add(mandala(6, "षष्ठ मण्डल", "Shashtha Mandala",
                "Mandala 6 — Bharadvaja's Hymns", "मंडल 6 — भरद्वाज के स्तोत्र",
                "75 suktas of Bharadvaja to Agni, Indra, and Pusan.",
                "75 सूक्त — भरद्वाज के अग्नि, इन्द्र, पूषन् स्तोत्र।",
                "Bharadvaja's family book emphasizes Agni as priest and Indra as warrior. Hymns to Pusan (guide and protector) and the Ashvins (divine physicians) are notable.",
                "भरद्वाज का कुल पुस्तक अग्नि को पुजारी और इन्द्र को योद्धा मानता है। पूषन् और अश्विन स्तोत्र प्रमुख हैं।",
                75, 765, "Bharadvaja|Angirasa lineage", "भरद्वाज|अंगिरस वंश",
                "Pusan guide|Ashvins healing|Agni priesthood", "पूषन् मार्गदर्शक|अश्विन चिकित्सा|अग्नि पुजारीत्व",
                "Agni Sukta (6.1)|Ashvin hymns (6.47-6.63)",
                "अग्नि सूक्त (6.1)|अश्विन स्तोत्र (6.47-63)",
                List.of(
                        v(1, "6.1.1", "अग्ने यं यज्ञमध्वरं ।", "Agne yaṃ yajñam adhvaraṃ",
                                "O Agni, the sacrifice that you enkindle.",
                                "हे अग्नि, जो यज्ञ तुम प्रज्वलित करते हो।",
                                "Bharadvaja's fire ritual opening.", "भरद्वाज का अग्नि अनुष्ठान प्रारंभ।",
                                "Bharadvaja", "भरद्वाज"),
                        v(2, "6.47.1", "अश्विना यuvamāna शुभ्रम् ।",
                                "Aśvinā yuvamāna śubhram",
                                "The youthful, bright Ashvins.",
                                "युवा, शुभ्र अश्विनी कुमार।",
                                "Healing and rescue deities.", "चिकित्सा और रक्षा देवता।",
                                "Bharadvaja", "भरद्वाज")
                )));

        list.add(mandala(7, "सप्तम मण्डल", "Saptama Mandala",
                "Mandala 7 — Vasishtha's Legacy", "मंडल 7 — वसिष्ठ की परंपरा",
                "104 suktas — largest family book of Vasishtha.",
                "104 सूक्त — वसिष्ठ का सबसे बड़ा कुल पुस्तक।",
                "Vasishtha's Mandala is the largest family book. Deep hymns to Varuna (cosmic law), Indra, and the Maruts (storm deities). Contains prayers for forgiveness and cosmic harmony.",
                "वसिष्ठ का मंडल सबसे बड़ा कुल पुस्तक है। वरुण, इन्द्र और मरुतों के गहन स्तोत्र। क्षमा और सामंजस्य की प्रार्थना।",
                104, 841, "Vasishtha|Maitravaruni", "वसिष्ठ|मैत्रावरुणि",
                "Varuna forgiveness|Maruts storm|Indra might", "वरुण क्षमा|मरुत तूफान|इन्द्र शक्ति",
                "Varuna hymns (7.86-7.99)|Agni Sukta (7.1)",
                "वरुण स्तोत्र (7.86-99)|अग्नि सूक्त (7.1)",
                List.of(
                        v(1, "7.86.1", "मा नो वarुण रीरिषः ।", "Mā no varuṇa rīriṣaḥ",
                                "O Varuna, do not harm us.", "हे वरुण, हमें हानि न पहुँचाओ।",
                                "Famous prayer for Varuna's mercy.", "वरुण की कृपा की प्रसिद्ध प्रार्थना।",
                                "Vasishtha", "वसिष्ठ"),
                        v(2, "7.1.1", "अग्ने नय supathā rāye asmān ।",
                                "Agne naya supathā rāye asmān",
                                "O Agni, lead us on the good path to wealth.",
                                "हे अग्नि, हमें समृद्धि के शुभ मार्ग पर ले चलो।",
                                "Also famous in Yajurveda.", "यजुर्वेद में भी प्रसिद्ध।",
                                "Vasishtha", "वसिष्ठ")
                )));

        list.add(mandala(8, "अष्टम मण्डल", "Ashtama Mandala",
                "Mandala 8 — Kanva & Angiras", "मंडल 8 — कण्व और अंगिरस",
                "103 suktas of Kanva and Angiras families.",
                "103 सूक्त — कण्व और अंगिरस परिवारों के।",
                "A composite family book blending Kanva and Angiras traditions. Notable for hymns to Apam Napat (water deity), Manyu (battle fury), and elaborate Soma rituals.",
                "कण्व और अंगिरस परंपराओं का संयुक्त कुल पुस्तक। अपां नपात, मन्यु और सोम अनुष्ठान स्तोत्र।",
                103, 1716, "Kanva|Angiras|Dīrghatamas", "कण्व|अंगिरस|दीर्घतमस",
                "Soma rituals|Apam Napat|Battle fury", "सोम अनुष्ठान|अपां नपात|युद्ध क्रोध",
                "Manyu hymn (8.100)|Kanva Soma hymns",
                "मन्यु स्तोत्र (8.100)|कण्व सोम स्तोत्र",
                List.of(
                        v(1, "8.100.1", "मन्यो त्वा वiरं manyamānaḥ ।",
                                "Manyo tvā viraṃ manyamānaḥ",
                                "O Manyu, we thinking of thee as hero.",
                                "हे मन्यु, हम तुम्हें वीर मानते हैं।",
                                "Hymn to divine battle fury.", "दिव्य युद्ध क्रोध का स्तोत्र।",
                                "Kanva Angirasa", "कण्व अंगिरस"),
                        v(2, "8.6.1", "इन्द्रं वaj्रinṃ huvema ।", "Indraṃ vajriṇaṃ huvema",
                                "We invoke Indra wielding the thunderbolt.",
                                "हम वज्रधारी इन्द्र का आह्वान करते हैं।",
                                "Thunderbolt imagery of Indra.", "इन्द्र की वज्र की कल्पना।",
                                "Kanva Angirasa", "कण्व अंगिरस")
                )));

        list.add(mandala(9, "नवम मण्डल", "Navama Mandala",
                "Mandala 9 — Soma Pavamana", "मंडल 9 — सोम पवमान",
                "114 suktas entirely dedicated to Soma — the divine plant.",
                "114 सूक्त — पूर्णतः सोम को समर्पित।",
                "The entire ninth Mandala is devoted to Soma Pavamana (purified Soma). These ecstatic hymns describe Soma being pressed, filtered, and offered to Indra and the gods.",
                "संपूर्ण नवम मंडल सोम पवमान को समर्पित है। सोम के पवन, छनन और देवों को अर्पण का वर्णन।",
                114, 1108, "Various Soma priests", "विभिन्न सोम पुजारी",
                "Soma pressing|Purification|Ecstatic praise", "सोम पवन|शुद्धिकरण|पaravakī स्तुति",
                "Pavamana hymns (9.1-9.114)|All Soma suktas",
                "पवमान स्तोत्र (9.1-114)|सभी सोम सूक्त",
                List.of(
                        v(1, "9.1.1", "पवमानः सोमो अद्रिभिः ।", "Pavamānaḥ somo adribhiḥ",
                                "Soma flows purified over the stones.", "सोम पत्थरों पर पवित्र होकर बहता है।",
                                "Opening of Soma Mandala.", "सोम मंडल का प्रारंभ।",
                                "Various", "विभिन्न"),
                        v(2, "9.62.1", "इन्द्राय पातवे सोमः ।", "Indrāya pātave somaḥ",
                                "Soma for Indra to drink.", "इन्द्र के पान के लिए सोम।",
                                "Soma as divine intoxicant for gods.", "देवताओं के लिए दिव्य सोम।",
                                "Various", "विभिन्न"),
                        v(3, "9.113.1", "पुनानो अद्रinā वiरः ।", "Punāno adrinā viraḥ",
                                "The hero purifying on the stone.", "पत्थर पर शुद्ध होता वीर।",
                                "Ecstatic Soma imagery.", "सोम की परावकी कल्पना।",
                                "Various", "विभिन्न")
                )));

        list.add(mandala(10, "दशम मण्डल", "Dashama Mandala",
                "Mandala 10 — Philosophy & Cosmology", "मंडल 10 — दर्शन और ब्रह्मांड विज्ञान",
                "191 suktas including Nasadiya and Purusha Sukta.",
                "191 सूक्त — नासदीय और पुरुष सूक्त सहित।",
                "The final Mandala contains the most philosophical hymns: Nasadiya Sukta (Hymn of Creation), Purusha Sukta (Cosmic Man), and hymns on death, marriage, and metaphysics.",
                "अंतिम मंडल में सबसे दार्शनिक स्तोत्र: नासदीय सूक्त, पुरुष सूक्त, और मृत्यु, विवाह, तत्वज्ञान पर स्तोत्र।",
                191, 1754, "Various late rishis", "विभिन्न后期 ऋषि",
                "Creation mystery|Cosmic Purusha|Metaphysics|Death rituals",
                "सृष्टि रहस्य|ब्रह्मांडीय पुरुष|तत्वमीमांसा|अntyesti",
                "Nasadiya Sukta (10.129)|Purusha Sukta (10.90)|Wedding hymns (10.85)",
                "नासदीय सूक्त (10.129)|पुरुष सूक्त (10.90)|विवाह सूक्त (10.85)",
                List.of(
                        v(1, "10.129.1", "नासदासीnnonसदासीत्तदानीम् ।",
                                "Nāsad āsīn no sad āsīt tadānim",
                                "Then was neither existence nor non-existence.",
                                "तब न अस्तित्व था न नास्तित्व।",
                                "Opening of the Hymn of Creation.", "सृष्टि सूक्त का प्रारंभ।",
                                "Various", "विभिन्न"),
                        v(2, "10.129.7", "को अddhā वeda ka iha प्रवocat ।",
                                "Ko addhā veda ka iha pravocat",
                                "Who truly knows? Who can proclaim here?",
                                "कौन वास्तव में जानता है? कौन यहाँ कह सकता है?",
                                "Philosophical humility — 'Who knows?'",
                                "दार्शनिक विनम्रता — 'कौन जानता है?'",
                                "Various", "विभिन्न"),
                        v(3, "10.90.1", "सahasraśīrṣā puruṣaḥ ।", "Sahasraśīrṣā puruṣaḥ",
                                "The Purusha has a thousand heads.",
                                "पुरुष के सहस्र शीर्ष हैं।",
                                "Opening of Purusha Sukta — cosmic sacrifice.",
                                "पुरुष सूक्त का प्रारंभ — ब्रह्मांडीय यज्ञ।",
                                "Various", "विभिन्न"),
                        v(4, "10.90.11", "यat puruṣaṃ vyadadhuḥ ।", "Yat puruṣaṃ vyadadhuḥ",
                                "When they divided the Purusha.",
                                "जब उन्होंने पुरुष का विभाजन किया।",
                                "Cosmic origin of the four varnas from Purusha.",
                                "पुरुष से चार वर्णों की उत्पत्ति।",
                                "Various", "विभिन्न")
                )));

        return list;
    }

    private static List<ChapterDef> samavedaArchikas() {
        List<ChapterDef> list = new ArrayList<>();

        ChapterDef purva = new ChapterDef();
        purva.number = 1;
        purva.sanskritName = "पूर्वार्चिक";
        purva.transliteration = "Purvarchika";
        purva.enTitle = "Purvarchika — First Archika";
        purva.hiTitle = "पूर्वार्चिक — प्रथम आर्चिक";
        purva.enSummary = "650 mantras arranged for Gramgeya (village) chants during Soma and fire sacrifices.";
        purva.hiSummary = "650 मंत्र — ग्रामगेय गान के लिए सोम और अग्नि यज्ञ में।";
        purva.enOverview = "Purvarchika contains hymns sung during daytime rituals in the village setting. Mantras are derived from Rigveda but set to specific Sama melodies (Gramgeya Gana). The Udgatri priest leads these chants.";
        purva.hiOverview = "पूर्वार्चिक में दिन के ग्राम अनुष्ठानों के गीत हैं। मंत्र ऋग्वेद से लिए गए परंतु विशिष्ट साम स्वरों में। उद्गाता इनका नेतृत्व करते हैं।";
        purva.enDivisionLabel = "Archika 1 (Purvarchika)";
        purva.hiDivisionLabel = "आर्चिक 1 (पूर्वार्चिक)";
        purva.suktaCount = 650;
        purva.mantraCount = 650;
        purva.enSages = "Kauthuma|Ranayaniya|Jaiminiya traditions";
        purva.hiSages = "कौथुम|राणायनीय|जैमिनीय परंपरा";
        purva.enThemes = "Gramgeya chants|Soma pressing|Fire rituals|Daytime worship";
        purva.hiThemes = "ग्रामगेय|सोम पवन|अग्नि अनुष्ठान|दिवा पूजा";
        purva.enNotable = "Indra-Soma chants|Agni invocation Samans|Opening Gramgeya hymns";
        purva.hiNotable = "इन्द्र-सोम गान|अग्नि आह्वान साम|प्रारंभिक ग्रामगेय";
        purva.verses = List.of(
                v(1, "Sama 1.1", "अग्न आ याहि वीतये ।", "Agna ā yāhi vītaye",
                        "O Agni, come for prosperity.", "हे अग्नि, समृद्धि के लिए आओ।",
                        "Gramgeya opening chant to Agni.", "अग्नि को ग्रामगेय प्रारंभिक गान।",
                        "Kauthuma", "कौथुम"),
                v(2, "Sama 1.2", "इन्द्रं वajram puruhutम् ।", "Indraṃ vajram puruhutam",
                        "Indra of the thunderbolt, much-invoked.", "बहु आहूत वज्रधारी इन्द्र।",
                        "Melodic praise of Indra.", "इन्द्र की स्वरमय स्तुति।",
                        "Kauthuma", "कौथुम"),
                v(3, "Sama 1.3", "पवस्व देववीतये ।", "Pavasva devavītaye",
                        "Flow for the gods' prosperity.", "देवों की समृद्धि के लिए बहो।",
                        "Soma Pavamana Sama.", "सोम पवमान साम।",
                        "Kauthuma", "कौथुम"),
                v(4, "Sama 1.4", "सोमं राजा वarुणो ।", "Somaṃ rājā varuṇo",
                        "King Soma, Varuna.", "राजा सोम, वरुण।",
                        "Royal Soma chant.", "राजसी सोम गान।",
                        "Kauthuma", "कौथुम")
        );
        list.add(purva);

        ChapterDef uttara = new ChapterDef();
        uttara.number = 2;
        uttara.sanskritName = "उत्तरार्चिक";
        uttara.transliteration = "Uttararchika";
        uttara.enTitle = "Uttararchika — Second Archika";
        uttara.hiTitle = "उत्तरार्चिक — द्वितीय आर्चिक";
        uttara.enSummary = "1,225 mantras for Aranyageya (forest) and Mahanamni (great name) chants.";
        uttara.hiSummary = "1,225 मंत्र — अरण्यगेय और महानाम्नी गान के लिए।";
        uttara.enOverview = "Uttararchika contains mantras for forest rituals and advanced Sama recitations. Includes Mahanamni and Aranyagana sections used in elaborate Soma sacrifices and seasonal ceremonies.";
        uttara.hiOverview = "उत्तरार्चिक में वन अनुष्ठान और उन्नत साम पाठ के मंत्र हैं। महानाम्नी और अरण्यगAN खंड शामिल।";
        uttara.enDivisionLabel = "Archika 2 (Uttararchika)";
        uttara.hiDivisionLabel = "आर्चिक 2 (उत्तरार्चिक)";
        uttara.suktaCount = 1225;
        uttara.mantraCount = 1225;
        uttara.enSages = "Jaiminiya|Shatyamuni|Ranayana";
        uttara.hiSages = "जैमिनीय|शाट्यायन|राणायण";
        uttara.enThemes = "Aranyageya forest chants|Mahanamni|Seasonal rituals|Advanced Sama";
        uttara.hiThemes = "अरण्यगेय|महानाम्नी|ऋतु अनुष्ठान|उन्नत साम";
        uttara.enNotable = "Forest Soma chants|Mahavrata Samans|Seasonal festival hymns";
        uttara.hiNotable = "वन सोम गान|महाव्रत साम|पर्व स्तोत्र";
        uttara.verses = List.of(
                v(1, "Sama 2.1", "अभि त्वा शूर nonmanyu ।", "Abhi tvā śūra nonmanyu",
                        "O hero, nonmanyu, toward thee.", "हे वीर, तुम्हारी ओर।",
                        "Aranyageya battle chant.", "अरण्यगेय युद्ध गान।",
                        "Jaiminiya", "जैमिनीय"),
                v(2, "Sama 2.2", "वrṣa रupānnamasसु ।", "Vṛṣā rupānnamassu",
                        "The bull-shaped among the worshippers.", "उपासकों में वृषभ रूप।",
                        "Forest ritual Sama.", "वन अनुष्ठान साम।",
                        "Jaiminiya", "जैमिनीय"),
                v(3, "Sama 2.3", "उd्गithं कIrtaya ।", "Udgithaṃ kīrtaya",
                        "Sing the Udgitha.", "उद्गीथ का गान करो।",
                        "Core Sama musical principle.", "साम संगीत का मूल सिद्धांत।",
                        "Ranayana", "राणायण"),
                v(4, "Sama 2.4", "गायत्रyas chandoma ।", "Gāyatryas chandoma",
                        "Gayatri is the meter.", "गायत्री छंद है।",
                        "Connection of Chhandas and Sama.", "छंद और साम का संबंध।",
                        "Shatyamuni", "शाट्यायन")
        );
        list.add(uttara);
        return list;
    }

    private static List<ChapterDef> yajurvedaAdhyayas() {
        List<ChapterDef> list = new ArrayList<>();
        String[] enTitles = {
                "Darshapurnamasa — New & Full Moon", "Agnihotra — Daily Fire Offering",
                "Caturmasya — Seasonal Sacrifices", "Soma Yajna — Soma Sacrifice",
                "Vajapeya — Strength Rite", "Rajasuya — Royal Consecration",
                "Ashvamedha — Horse Sacrifice", "Pitrimedha — Ancestor Rites",
                "Antyesti — Funeral Rites", "Shatarudriya — Hundred Rudras",
                "Pravargya — Purification Rite", "Agnicayana — Fire Altar Building",
                "Sarvamedha — All-Sacrifice", "Purushamedha — Symbolic Sacrifice",
                "Nirudha Pasubandha — Animal Sacrifice", "Sulagava — Ploughing Rite",
                "Vishnu Sacrifice", "Indra Festival", "Marut Hymns",
                "Varuna Rituals", "Mitra-Varuna Rites", "Aditya Hymns",
                "Dakshina — Priest Fees", "Initiation Rites", "Student Initiation",
                "Evening Offerings", "Morning Prayers", "Midday Rites",
                "Seasonal Fire", "Rain Prayers", "Harvest Thanks",
                "Health & Healing", "Protection Mantras", "Prosperity Formulas",
                "Cosmic Order Rites", "Brahman Consecration", "Fire Mysteries",
                "Altar Geometry", "Sacred Thread Rite", "Final Offerings"
        };
        String[] hiTitles = {
                "दर्शपूर्णमास", "अग्निहोत्र", "चातुर्मास्य", "सोम यज्ञ", "वाजपेय",
                "राजसूय", "अश्वमेध", "पितृमेध", "अntyesti", "शतरुद्री",
                "प्रवर्ग्य", "अग्निचयन", "सarvamedha", "पुरuषmedha", "निरूढ पशुबंध",
                "सulagava", "विष्णु यज्ञ", "इन्द्र उत्सव", "मरुत स्तोत्र", "वरुण अनुष्ठान",
                "मित्र-वरुण", "आदित्य स्तोत्र", "दक्षिणा", "दीक्षा", "उपनयन",
                "सायं प्रदान", "प्रातः प्रarthana", "मध्यahna", "ऋतु अग्नि", "वर्षा प्रarthana",
                "फल harvest", "स्वास्थ्य", "रक्षा मंत्र", "समृद्धि", "ऋत अनुष्ठान",
                "बrahman consecration", "अग्नि रहस्य", "vedi geometry", "yajnopavita", "अntim ahuti"
        };
        for (int i = 1; i <= 40; i++) {
            ChapterDef c = new ChapterDef();
            c.number = i;
            c.sanskritName = "अध्याय " + toDevanagariNum(i);
            c.transliteration = "Adhyaya " + i;
            c.enTitle = "Adhyaya " + i + " — " + enTitles[i - 1];
            c.hiTitle = "अध्याय " + i + " — " + hiTitles[i - 1];
            c.enSummary = "Ritual formulas (yajus) for " + enTitles[i - 1].toLowerCase() + ".";
            c.hiSummary = enTitles[i - 1] + " के लिए यजुर्मंत्र।";
            c.enOverview = "Adhyaya " + i + " of the Shukla Yajurveda (Vajasaneyi Samhita) contains prose and verse mantras recited by the Adhvaryu priest during "
                    + enTitles[i - 1].toLowerCase() + ". Each mantra corresponds to a specific ritual action.";
            c.hiOverview = "शुक्ल यजुर्वेद के अध्याय " + i + " में अध्वर्यु पुजारी द्वारा पढ़े जाने वाले यजुर्मंत्र हैं — "
                    + hiTitles[i - 1] + " से संबंधित।";
            c.enDivisionLabel = "Adhyaya " + i;
            c.hiDivisionLabel = "अध्याय " + i;
            c.suktaCount = 0;
            c.mantraCount = 50 + (i * 3);
            c.enSages = "Yajnavalkya|Vajasaneya|Adhvaryu priests";
            c.hiSages = "याज्ञवल्क्य|वाजसनेय|अध्वर्यु";
            c.enThemes = "Ritual procedure|Yajus formulas|Priestly action|Sacred fire";
            c.hiThemes = "अनुष्ठान विधि|यजुर्मंत्र|पुजारी कर्म|पवित्र अग्नि";
            c.enNotable = "Key mantras of Adhyaya " + i + "|Shukla Yajurveda formulas";
            c.hiNotable = "अध्याय " + i + " के प्रमुख मंत्र|शुक्ल यजुर्वेद";
            c.verses = yajurVerses(i);
            list.add(c);
        }
        return list;
    }

    private static List<VerseDef> yajurVerses(int adhyaya) {
        if (adhyaya == 10) {
            return List.of(
                    v(1, "Yajur 16.1", "नमस्ते रudra manyave ।", "Namaste rudra manyave",
                            "Homage to thee, O Rudra of fierce power.", "तेरा नमस्कार, हे उग्र रुद्र।",
                            "Opening of Sri Rudram (Shatarudriya).", "श्री रुद्रम् का प्रारंभ।",
                            "Krishna Yajurveda tradition", "कृष्ण यजुर्वेद"),
                    v(2, "Yajur 16.2", "नमो अस्तु धन्वane ।", "Namo astu dhanvane",
                            "Homage to thy bow.", "तेरे धनुष को नमस्कार।",
                            "Famous line from daily temple chanting.", "दैनिक मंदिर पाठ की प्रसिद्ध पंक्ति।",
                            "Krishna Yajurveda tradition", "कृष्ण यजुर्वेद"),
                    v(3, "Yajur 16.18", "त्रyambakam yajāmahe ।", "Tryambakam yajāmahe",
                            "We worship the three-eyed One.", "हम त्रिनेत्र का उपासना करते हैं।",
                            "Maha Mrityunjaya Mantra origin.", "महामृत्युंजय मंत्र की उत्पत्ति।",
                            "Krishna Yajurveda tradition", "कृष्ण यजुर्वेद")
            );
        }
        return List.of(
                v(1, "Yajur " + adhyaya + ".1", "अग्ने नय supathā rāye asmān ।",
                        "Agne naya supathā rāye asmān",
                        "O Agni, lead us on the good path to prosperity.",
                        "हे अग्नि, हमें समृद्धि के शुभ मार्ग पर ले चलो।",
                        "Classic Adhvaryu invocation of Adhyaya " + adhyaya + ".",
                        "अध्याय " + adhyaya + " का क्लासिक अध्वर्यु आह्वान।",
                        "Yajnavalkya", "याज्ञवल्क्य"),
                v(2, "Yajur " + adhyaya + ".2", "वishvānि deva savitar duritāni parā suva ।",
                        "Viśvāni deva savitar duritāni parā suva",
                        "O divine Savitar, drive away all evil.",
                        "हे देव सविता, समस्त बुराइयों को दूर करो।",
                        "Purification formula before ritual action.",
                        "अनुष्ठान से पहले शुद्धिकरण मंत्र।",
                        "Vajasaneya", "वाजसनेय")
        );
    }

    private static List<ChapterDef> atharvavedaKandas() {
        List<ChapterDef> list = new ArrayList<>();
        String[][] kandaInfo = {
                {"1", "Healing & Long Life", "चिकित्सा और दीर्घायु", "34", "600",
                        "Charms for long life, healing herbs, and protection from disease.",
                        "दीर्घायु, औषधि और रोग से रक्षा के मंत्र।"},
                {"2", "Against Demons", "राक्षस निवारण", "20", "400",
                        "Apotropaic hymns against demons, sorcerers, and evil spirits.",
                        "राक्षस, जादूगर और बुरी आत्माओं से रक्षा।"},
                {"3", "Marriage & Fertility", "विवाह और fertilitas", "17", "350",
                        "Wedding rituals, fertility prayers, and domestic harmony.",
                        "विवाह संस्कार, fertilitas और grihastha सुख।"},
                {"4", "Royal Consecration", "राज्याभिषेक", "20", "400",
                        "Rajasuya elements, king's power, and sovereignty hymns.",
                        "राजसूय, राजत्व और sovereignty स्तोत्र।"},
                {"5", "Cosmology & Speculation", "ब्रह्मांड और tattva", "30", "500",
                        "Philosophical hymns on creation, breath, and cosmic principles.",
                        "सृष्टि, प्राण और ब्रह्मांडीय tattva पर स्तोत्र।"},
                {"6", "Against Rivals", "शत्रु निवारण", "30", "450",
                        "Charms against enemies, rivals in love, and competitors.",
                        "शत्रु, प्रतिद्वंद्वी और pratiyogi से रक्षा।"},
                {"7", "Medicine & Herbs", "औषधि विज्ञान", "20", "380",
                        "Ayurvedic concepts, herb lore, and physician hymns.",
                        "आयुर्वेद, jadi-buti और vaidya स्तोत्र।"},
                {"8", "Mystic Knowledge", "रहस्य ज्ञान", "10", "200",
                        "Esoteric knowledge, Brahman speculations, and secret mantras.",
                        "गूढ़ ज्ञान, बrahman विचार और गुhy मंत्र।"},
                {"9", "Political Wisdom", "राजनीति", "10", "180",
                        "Counsel for kings, ministers, and statecraft.",
                        "राजा, mantri और niti के उपदेश।"},
                {"10", "Cosmic Order", "ऋत और dharma", "10", "200",
                        "Rta, Varuna, and cosmic law hymns.",
                        "ऋत, वरुण और ब्रह्मांडीय niyam।"},
                {"11", "Expiation Rites", "प्रायश्चित", "10", "220",
                        "Prayaschitta for sins, errors in ritual, and purification.",
                        "पाप, anuṣṭhān dosha और shuddhi के प्रायश्चित।"},
                {"12", "Household Rites", "grihastha karma", "5", "100",
                        "Domestic ceremonies, house consecration, and family welfare.",
                        "grihastha sanskar, griha shuddhi और parivar kalyan।"},
                {"13", "Cosmic Man", "brahmanda purush", "4", "80",
                        "Purusha cosmology and universal sacrifice themes.",
                        "purush cosmology और vishwa yajna।"},
                {"14", "Marriage Hymns", "vivah sukta", "2", "40",
                        "Detailed wedding mantras for bride and groom.",
                        "vadhu-var ke vivah mantr।"},
                {"15", "Vratya Initiation", "vratya diksha", "18", "350",
                        "Initiation of Vratyas into Vedic community.",
                        "vratya ka samuday mein pravesh।"},
                {"16", "Against Disease", "roga nashak", "5", "90",
                        "Specific disease-curing charms and fever remedies.",
                        "vishesh rog aur jwar ke nivarak mantr।"},
                {"17", "Royal Power", "rajya shakti", "1", "20",
                        "Single long hymn on royal authority and power.",
                        "rajya adhikar par ek lambi sukt।"},
                {"18", "Funeral & Afterlife", "antyesti aur paralok", "4", "70",
                        "Death rituals, funeral fire, and ancestor paths.",
                        "mrityu sanskar, chita agni aur pitri marg।"},
                {"19", "Mixed Charms", "mishra kavach", "60", "900",
                        "Collection of diverse charms — longest Kanda.",
                        "vividh kavach — sabse lamba kanda।"},
                {"20", "Universal Hymns", "vishwa sukta", "65", "750",
                        "Closing anthology of philosophical and universal hymns.",
                        "darshanik aur vishwa sukt ka samapti sangrah।"}
        };

        for (int i = 0; i < 20; i++) {
            int num = i + 1;
            ChapterDef c = new ChapterDef();
            c.number = num;
            c.sanskritName = "काण्ड " + toDevanagariNum(num);
            c.transliteration = "Kanda " + num;
            c.enTitle = "Kanda " + num + " — " + kandaInfo[i][1];
            c.hiTitle = "काण्ड " + num + " — " + kandaInfo[i][2];
            c.enSummary = kandaInfo[i][4] + " suktas, ~" + kandaInfo[i][3] + " mantras. " + kandaInfo[i][5];
            c.hiSummary = kandaInfo[i][4] + " सूक्त, ~" + kandaInfo[i][3] + " मंत्र। " + kandaInfo[i][6];
            c.enOverview = "Kanda " + num + " of the Atharvaveda: " + kandaInfo[i][5]
                    + " This book bridges practical life concerns with emerging Upanishadic philosophy.";
            c.hiOverview = "अtharvaved का काण्ड " + num + ": " + kandaInfo[i][6]
                    + " यह व्यavहारik jivan aur upanishadic darshan ko jodta hai।";
            c.enDivisionLabel = "Kanda " + num;
            c.hiDivisionLabel = "काण्ड " + num;
            c.suktaCount = Integer.parseInt(kandaInfo[i][4]);
            c.mantraCount = Integer.parseInt(kandaInfo[i][3]);
            c.enSages = "Atharvan|Angiras|Bhrigu sages";
            c.hiSages = "अथarvan|angiras|bhrigu";
            c.enThemes = kandaInfo[i][1] + "|Practical wisdom|Protection";
            c.hiThemes = kandaInfo[i][2] + "|vyavaharik gyan|raksha";
            c.enNotable = "Key suktas of Kanda " + num + "|Atharvaveda charms";
            c.hiNotable = "kanda " + num + " ke pramukh sukt|atharvaved kavach";
            c.verses = atharvaVerses(num);
            list.add(c);
        }
        return list;
    }

    private static List<VerseDef> atharvaVerses(int kanda) {
        if (kanda == 1) {
            return List.of(
                    v(1, "AV 1.1.1", "वाचं कीrtaya punaḥ ।", "Vācaṃ kīrtaya punaḥ",
                            "Praise speech again and again.", "वाक् की बार-बार स्तुति करो।",
                            "Opening hymn to Vak (divine speech).", "वाक् (divya vani) का prarambhik stotra।",
                            "Atharvan", "अथarvan"),
                    v(2, "AV 1.3.1", "शतamānam bhavati sahasradhārā ।",
                            "Śatamānaṃ bhavati sahasradhārā",
                            "A hundred-fold stream becomes thousand-fold.",
                            "shatdha dhara sahasradha hoti hai।",
                            "Metaphor for multiplying power of mantra.", "mantra ki vridhi ka rupak।",
                            "Atharvan", "अथarvan"),
                    v(3, "AV 1.15.1", "Ayur me dehi ।", "Āyur me dehi",
                            "Grant me long life.", "mujhe dirghayu do।",
                            "Classic longevity prayer.", "dirghayu ki prarthana।",
                            "Atharvan", "अथarvan")
            );
        }
        if (kanda == 7) {
            return List.of(
                    v(1, "AV 7.50.1", "Oṣadhe soma rājan ।", "Oṣadhe soma rājan",
                            "O herb, king Soma.", "he oshadhi, raja som।",
                            "Ayurvedic herb hymn.", "ayurvedic oshadhi stotra।",
                            "Atharvan", "अथarvan"),
                    v(2, "AV 7.74.1", "Apāṃ rūpāṇi pibat ।", "Apāṃ rūpāṇi pibat",
                            "Drink the forms of waters.", "jal ke rup pio।",
                            "Healing water mantra.", "chikitsak jal mantra।",
                            "Angiras", "angiras")
            );
        }
        return List.of(
                v(1, "AV " + kanda + ".1.1", "शantir avatu ।", "Śāntir avatu",
                        "May peace protect us.", "shanti hamari raksha kare।",
                        "Protective charm of Kanda " + kanda + ".", "kanda " + kanda + " ka raksha mantra।",
                        "Atharvan", "अथarvan"),
                v(2, "AV " + kanda + ".2.1", "Bhadram karṇebhiḥ śṛṇuyāma ।",
                        "Bhadraṃ karṇebhiḥ śṛṇuyāma",
                        "May we hear auspiciousness with our ears.",
                        "ham apne kano se mangalmay sunen।",
                        "Shanti mantra form.", "shanti mantra ka swarup।",
                        "Angiras", "angiras")
        );
    }

    private static String toDevanagariNum(int n) {
        String[] digits = {"०", "१", "२", "३", "४", "५", "६", "७", "८", "९"};
        StringBuilder sb = new StringBuilder();
        for (char ch : String.valueOf(n).toCharArray()) {
            sb.append(digits[ch - '0']);
        }
        return sb.toString();
    }
}
