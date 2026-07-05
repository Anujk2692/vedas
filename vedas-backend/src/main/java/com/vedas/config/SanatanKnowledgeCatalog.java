package com.vedas.config;

import com.vedas.model.ExternalResource;
import com.vedas.model.LocalizedText;
import com.vedas.model.StudyPath;
import com.vedas.model.StudyPathStep;
import com.vedas.model.Topic;

import java.util.ArrayList;
import java.util.List;

/** Curated Sanatan knowledge: topics, study paths, and free online resources (Hindi-first). */
public final class SanatanKnowledgeCatalog {

    private SanatanKnowledgeCatalog() {}

    public static List<Topic> topics() {
        List<Topic> list = new ArrayList<>();
        list.add(topic("dharma", 1, "🕉", "धर्म क्या है?", "What is Dharma?",
                "धर्म वह मार्ग है जो जीवन को व्यवस्था, नीति और आध्यात्मिक उन्नति की ओर ले जाता है। गीता में धर्म का अर्थ कर्तव्य, सत्य और न्याय से जुड़ा है।",
                "Dharma guides life through duty, truth, and righteousness.",
                List.of("gita", "mahabharata", "ramayana")));
        list.add(topic("karma", 2, "⚖", "कर्म सिद्धांत", "Law of Karma",
                "प्रत्येक कर्म का फल अवश्य मिलता है। गीता कर्मयोग सिखाती है — कर्म करो, फल की चिंता मत करो।",
                "Every action bears fruit; perform duty without attachment to results.",
                List.of("gita", "mahabharata")));
        list.add(topic("moksha", 3, "✨", "मोक्ष", "Moksha — Liberation",
                "मोक्ष आत्मा की संसार-चक्र से मुक्ति है। उपनिषद, गीता और वेदांत इस लक्ष्य की व्याख्या करते हैं।",
                "Liberation from the cycle of birth and death — the ultimate spiritual goal.",
                List.of("gita", "upnishads", "yoga-sutra")));
        list.add(topic("yoga", 4, "🧘", "योग", "Yoga",
                "योग मन, शरीर और आत्मा का मिलन है। अष्टांग योग, भक्ति, ज्ञान और कर्म — सभी योग के मार्ग हैं।",
                "Union of mind, body, and soul through multiple paths of yoga.",
                List.of("gita", "yoga-sutra")));
        list.add(topic("darshan", 5, "📜", "दर्शन शास्त्र", "Indian Philosophy",
                "षड्दर्शन — न्याय, वैशेषिक, सांख्य, योग, मीमांसा, वेदांत — भारतीय दर्शन की आधारशिला।",
                "Six classical schools of Indian philosophy including Vedanta.",
                List.of("upnishads", "gita", "yoga-sutra")));
        list.add(topic("sanskrit", 6, "🔤", "संस्कृत की शुरुआत", "Learning Sanskrit",
                "संस्कृत जानने से मूल ग्रंथों का सीधा अध्ययन संभव होता है। देवनागरी, मात्राएँ और श्लोक पाठ से आरंभ करें।",
                "Learn Devanagari and chanting to read scriptures in the original.",
                List.of("rigveda", "gita")));
        return list;
    }

    public static List<StudyPath> studyPaths() {
        List<StudyPath> list = new ArrayList<>();
        list.add(beginnerPath());
        list.add(oneYearPath());
        list.add(gita30DayPath());
        return list;
    }

