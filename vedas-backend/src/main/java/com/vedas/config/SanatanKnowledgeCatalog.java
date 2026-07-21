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
        list.add(topic(1, "sanatan-dharma", "🕉",
                "सनातन धर्म क्या है?", "What is Sanatan Dharma?",
                "सनातन धर्म शाश्वत जीवन-मार्ग है — सत्य, धर्म, कर्म और मोक्ष की खोज।",
                "Sanatan Dharma is the eternal way of living — seeking truth, duty, action, and liberation.",
                "सरल शब्दों में: अच्छा जीवन जीने का शाश्वत मार्ग।",
                "In simple words: the eternal path of living well and seeking truth.",
                "यह परंपरा वेद, उपनिषद, गीता, रामायण और पुराणों से पोषित है। इसमें पूजा, ज्ञान, भक्ति और सेवा सभी समाहित हैं। 'सनातन' का अर्थ है अनादि-अनंत — समय से बँधा हुआ धर्म नहीं।",
                "Fed by Vedas, Upanishads, Gita, Ramayana, and Puranas, it includes worship, knowledge, devotion, and service. 'Sanatan' means beginningless and endless — not a time-bound creed.",
                List.of("gita", "ramayana", "upnishads")));
        list.add(topic(2, "dharma", "⚖️",
                "धर्म", "Dharma",
                "धर्म वह मार्ग है जो जीवन को व्यवस्था, नीति और आध्यात्मिक उन्नति की ओर ले जाता है।",
                "Dharma guides life through duty, truth, and righteousness.",
                "धर्म = सही कर्तव्य और सही आचरण।",
                "Dharma = right duty and right conduct.",
                "गीता में धर्म व्यक्तिगत स्वधर्म से जुड़ा है — अपनी प्रकृति और भूमिका के अनुसार कर्म। महाभारत धर्म के कठिन प्रश्नों को कथाओं से दर्शाती है।",
                "In the Gita, dharma includes svadharma — action aligned with one's nature and role. The Mahabharata explores hard ethical questions through story.",
                List.of("gita", "mahabharata", "ramayana")));
        list.add(topic(3, "karma", "🔄",
                "कर्म सिद्धांत", "Law of Karma",
                "प्रत्येक कर्म का फल अवश्य मिलता है। गीता कर्मयोग सिखाती है।",
                "Every action bears fruit; the Gita teaches Karma Yoga.",
                "जो बोओगे वही काटोगे — पर फल छोड़कर कर्म करो।",
                "As you sow, so you reap — yet act without clinging to results.",
                "कर्म का अर्थ केवल पाप-पुण्य नहीं; यह मनोवृत्ति और प्रेरणा भी है। गीता २.४७ सिखाती है: कर्म में अधिकार है, फल में नहीं।",
                "Karma is not only reward and punishment; intention matters. Gita 2.47: you have a right to action, not to the fruits.",
                List.of("gita", "mahabharata")));
        list.add(topic(4, "moksha", "✨",
                "मोक्ष", "Moksha — Liberation",
                "मोक्ष आत्मा की संसार-चक्र से मुक्ति है।",
                "Liberation from the cycle of birth and death.",
                "मोक्ष = जन्म-मरण के चक्र से स्वतंत्रता।",
                "Moksha = freedom from the cycle of birth and death.",
                "उपनिषद आत्मा-ब्रह्म एकता बताते हैं। गीता ज्ञान, भक्ति और कर्म के मार्ग दिखाती है। योगसूत्र चित्त-वृत्ति निरोध से शांति सिखाता है।",
                "Upanishads teach Atman-Brahman unity. The Gita offers paths of knowledge, devotion, and action. Yoga Sutra points to stilling the mind.",
                List.of("gita", "upnishads", "yoga-sutra")));
        list.add(topic(5, "rebirth", "♻️",
                "पुनर्जन्म", "Rebirth",
                "आत्मा शरीर बदलती है जैसे वस्त्र — कर्म के अनुसार नई यात्रा।",
                "The soul changes bodies as clothes — a new journey according to karma.",
                "शरीर मरता है, आत्मा आगे बढ़ती है।",
                "The body dies; the soul continues.",
                "गीता २.२२ में वस्त्र-रूपक प्रसिद्ध है। पुनर्जन्म की समझ करुणा और जिम्मेदारी बढ़ाती है।",
                "Gita 2.22 uses the clothes metaphor. Understanding rebirth deepens compassion and responsibility.",
                List.of("gita", "upnishads")));
        list.add(topic(6, "yugas", "🌀",
                "युग", "Yugas",
                "चार युग — सत्य, त्रेता, द्वापर, कलि — धर्म की घटती-बढ़ती तीव्रता।",
                "Four ages — Satya, Treta, Dvapara, Kali — cycles of rising and falling dharma.",
                "समय के चार बड़े चक्र।",
                "Four great cycles of time.",
                "पुराण युगों का विस्तार देते हैं। कलियुग में नाम-जप और साधारण धर्म को विशेष महत्व मिलता है।",
                "Puranas elaborate the yugas. In Kali Yuga, nama-japa and simple dharma are especially valued.",
                List.of("puranas", "mahabharata")));
        list.add(topic(7, "vedas-intro", "📖",
                "वेद", "Vedas",
                "चार वेद — ऋक्, साम, यजुर्, अथर्व — ज्ञान की मूल स्रोत।",
                "Four Vedas — Rig, Sama, Yajur, Atharva — the root of sacred knowledge.",
                "वेद = प्राचीनतम पवित्र ज्ञान।",
                "Vedas = the oldest sacred knowledge.",
                "मंत्र, ब्राह्मण, आरण्यक और उपनिषद वेद की परतें हैं। अध्ययन श्रद्धा और गुरु-परंपरा से होता है।",
                "Mantra, Brahmana, Aranyaka, and Upanishad are Vedic layers. Study proceeds with reverence and lineage.",
                List.of("rigveda", "samaveda", "yajurveda", "atharvaveda")));
        list.add(topic(8, "upanishads-intro", "🕉️",
                "उपनिषद", "Upanishads",
                "उपनिषद वेद का ज्ञानकांड — आत्मा और ब्रह्म का रहस्य।",
                "Upanishads are the wisdom portion of the Vedas — Atman and Brahman.",
                "उपनिषद = गहन आध्यात्मिक संवाद।",
                "Upanishads = deep spiritual dialogues.",
                "ईश, केन, कठ, मुण्डक, माण्डूक्य आदि प्रमुख हैं। 'तत्त्वमसि' जैसे महावाक्य वेदांत की नींव हैं।",
                "Isha, Kena, Katha, Mundaka, Mandukya are key. Great sayings like 'Tat tvam asi' found Vedanta.",
                List.of("upnishads")));
        list.add(topic(9, "puranas-intro", "📚",
                "पुराण", "Puranas",
                "अठारह महापुराण — कथाओं से धर्म, भक्ति और सृष्टि-विज्ञान।",
                "Eighteen Maha Puranas — dharma, devotion, and cosmology through story.",
                "पुराण = कहानियों से शिक्षा।",
                "Puranas = teaching through stories.",
                "भागवत, विष्णु, शिव पुराण लोकप्रिय हैं। वे कठिन दर्शन को सुलभ कथा बनाते हैं।",
                "Bhagavata, Vishnu, and Shiva Puranas are widely loved. They make philosophy accessible through narrative.",
                List.of("puranas")));
        list.add(topic(10, "ramayana-intro", "🏹",
                "रामायण", "Ramayana",
                "राम की कथा — धर्म, मर्यादा और भक्ति का आदर्श।",
                "The story of Rama — ideals of dharma, dignity, and devotion.",
                "रामायण = मर्यादा पुरुषोत्तम की यात्रा।",
                "Ramayana = the journey of Maryada Purushottama.",
                "वाल्मीकि रामायण और तुलसीदास का रामचरितमानस दो प्रमुख धाराएँ हैं। हनुमान भक्ति का केंद्र हैं।",
                "Valmiki Ramayana and Tulsidas' Ramcharitmanas are two major streams. Hanuman is central to devotion.",
                List.of("ramayana", "ramcharitmanas")));
        list.add(topic(11, "mahabharata-intro", "⚔️",
                "महाभारत", "Mahabharata",
                "कुरुक्षेत्र का महाकाव्य — धर्मयुद्ध और गीता का घर।",
                "The Kurukshetra epic — home of dharma-yuddha and the Gita.",
                "महाभारत = जीवन के सभी प्रश्नों का ग्रंथ।",
                "Mahabharata = a scripture of life's hardest questions.",
                "भीष्म, विदुर नीति, शांति पर्व और अनुशासन पर्व ज्ञान के खजाने हैं। गीता इसी के भीष्म पर्व में है।",
                "Bhishma, Vidura Niti, Shanti and Anushasana parvas are treasuries of wisdom. The Gita sits within Bhishma Parva.",
                List.of("mahabharata", "gita")));
        list.add(topic(12, "gita-intro", "🪷",
                "भगवद्गीता", "Bhagavad Gita",
                "कृष्ण-अर्जुन संवाद — कर्म, भक्ति और ज्ञान का सार।",
                "Krishna-Arjuna dialogue — essence of karma, bhakti, and jnana.",
                "गीता = जीवन का व्यावहारिक आध्यात्म।",
                "Gita = practical spirituality for life.",
                "१८ अध्याय, ~७०० श्लोक। प्रतिदिन एक श्लोक पढ़ना और सुनना सबसे अच्छा आरंभ है।",
                "18 chapters, ~700 verses. Reading and listening to one verse daily is the best start.",
                List.of("gita")));
        list.add(topic(13, "vedanta", "🔮",
                "वेदांत", "Vedanta",
                "वेदांत — उपनिषदों का दर्शन: ब्रह्म सत्य, जगत् मिथ्या, जीवो ब्रह्मैव।",
                "Vedanta — philosophy of the Upanishads: Brahman as ultimate reality.",
                "वेदांत = वेद का अंतिम ज्ञान।",
                "Vedanta = the culminating wisdom of the Vedas.",
                "अद्वैत, विशिष्टाद्वैत और द्वैत प्रमुख धाराएँ हैं। गीता और ब्रह्मसूत्र भी वेदांत के स्तंभ हैं।",
                "Advaita, Vishishtadvaita, and Dvaita are major schools. Gita and Brahma Sutra are pillars too.",
                List.of("upnishads", "gita")));
        list.add(topic(14, "yoga", "🧘",
                "योग", "Yoga",
                "योग मन, शरीर और आत्मा का मिलन — अष्टांग से भक्ति तक।",
                "Yoga unites mind, body, and soul — from Ashtanga to bhakti.",
                "योग = जुड़ना और स्थिर होना।",
                "Yoga = union and steadiness.",
                "पतंजलि योगसूत्र अष्टांग योग देता है। गीता कर्म, भक्ति, ज्ञान योग सिखाती है।",
                "Patanjali's Yoga Sutra gives Ashtanga Yoga. The Gita teaches karma, bhakti, and jnana yoga.",
                List.of("yoga-sutra", "gita")));
        list.add(topic(15, "ayurveda", "🌿",
                "आयुर्वेद", "Ayurveda",
                "आयुर्वेद — जीवन विज्ञान: दोष, आहार, दिनचर्या।",
                "Ayurveda — science of life: doshas, diet, and daily routine.",
                "आयुर्वेद = स्वास्थ्य का शास्त्र।",
                "Ayurveda = the science of health.",
                "अथर्ववेद में औषधि मंत्र हैं। चरक-सुश्रुत परंपरा आयुर्वेद का विस्तार है। शिक्षा के लिए दिनचर्या और सात्विक आहार से आरंभ करें।",
                "Atharvaveda holds healing mantras. Charaka-Sushruta expand the tradition. Start with dinacharya and sattvic food.",
                List.of("atharvaveda")));
        list.add(topic(16, "meditation", "🕯️",
                "ध्यान", "Meditation",
                "ध्यान — मन को एकाग्र कर आंतरिक शांति पाना।",
                "Meditation — focusing the mind toward inner stillness.",
                "ध्यान = शांत बैठकर देखना।",
                "Meditation = sitting quietly and seeing clearly.",
                "प्राणायाम, जप और श्वास-निरीक्षण सरल आरंभ हैं। गीता ६ अध्याय ध्यान योग सिखाता है।",
                "Pranayama, japa, and breath awareness are simple starts. Gita chapter 6 teaches dhyana yoga.",
                List.of("gita", "yoga-sutra")));
        list.add(topic(17, "darshan", "📜",
                "दर्शन शास्त्र", "Indian Philosophy",
                "षड्दर्शन — न्याय से वेदांत तक भारतीय दर्शन।",
                "Six classical schools from Nyaya to Vedanta.",
                "दर्शन = सत्य देखने के मार्ग।",
                "Darshan = ways of seeing truth.",
                "न्याय, वैशेषिक, सांख्य, योग, मीमांसा, वेदांत — प्रत्येक प्रश्न और विधि देता है।",
                "Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta — each offers questions and method.",
                List.of("upnishads", "gita", "yoga-sutra")));
        list.add(topic(18, "sanskrit", "🔤",
                "संस्कृत की शुरुआत", "Learning Sanskrit",
                "देवनागरी और श्लोक पाठ से मूल ग्रंथों तक पहुँच।",
                "Reach original texts via Devanagari and chanting.",
                "संस्कृत = मूल भाषा की कुंजी।",
                "Sanskrit = the key to original wording.",
                "मात्राएँ, संधि और श्लोक अभ्यास से आरंभ करें। गीता और गायत्री अच्छे पहले पाठ हैं।",
                "Start with vowels, sandhi, and verse practice. Gita and Gayatri are excellent first texts.",
                List.of("rigveda", "gita")));
        return list;
    }

    private static Topic topic(int order, String slug, String icon,
                               String hiTitle, String enTitle,
                               String hiDesc, String enDesc,
                               String hiSimple, String enSimple,
                               String hiDetailed, String enDetailed,
                               List<String> related) {
        Topic t = new Topic();
        t.setSlug(slug);
        t.setOrder(order);
        t.setIcon(icon);
        t.setTitles(lt(enTitle, hiTitle));
        t.setDescriptions(lt(enDesc, hiDesc));
        t.setSummaries(lt(enSimple, hiSimple));
        t.setSimpleExplanations(lt(enSimple, hiSimple));
        t.setDetailedExplanations(lt(enDetailed, hiDetailed));
        t.setRelatedScriptureSlugs(related);
        t.setActive(true);
        return t;
    }

    private static Topic topic(String slug, int order, String icon, String hiTitle, String enTitle,
                               String hiDesc, String enDesc, List<String> related) {
        return topic(order, slug, icon, hiTitle, enTitle, hiDesc, enDesc, hiDesc, enDesc, hiDesc, enDesc, related);
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
