package com.vedas.service;

import com.vedas.dto.DailyShlokDto;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class DailyShlokService {

    private static final List<DailyShlokDto> SHLOKS = List.of(
            shlok("कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।", "Karmany evadhikaras te ma phaleshu kadachana",
                    "तेरा अधिकार केवल कर्म में है, फल में नहीं।", "Perform duty without attachment to results.",
                    "Bhagavad Gita 2.47", "gita", "Karma Yoga"),
            shlok("यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।", "Yada yada hi dharmasya glanir bhavati bharata",
                    "जब धर्म की हानि होती है, तब मैं अवतार लेता हूँ।", "Whenever dharma declines, I manifest.",
                    "Bhagavad Gita 4.7", "gita", "Avatar"),
            shlok("सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।", "Sarva-dharman parityajya mam ekam sharanam vaja",
                    "सब धर्म छोड़कर मेरी शरण लो।", "Surrender to Me alone for liberation.",
                    "Bhagavad Gita 18.66", "gita", "Moksha"),
            shlok("तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि।", "Tat savitur varenyam bhargo devasya dhimahi",
                    "हम दिव्य प्रकाश का ध्यान करते हैं।", "We meditate on the divine light of Savitar.",
                    "Rigveda — Gayatri", "rigveda", "Illumination"),
            shlok("श्री गुरु चरन सरोज रज, निज मन मुकुर सुधारि।", "Shri guru charan saroj raj",
                    "गुरु चरणों से मन शुद्ध होता है।", "Purify the mind with the Guru's grace.",
                    "Ramcharitmanas", "ramcharitmanas", "Guru Bhakti"),
            shlok("वसुदेवसुतं देवं कंसचाणूरमर्दनम्।", "Vasudeva-sutam devam",
                    "भगवान श्रीकृष्ण की शरण में।", "Salutations to Krishna, destroyer of Kamsa.",
                    "Vishnu Stotra", "gita", "Bhakti"),
            shlok("ॐ असतो मा सद्गमय।", "Om asato ma sad gamaya",
                    "असत्य से सत्य की ओर ले चलो।", "Lead me from untruth to truth.",
                    "Upanishad — Pavamana", "upnishads", "Peace")
    );

    public DailyShlokDto getToday(String lang) {
        int index = LocalDate.now().getDayOfYear() % SHLOKS.size();
        DailyShlokDto dto = SHLOKS.get(index);
        if ("hi".equalsIgnoreCase(lang)) {
            return dto;
        }
        DailyShlokDto en = new DailyShlokDto();
        en.setSanskrit(dto.getSanskrit());
        en.setTransliteration(dto.getTransliteration());
        en.setTranslation(dto.getCommentary());
        en.setCommentary(dto.getTranslation());
        en.setSource(dto.getSource());
        en.setScriptureSlug(dto.getScriptureSlug());
        en.setTheme(dto.getTheme());
        return en;
    }

    private static DailyShlokDto shlok(String sa, String tr, String hi, String en, String source, String slug, String theme) {
        DailyShlokDto d = new DailyShlokDto();
        d.setSanskrit(sa);
        d.setTransliteration(tr);
        d.setTranslation(hi);
        d.setCommentary(en);
        d.setSource(source);
        d.setScriptureSlug(slug);
        d.setTheme(theme);
        return d;
    }
}
