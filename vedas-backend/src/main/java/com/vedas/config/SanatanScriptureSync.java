package com.vedas.config;

import com.vedas.model.LocalizedText;
import com.vedas.model.Veda;
import com.vedas.repository.VedaRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/** Seeds expanded scriptures beyond the four Vedas. */
@Component
public class SanatanScriptureSync {

    private final VedaRepository vedaRepository;

    public SanatanScriptureSync(VedaRepository vedaRepository) {
        this.vedaRepository = vedaRepository;
    }

    public void syncAll() {
        for (Veda veda : buildScriptures()) {
            VedaDeepContent.apply(veda);
            vedaRepository.findBySlug(veda.getSlug()).ifPresentOrElse(existing -> {
                veda.setId(existing.getId());
                vedaRepository.save(veda);
            }, () -> vedaRepository.save(veda));
        }
        ensureVedaTypes();
    }

    private void ensureVedaTypes() {
        List<String> vedaSlugs = List.of("rigveda", "samaveda", "yajurveda", "atharvaveda");
        vedaRepository.findAll().forEach(v -> {
            if (v.getScriptureType() == null || v.getScriptureType().isBlank()) {
                v.setScriptureType(vedaSlugs.contains(v.getSlug()) ? "VEDA" : "ITIHASA");
                vedaRepository.save(v);
            }
        });
    }

    public static List<Veda> buildScriptures() {
        List<Veda> list = new ArrayList<>();
        list.add(gita());
        list.add(stub("ramayana", 6, "ITIHASA", "रामायण", "Ramayana",
                "Valmiki Ramayana — the divine story of Sri Rama.",
                "वाल्मीकि रामायण — श्री राम की दिव्य कथा।",
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800", 7, 24000));
        list.add(stub("mahabharata", 7, "ITIHASA", "महाभारत", "Mahabharata",
                "The great epic containing the Bhagavad Gita.",
                "महाभारत — जिसमें भगवद्गीता है, वह महान इतिहास।",
                "https://images.unsplash.com/photo-1604608672516-f011cb612a8b?w=800", 18, 100000));
        list.add(stub("ramcharitmanas", 8, "ITIHASA", "रामचरितमानस", "Ramcharitmanas",
                "Tulsidas's Hindi retelling of the Ramayana.",
                "तुलसीदास कृत हिंदी रामायण — रामचरितमानस।",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800", 7, 0));
        list.add(stub("upnishads", 9, "UPANISHAD", "उपनिषद", "Upanishads",
                "Philosophical teachings of the Vedas — Atman and Brahman.",
                "वेदों का दार्शनिक उपदेश — आत्मा और ब्रह्म का ज्ञान।",
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800", 108, 0));
        list.add(stub("puranas", 10, "PURANA", "पुराण", "Puranas",
                "Eighteen major Puranas — Bhagavata, Vishnu, Shiva and more.",
                "अठारह महापुराण — भागवत, विष्णु, शिव आदि।",
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", 18, 0));
        list.add(stub("yoga-sutra", 11, "DARSHAN", "योगसूत्र", "Yoga Sutra",
                "Patanjali's foundational text on Ashtanga Yoga.",
                "महर्षि पतंजलि का अष्टांग योग का मूल ग्रंथ।",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800", 4, 196));
        return list;
    }

    private static Veda gita() {
        Veda v = stub("gita", 5, "ITIHASA", "श्रीमद्भगवद्गीता", "Bhagavad Gita",
                "The song of the Lord — 700 verses of divine wisdom on dharma, karma, and bhakti.",
                "भगवान का उपदेश — धर्म, कर्म और भक्ति पर 700 दिव्य श्लोक।",
                "https://images.unsplash.com/photo-1508672019048-805c086bbae5?w=800", 18, 700);
        v.setPhilosophies(lt4(
                "en", "Karma Yoga, Bhakti Yoga, Jnana Yoga — three paths to liberation taught by Krishna.",
                "hi", "कर्मयोग, भक्तियोग, ज्ञानयोग — कृष्ण द्वारा बताए मोक्ष के तीन मार्ग।"));
        v.setLearningGuides(lt4(
                "en", "Read one chapter daily. Start with Arjuna Vishada Yoga. Use Hindi meaning and listen to patha.",
                "hi", "प्रतिदिन एक अध्याय पढ़ें। अर्जुन विषाद योग से आरंभ करें। हिंदी अर्थ और पाठ सुनें।"));
        v.setKeyThemes(lt4(
                "en", "Dharma|Karma|Bhakti|Moksha|Atman|Self-realization",
                "hi", "धर्म|कर्म|भक्ति|मोक्ष|आत्मा|आत्म-साक्षात्कार"));
        return v;
    }

    private static Veda stub(String slug, int order, String type, String sa, String tr,
                             String enDesc, String hiDesc, String cover, int chapters, int verses) {
        Veda v = new Veda();
        v.setSlug(slug);
        v.setOrder(order);
        v.setScriptureType(type);
        v.setSanskritName(sa);
        v.setTransliteration(tr);
        v.setTitles(lt(tr, sa));
        v.setDescriptions(lt(enDesc, hiDesc));
        v.setCoverImageUrl(cover);
        v.setChapterCount(chapters);
        v.setVerseCount(verses);
        v.setActive(true);
        return v;
    }

    private static List<LocalizedText> lt(String en, String hi) {
        return List.of(new LocalizedText("en", en), new LocalizedText("hi", hi));
    }

    private static List<LocalizedText> lt4(String enKey, String en, String hiKey, String hi) {
        return List.of(new LocalizedText(enKey, en), new LocalizedText(hiKey, hi));
    }
}
