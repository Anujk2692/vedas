package com.vedas.config;

import java.util.ArrayList;
import java.util.List;

/** Tulsidas Ramcharitmanas — 7 Kandas with sample dohas. */
public final class RamcharitmanasChapterCatalog {

    private RamcharitmanasChapterCatalog() {}

    public static List<VedaChapterCatalog.ChapterDef> chapters() {
        String[][] kandas = {
                {"बालकाण्ड", "Bal Kand", "श्री राम की जन्म कथा और बाल लीला", "Birth and childhood of Sri Rama"},
                {"अयोध्याकाण्ड", "Ayodhya Kand", "वनवास और कैकेयी का प्रसंग", "Exile to the forest"},
                {"अरण्यकाण्ड", "Aranya Kand", "वन में राम-सीता-लक्ष्मण", "Life in the forest, Surpanakha"},
                {"किष्किंधाकाण्ड", "Kishkindha Kand", "सुग्रीव और हनुमान से मिलन", "Alliance with Sugriva and Hanuman"},
                {"सुंदरकाण्ड", "Sundar Kand", "हनुमान की लंका यात्रा", "Hanuman's journey to Lanka"},
                {"लंकाकाण्ड", "Lanka Kand", "रावण वध और युद्ध", "Battle and victory over Ravana"},
                {"उत्तरकाण्ड", "Uttar Kand", "राम राज्य और उपदेश", "Rama's reign and teachings"},
        };
        List<VedaChapterCatalog.ChapterDef> list = new ArrayList<>();
        for (int i = 0; i < kandas.length; i++) {
            int num = i + 1;
            VedaChapterCatalog.ChapterDef c = new VedaChapterCatalog.ChapterDef();
            c.number = num;
            c.sanskritName = kandas[i][0];
            c.transliteration = kandas[i][1];
            c.enTitle = kandas[i][1];
            c.hiTitle = kandas[i][0];
            c.enSummary = kandas[i][3];
            c.hiSummary = kandas[i][2];
            c.enOverview = "Read dohas with Hindi meaning — Gita Press edition recommended.";
            c.hiOverview = "दोहों सहित हिंदी अर्थ पढ़ें — गीता प्रेस संस्करण अनुशंसित।";
            c.enDivisionLabel = "Kand " + num;
            c.hiDivisionLabel = "काण्ड " + num;
            c.verses = sampleVerses(num);
            list.add(c);
        }
        return list;
    }

    private static List<VedaChapterCatalog.VerseDef> sampleVerses(int kand) {
        List<VedaChapterCatalog.VerseDef> v = new ArrayList<>();
        if (kand == 1) {
            v.add(doha(1, "श्री गुरु चरन सरोज रज, निज मन मुकुर सुधारि ।",
                    "Shri guru charan saroj raj, nij man mukur sudhari",
                    "Cleansing the mirror of my mind with the dust of the Guru's lotus feet.",
                    "गुरु चरणों की धूल से मन-मIRROR को शुद्ध करके।",
                    "Opening doha of Ramcharitmanas — most famous verse in Hindi literature."));
            v.add(doha(2, "बандउँ गुरु पद पदुम परागा, सुरुचि सुवास सरस अनुरागा ॥",
                    "Bandau guru pad padum paraga",
                    "I bow to the pollen of the Guru's lotus feet, fragrant and full of love.",
                    "गुरु पद कमल की पराग को नमस्कार।",
                    "Second opening doha praising the Guru."));
        } else if (kand == 5) {
            v.add(doha(1, "जामवंत के बचन सुहाए, सुनि हनुमंत हृदय अति भाए ॥",
                    "Jamvant ke bachan suhae, suni Hanumant hriday ati bhae",
                    "Hanuman's heart rejoiced hearing Jamvant's encouraging words.",
                    "जामवंत के उत्तेजक वचन सुनकर हनुमान का हृदय प्रसन्न हुआ।",
                    "From Sundar Kand — Hanuman prepares for Lanka."));
        } else if (kand == 7) {
            v.add(doha(1, "दोहा — जे नर होहिं पर उपकारी, तिन्ह के संत सदा प्रभु प्यारी ॥",
                    "Je nar hohin par upkari, tinh ke sant sada prabhu pyari",
                    "The Lord always loves saints who help others.",
                    "जो परोपकारी हैं, भगवान उन्हें सदा प्रिय रखते हैं।",
                    "Teaching on selfless service from Uttar Kand."));
        }
        return v;
    }

    private static VedaChapterCatalog.VerseDef doha(int num, String sa, String tr, String en, String hi, String com) {
        VedaChapterCatalog.VerseDef d = new VedaChapterCatalog.VerseDef();
        d.number = num;
        d.sanskrit = sa;
        d.transliteration = tr;
        d.enTranslation = en;
        d.hiTranslation = hi;
        d.enCommentary = com;
        d.hiCommentary = com;
        d.suktaReference = "Doha " + num;
        return d;
    }
}