    public static List<ExternalResource> resources() {
        List<ExternalResource> list = new ArrayList<>();
        list.add(resource("gita-press", 1, ExternalResource.ResourceType.LIBRARY,
                "https://www.gitapress.org/", "Gita Press",
                "गीता प्रेस डिजिटल लाइब्रेरी",
                "Gita Press Digital Library",
                "गीता, रामचरितमानस, भागवत, उपनिषद आदि के हिंदी संस्करण।",
                "Hindi editions of Gita, Ramcharitmanas, Bhagavata, Upanishads.", null, null));
        list.add(resource("archive-vedic", 2, ExternalResource.ResourceType.PDF,
                "https://archive.org/details/gitapress", "Archive.org",
                "वैदिक ग्रंथ संग्रह",
                "Vedic Texts on Archive.org",
                "गीता प्रेस और अन्य प्रकाशनों की अनेक हिंदी पुस्तकें PDF में।",
                "Free PDF books from Gita Press and other publishers.", null, null));
        list.add(resource("santansamaj", 3, ExternalResource.ResourceType.WEB,
                "https://www.sanatan.org/", "Sanatan Sanstha",
                "सनातन संस्था ग्रंथ संग्रह",
                "Sanatan Sanstha Granth Collection",
                "हिंदी में धर्म, संस्कार और ग्रंथ-आधारित लेख।",
                "Hindi articles and scripture-based guidance.", null, null));
        list.add(resource("sacred-texts", 4, ExternalResource.ResourceType.WEB,
                "https://www.sacred-texts.com/hin/", "Sacred Texts Archive",
                "इंटरनेट पवित्र ग्रंथ संग्रह",
                "Internet Sacred Text Archive",
                "अनेक प्राचीन ग्रंथों के अनुवाद और मूल पाठ।",
                "Translations and original texts of many scriptures.", null, null));
        list.add(resource("yt-gita", 5, ExternalResource.ResourceType.YOUTUBE,
                "https://www.youtube.com/results?search_query=भगवद्गीता+अध्याय+व्याख्या+हिंदी",
                "YouTube",
                "गीता अध्यायवार व्याख्या",
                "Bhagavad Gita Chapter-wise (Hindi)",
                "YouTube पर भगवद्गीता, उपनिषद, रामायण व्याख्यान खोजें।",
                "Chapter-wise Gita, Upanishad, Ramayana lectures on YouTube.", "gita", "dharma"));
        list.add(resource("yt-upanishad", 6, ExternalResource.ResourceType.YOUTUBE,
                "https://www.youtube.com/results?search_query=उपनिषद+व्याख्या+हिंदी",
                "YouTube",
                "उपनिषद व्याख्या",
                "Upanishad Lectures (Hindi)",
                "ईश, केन, कठ उपनिषद आदि की हिंदी व्याख्या।",
                "Hindi explanations of major Upanishads.", "upnishads", "moksha"));
        return list;
    }

    private static Topic topic(String slug, int order, String icon, String hiTitle, String enTitle,
                               String hiDesc, String enDesc, List<String> related) {
        Topic t = new Topic();
        t.setSlug(slug);
        t.setOrder(order);
        t.setIcon(icon);
        t.setTitles(lt(enTitle, hiTitle));
        t.setDescriptions(lt(enDesc, hiDesc));
        t.setSummaries(lt(enDesc, hiDesc));
        t.setRelatedScriptureSlugs(related);
        t.setActive(true);
        return t;
    }

    private static StudyPath beginnerPath() {
        StudyPath p = new StudyPath();
        p.setSlug("beginner-path");
        p.setOrder(1);
        p.setLevel("BEGINNER");
        p.setDurationLabel("6–12 months");
        p.setIcon("🌱");
        p.setTitles(lt("Beginner Path — Start Here", "शुरुआती अध्ययन क्रम"));
        p.setDescriptions(lt(
                "Recommended order for new students: Gita → Ramcharitmanas → Mahabharata → Bhagavata → Upanishads → Vedanta.",
                "नए विद्यार्थियों के लिए: गीता → रामचरितमानस → महाभारत → भागवत → उपनिषद → वेदांत।"));
        p.setSteps(List.of(
                step(1, "भगवद्गीता (हिंदी)", "Bhagavad Gita (Hindi)", "प्रतिदिन 1 अध्याय पढ़ें", "Read 1 chapter daily", "gita", "READ"),
                step(2, "रामचरितमानस", "Ramcharitmanas", "धर्म, कर्म और भक्ति", "Dharma, karma, and bhakti", "ramcharitmanas", "READ"),
                step(3, "महाभारत", "Mahabharata", "भीष्म, शांति, अनुशासन पर्व", "Key parvas of wisdom", "mahabharata", "READ"),
                step(4, "भागवत पुराण", "Bhagavata Purana", "भक्ति और दिव्य कथाएँ", "Bhakti and divine stories", "puranas", "READ"),
                step(5, "उपनिषद", "Upanishads", "आत्मा और ब्रह्म का ज्ञान", "Knowledge of Atman and Brahman", "upnishads", "READ"),
                step(6, "वेदांत और योग", "Vedanta & Yoga", "गहन दार्शनिक अध्ययन", "Deep philosophical study", "yoga-sutra", "READ")));
        p.setActive(true);
        return p;
    }

