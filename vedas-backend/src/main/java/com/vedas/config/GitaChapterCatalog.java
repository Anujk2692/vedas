package com.vedas.config;

import java.util.ArrayList;
import java.util.List;

/** Bhagavad Gita — 18 adhyayas with sample verses for chapter 1. */
public final class GitaChapterCatalog {

    private GitaChapterCatalog() {}

    public static List<VedaChapterCatalog.ChapterDef> chapters() {
        List<VedaChapterCatalog.ChapterDef> list = new ArrayList<>();
        String[][] titles = {
                {"अर्जुन विषाद योग", "Arjuna Vishada Yoga"},
                {"सांख्य योग", "Sankhya Yoga"},
                {"कर्म योग", "Karma Yoga"},
                {"ज्ञान कर्म संन्यास योग", "Jnana Karma Sanyasa Yoga"},
                {"कर्म संन्यास योग", "Karma Sanyasa Yoga"},
                {"ध्यान योग", "Dhyana Yoga"},
                {"ज्ञान विज्ञान योग", "Jnana Vijnana Yoga"},
                {"अक्षर ब्रह्म योग", "Akshara Brahma Yoga"},
                {"राज विद्या राज गुह्य योग", "Raja Vidya Raja Guhya Yoga"},
                {"विभूति योग", "Vibhuti Yoga"},
                {"विश्वरूप दर्शन योग", "Vishvarupa Darshana Yoga"},
                {"भक्ति योग", "Bhakti Yoga"},
                {"क्षेत्र क्षेत्रज्ञ विभाग योग", "Kshetra Kshetrajna Vibhaga Yoga"},
                {"गुणत्रय विभाग योग", "Gunatraya Vibhaga Yoga"},
                {"पुरुषोत्तम योग", "Purushottama Yoga"},
                {"दैवासुर सम्पद विभाग योग", "Daivasura Sampad Vibhaga Yoga"},
                {"श्रद्धात्रय विभाग योग", "Shraddhatraya Vibhaga Yoga"},
                {"मोक्ष संन्यास योग", "Moksha Sanyasa Yoga"},
        };
        for (int i = 0; i < titles.length; i++) {
            int num = i + 1;
            VedaChapterCatalog.ChapterDef c = new VedaChapterCatalog.ChapterDef();
            c.number = num;
            c.sanskritName = titles[i][0];
            c.transliteration = titles[i][1];
            c.enTitle = "Chapter " + num + " — " + titles[i][1];
            c.hiTitle = "अध्याय " + num + " — " + titles[i][0];
            c.enSummary = "Bhagavad Gita Chapter " + num;
            c.hiSummary = "श्रीमद्भगवद्गीता अध्याय " + num;
            c.enOverview = "Study this chapter with Hindi meaning, audio, and video explanations.";
            c.hiOverview = "हिंदी अर्थ, ऑडियो और वीडियो व्याख्या के साथ इस अध्याय का अध्ययन करें।";
            c.enDivisionLabel = "Adhyaya " + num;
            c.hiDivisionLabel = "अध्याय " + num;
            c.verses = num == 1 ? chapter1Verses() : List.of();
            list.add(c);
        }
        return list;
    }

    private static List<VedaChapterCatalog.VerseDef> chapter1Verses() {
        List<VedaChapterCatalog.VerseDef> verses = new ArrayList<>();
        verses.add(verse(1, "धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||",
                "dhṛtarāṣṭra uvāca | dharmakṣetre kurukṣetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya ||",
                "Dhritarashtra said: O Sanjaya, what did my sons and the sons of Pandu do when they assembled on the sacred field of Kurukshetra, eager for battle?",
                "धृतराष्ट्र ने कहा — हे संजय! धर्मक्षेत्र कुरुक्षेत्र में युद्ध की इच्छा से एकत्रित मेरे और पाण्डु के पुत्रों ने क्या किया?",
                "The opening verse sets the scene on the battlefield of Kurukshetra.",
                "यह श्लोक कुरुक्षेत्र के युद्ध के दृश्य का प्रस्तावना करता है।"));
        verses.add(verse(2, "सञ्जय उवाच | दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा | आचार्यमुपसंगम्य राजा वचनमब्रवीत् ||",
                "sañjaya uvāca | dṛṣṭvā tu pāṇḍavānīkaṃ vyūḍhaṃ duryodhanas tadā | ācāryam upasaṅgamya rājā vacanam abravīt ||",
                "Sanjaya said: Then King Duryodhana, seeing the Pandava army arrayed, approached his teacher Drona and spoke these words.",
                "संजय ने कहा — उस समय राजा दुर्योधन ने व्यूह रचित पाण्डव सेना को देखकर द्रोणाचार्य के पास जाकर यह वचन कहा।",
                "Duryodhana assesses the opposing forces before battle.",
                "दुर्योधन युद्ध से पूर्व शत्रु सेना का आकलन करता है।"));
        verses.add(verse(3, "पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् | व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||",
                "paśyaitāṃ pāṇḍuputrāṇām ācārya mahatīṃ camūm | vyūḍhāṃ drupadaputreṇa tava śiṣyeṇa dhīmatā ||",
                "Behold, O teacher, this mighty army of the sons of Pandu, arranged in military formation by your wise disciple, the son of Drupada.",
                "हे आचार्य! अपने बुद्धिमान शिष्य द्रुपदपुत्र (धृष्टद्युम्न) द्वारा व्यूह रचित पाण्डुपुत्रों की इस महती सेना को देखिए।",
                "Introduces Drupada's son as commander of the Pandava forces.",
                "पाण्डव सेना के सेनापति धृष्टद्युम्न का परिचय।"));
        return verses;
    }

    private static VedaChapterCatalog.VerseDef verse(int num, String sa, String tr, String en, String hi, String enCom, String hiCom) {
        VedaChapterCatalog.VerseDef v = new VedaChapterCatalog.VerseDef();
        v.number = num;
        v.sanskrit = sa;
        v.transliteration = tr;
        v.enTranslation = en;
        v.hiTranslation = hi;
        v.enCommentary = enCom;
        v.hiCommentary = hiCom;
        return v;
    }
}