    private static StudyPath oneYearPath() {
        StudyPath p = new StudyPath();
        p.setSlug("one-year-hindi");
        p.setOrder(2);
        p.setLevel("INTERMEDIATE");
        p.setDurationLabel("12 months");
        p.setIcon("📅");
        p.setTitles(lt("One Year Hindi Study Plan", "एक वर्ष का हिंदी अध्ययन क्रम"));
        p.setDescriptions(lt(
                "Quarterly plan: Gita + meditation → Ramcharitmanas → Mahabharata → Upanishads & Yoga Sutra.",
                "त्रैमासिक योजना: गीता+ध्यान → रामचरितमानस → महाभारत → उपनिषद और योगसूत्र।"));
        p.setSteps(List.of(
                step(1, "पहले 3 महीने — गीता", "Months 1–3: Gita",
                        "प्रतिदिन 1 अध्याय, 10–15 मिनट ध्यान, एक श्लोक याद करें",
                        "Daily chapter, meditation, memorize one verse", "gita", "READ"),
                step(2, "अगले 3 महीने — रामचरितमानस", "Months 4–6: Ramcharitmanas",
                        "धर्म, कर्म और भक्ति के सिद्धांत", "Principles of dharma and bhakti", "ramcharitmanas", "READ"),
                step(3, "अगले 3 महीने — महाभारत", "Months 7–9: Mahabharata",
                        "भीष्म, शांति और अनुशासन पर्व", "Bhisma, Shanti, Anushasan parvas", "mahabharata", "READ"),
                step(4, "अंतिम 3 महीने — उपनिषद", "Months 10–12: Upanishads",
                        "उपनिषद, योगसूत्र, वेदांत का प्रारंभ", "Upanishads, Yoga Sutra, Vedanta intro", "upnishads", "READ")));
        p.setActive(true);
        return p;
    }

    private static StudyPath gita30DayPath() {
        StudyPath p = new StudyPath();
        p.setSlug("gita-30-days");
        p.setOrder(3);
        p.setLevel("BEGINNER");
        p.setDurationLabel("30 days");
        p.setIcon("📖");
        p.setTitles(lt("30-Day Gita Course", "30 दिन का गीता कोर्स"));
        p.setDescriptions(lt(
                "Read one Gita chapter per day for 30 days (18 chapters + revision).",
                "30 दिन में 18 अध्याय + पुनरावृत्ति — प्रतिदिन एक अध्याय।"));
        p.setSteps(List.of(
                step(1, "दिन 1–18: अध्याय पाठ", "Days 1–18: Chapters",
                        "प्रतिदिन एक अध्याय पढ़ें और सुनें", "Read and listen to one chapter daily", "gita", "READ"),
                step(2, "दिन 19–24: कर्मयोग", "Days 19–24: Karma Yoga",
                        "अध्याय 2–6 पर ध्यान", "Focus on chapters 2–6", "gita", "READ"),
                step(3, "दिन 25–30: भक्ति और ज्ञान", "Days 25–30: Bhakti & Jnana",
                        "अध्याय 7–18 की समीक्षा", "Review chapters 7–18", "gita", "READ")));
        p.setActive(true);
        return p;
    }

    private static StudyPathStep step(int order, String hiTitle, String enTitle, String hiDesc, String enDesc,
                                      String scriptureSlug, String actionType) {
        StudyPathStep s = new StudyPathStep();
        s.setOrder(order);
        s.setTitles(lt(enTitle, hiTitle));
        s.setDescriptions(lt(enDesc, hiDesc));
        s.setScriptureSlug(scriptureSlug);
        s.setActionType(actionType);
        return s;
    }

    private static ExternalResource resource(String slug, int order, ExternalResource.ResourceType type,
                                             String url, String source, String hiTitle, String enTitle,
                                             String hiDesc, String enDesc, String scriptureSlug, String topicSlug) {
        ExternalResource r = new ExternalResource();
        r.setSlug(slug);
        r.setOrder(order);
        r.setType(type);
        r.setUrl(url);
        r.setSourceName(source);
        r.setTitles(lt(enTitle, hiTitle));
        r.setDescriptions(lt(enDesc, hiDesc));
        r.setScriptureSlug(scriptureSlug);
        r.setTopicSlug(topicSlug);
        r.setActive(true);
        return r;
    }

    private static List<LocalizedText> lt(String en, String hi) {
        List<LocalizedText> list = new ArrayList<>();
        list.add(new LocalizedText("en", en));
        list.add(new LocalizedText("hi", hi));
        return list;
    }
}
