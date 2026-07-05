package com.vedas.config;

import com.vedas.model.LocalizedText;
import com.vedas.model.Veda;

import java.util.List;

/**
 * Deep scholarly content for each Veda — philosophy, rituals, learning guides, etc.
 */
public final class VedaDeepContent {

    private VedaDeepContent() {}

    public static void apply(Veda v) {
        switch (v.getSlug()) {
            case "rigveda" -> applyRigveda(v);
            case "samaveda" -> applySamaveda(v);
            case "yajurveda" -> applyYajurveda(v);
            case "atharvaveda" -> applyAtharvaveda(v);
            default -> ScriptureDeepContent.apply(v);
        }
        ScripturePdfLibrary.applyPdf(v);
    }

    private static void applyRigveda(Veda v) {
        v.setPhilosophies(List.of(
                lt("en", "The Rigveda introduces Rita — the cosmic moral order governing sun, seasons, and human conduct. Satya (truth) and Tapas (spiritual heat/austerity) are central virtues. The Nasadiya Sukta contemplates creation without dogma, asking 'Who knows?' — an early philosophical humility. The Purusha Sukta describes cosmic sacrifice (Purusha as primordial being) that became foundational to later Vedanta and social philosophy."),
                lt("hi", "ऋग्वेद ऋत — ब्रह्मांडीय नैतिक व्यवस्था — की अवधारणा देता है। सत्य और तप केंद्रीय गुण हैं। नासदीय सूक्त सृष्टि पर विचार करता है। पुरुष सूक्त ब्रह्मांडीय यज्ञ का वर्णन करता है जो बाद में वेदांत की आधारशिला बना।")
        ));
        v.setRitualsAndPractices(List.of(
                lt("en", "Daily Agnihotra (fire offering), Soma Yajna (sacred drink ceremony), Ashvamedha (horse sacrifice for sovereignty), Rajasuya (royal consecration). Hymns are recited by Hotri priests. Sandhya Vandana (twilight worship) draws from Rigvedic solar hymns. Each sukta begins with invocation to Agni as divine messenger."),
                lt("hi", "दैनिक अग्निहोत्र, सोम यज्ञ, अश्वमेध, राजसूय। होता पुजारी सूक्त पाठ करते हैं। संध्यावंदना ऋग्वैदिक सूर्य स्तुतियों से उत्पन्न। प्रत्येक सूक्त अग्नि के आह्वान से प्रारंभ।")
        ));
        v.setFamousHymns(List.of(
                lt("en", "Agni Sukta (1.1.1) — Opening hymn|Nasadiya Sukta (10.129) — Hymn of Creation|Purusha Sukta (10.90) — Cosmic Man|Gayatri Mantra (3.62.10) — Most sacred mantra|Dedictory to Earth (5.84)|Hymn to Night (10.127)|Vishvamitra's hymns to Indra"),
                lt("hi", "अग्नि सूक्त (1.1.1)|नासदीय सूक्त (10.129)|पुरुष सूक्त (10.90)|गायत्री मंत्र (3.62.10)|पृथ्वी स्तुति (5.84)|रात्रि सूक्त (10.127)|विश्वामित्र के इन्द्र स्तोत्र")
        ));
        v.setLearningGuides(List.of(
                lt("en", "Step 1: Learn Devanagari script and basic Sandhi rules. Step 2: Study Agni Sukta with word-by-word meaning. Step 3: Understand Chhandas (meters) — Gayatri (24 syllables), Trishtubh (44), Jagati (48). Step 4: Read Mandala 1 and 10 for cosmology. Step 5: Compare translations (Griffith, Wilson, Jamison-Brereton). Step 6: Listen to traditional Ghanapatha and Samhita patha recitations. Step 7: Connect hymns to daily Sandhya practice."),
                lt("hi", "चरण 1: देवनागरी और सन्धि सीखें। चरण 2: अग्नि सूक्त शब्दार्थ सहित। चरण 3: छंद — गायत्री, त्रिष्टुप, जगती। चरण 4: मंडल 1 और 10 — ब्रह्मांड विज्ञान। चरण 5: अनुवादों की तुलना। चरण 6: घनपाठ और संहिता पाठ सुनें। चरण 7: दैनिक संध्यावंदना से जोड़ें।")
        ));
        v.setCoreConcepts(List.of(
                lt("en", "Rita (Cosmic Order)|Satya (Truth)|Tapas (Austerity)|Yajna (Sacrifice)|Agni (Sacred Fire)|Soma (Divine Inspiration)|Deva (Shining Ones)|Rishi (Seer)|Mantra (Sacred Utterance)|Shruti (Revealed Wisdom)"),
                lt("hi", "ऋत|सत्य|तप|यज्ञ|अग्नि|सोम|देव|ऋषि|मंत्र|श्रुति")
        ));
        v.setModernRelevance(List.of(
                lt("en", "The Gayatri Mantra is chanted by millions daily worldwide. Rigvedic environmental hymns inspire ecological thought. Nasadiya Sukta's open questioning parallels modern scientific humility. Yoga and meditation traditions trace roots to Vedic fire and breath rituals. UNESCO recognizes Vedic chanting as Intangible Cultural Heritage."),
                lt("hi", "गायत्री मंत्र दुनिया भर में प्रतिदिन जपा जाता है। ऋग्वैदिक पर्यावरण स्तोत्र पारिस्थितिक चिंतन को प्रेरित करते हैं। नासदीय सूक्त आधुनिक वैज्ञानिक विनम्रता से मेल खाता है। योग-ध्यान की जड़ें वैदिक अग्नि और प्राण अनुष्ठानों में हैं।")
        ));
        v.setRelatedTexts(List.of(
                lt("en", "Brahmanas (ritual commentary): Aitareya, Kaushitaki. Aranyakas (forest texts). Upanishads: Aitareya, Kaushitaki. Puranas reference Rigvedic legends extensively. Nirukta by Yaska — etymological commentary on Vedic words."),
                lt("hi", "ब्राह्मण: ऐतरेय, कौशीतकी। आरण्यक। उपनिषद: ऐतरेय, कौशीतकी। पुराण। यास्क का निरukta — शब्द व्यut्पत्ति।")
        ));
        v.setPronunciationGuides(List.of(
                lt("en", "Vedic Sanskrit differs from Classical Sanskrit. Key rules: Aspirated consonants (kh, gh, ch, jh, th, dh, ph, bh) must be pronounced with breath. Retroflex consonants (ṭ, ṭh, ḍ, ḍh, ṇ) with tongue curled back. Long vowels (ā, ī, ū) held twice as long. Anusvara (ṃ) nasalizes preceding vowel. Use traditional Guru (long) and Laghu (short) syllable rules for correct chanting."),
                lt("hi", "वैदिक संस्कृत classical से भिन्न। महाप्राण व्यंजन, मूर्धन्य व्यंजन, दीर्घ स्वर, अनुस्वार। गुरु-लघु नियमों से सही पाठ।")
        ));
    }

    private static void applySamaveda(Veda v) {
        v.setPhilosophies(List.of(
                lt("en", "Samaveda teaches that sound (Nada) is the bridge between human and divine. The seven Svaras represent cosmic vibrations. Music is not entertainment but Sadhana (spiritual practice). The identity of Rigvedic text and Samavedic melody shows that meaning and form are inseparable in Vedic thought."),
                lt("hi", "सामवेद सिखाता है कि नाद मानव और दिव्य के बीच सेतु है। सात स्वर ब्रह्मांडीय कंपन हैं। संगीत साधना है, मनोरंजन नहीं। ऋचा और स्वर का एकत्व वैदिक चिंतन का सार है।")
        ));
        v.setRitualsAndPractices(List.of(
                lt("en", "Soma Yajna is the primary Samavedic ritual — Udgatri priests sing Samans while Adhvaryu performs actions. Gramageya (village) and Aranyageya (forest) chants for different settings. Stotra (praise) and Prastava (introductory) forms of singing. Sama requires precise pitch — wrong note invalidates the ritual."),
                lt("hi", "सोम यज्ञ प्रमुख अनुष्ठान — उद्गाता साम गाते हैं। ग्रामगेय और अरण्यगेय। स्तोत्र और प्रस्ताव रूप। सही स्वर अनिवार्य — गलत स्वर से अनुष्ठान अमान्य।")
        ));
        v.setFamousHymns(List.of(
                lt("en", "Pavamana Soma hymns|Rudra Samans|Indra Stotras|Agnichayana melodies|Mahavrata Samans|Udgitha (Om) chants from Chandogya Upanishad tradition"),
                lt("hi", "पवमान सोम|रुद्र साम|इन्द्र स्तोत्र|अग्निचयन स्वर|महाव्रत साम|उद्गीथ (ॐ) — छांदोग्य परंपरा")
        ));
        v.setLearningGuides(List.of(
                lt("en", "Step 1: Master the Rigvedic source verses (many Samans derive from Rigveda). Step 2: Learn the seven Svaras and their Vedic names. Step 3: Study under a qualified Udgatri or Gandharva teacher. Step 4: Practice Stotra and Prastava forms separately. Step 5: Understand the five-fold Sama structure: Prastava, Udgitha, Pratihara, Upadrava, Nidhana. Step 6: Connect to Chandogya Upanishad chapters on Udgitha meditation."),
                lt("hi", "चरण 1: ऋग्वैदिक मूल ऋचाएँ सीखें। चरण 2: सात स्वर और वैदिक नाम। चरण 3: उद्गाता/गंधर्व गुरु से शिक्षा। चरण 4: स्तोत्र और प्रस्ताव अलग अभ्यास। चरण 5: पांच भाग — प्रस्ताव, उद्गीथ, प्रतिहार, उपद्रव, निधन। चरण 6: छांदोग्य उपनिषद् उद्गीथ ध्यान।")
        ));
        v.setCoreConcepts(List.of(
                lt("en", "Saman (Melody)|Svara (Musical Note)|Nada (Cosmic Sound)|Udgatri (Chanting Priest)|Stotra (Praise Song)|Udgitha (Sacred Om)|Gandharva (Celestial Music)|Prastava (Introduction)|Gramageya (Village Chant)"),
                lt("hi", "साम|स्वर|नाद|उद्गाता|स्तोत्र|उद्गीथ|गंधर्व|प्रस्ताव|ग्रामगेय")
        ));
        v.setModernRelevance(List.of(
                lt("en", "Indian classical music (Carnatic and Hindustani) traces Svaras to Samaveda. The concept of Nada Brahman (universe as sound) influences modern sound healing and mantra meditation apps. Samavedic chanting preserves the oldest continuous musical tradition on Earth."),
                lt("hi", "भारतीय शास्त्रीय संगीत के स्वर सामवेद से। नाद ब्रह्म की अवधारणा ध्वनि चिकित्सा और मंत्र ध्यान को प्रभावित करती है। सामवेदिक पाठ पृथ्वी की प्राचीनतम संगीत परंपरा।")
        ));
        v.setRelatedTexts(List.of(
                lt("en", "Pancavimsha Brahmana, Tandya Mahabrahmana (Samavedic Brahmanas). Chandogya Upanishad (Udgitha philosophy). Arsheya Brahmana (index of Samans). Latyayana Shrauta Sutra (ritual procedures)."),
                lt("hi", "पंचविंश ब्राह्मण, तांड्य महाब्राह्मण। छांदोग्य उपनिषद्। आर्षेय ब्राह्मण। लाट्यायन श्रौत सूत्र।")
        ));
        v.setPronunciationGuides(List.of(
                lt("en", "Samans use elongated vowels and specific pitch patterns (Vamsha). Each Svara has a prescribed frequency relationship. Practice with tampura drone. Traditional teachers use hand gestures (mudras) to indicate pitch changes during oral transmission."),
                lt("hi", "साम में दीर्घ स्वर और विशिष्ट स्वर पैटर्न (वंश)। प्रत्येक स्वर की निर्धारित आवृत्ति। तानपूरे से अभ्यास। गुरु मुद्राओं से स्वर संकेत।")
        ));
    }

    private static void applyYajurveda(Veda v) {
        v.setPhilosophies(List.of(
                lt("en", "Yajurveda embodies Karma — action as spiritual path. The ritual is a microcosm of cosmic creation; each offering (Ahuti) restores Rita. The Shukla/Krishna distinction reflects the tension between pure knowledge (White) and integrated ritual-knowledge (Black). Yajna as 'giving to receive' teaches selfless action (Nishkama Karma)."),
                lt("hi", "यजुर्वेद कर्म मार्ग का प्रतिनिधित्व करता है। अनुष्ठान सृष्टि का सूक्ष्म रूप; प्रत्येक आहुति ऋत की पुनर्स्थापना। शुक्ल-कृष्ण भेद ज्ञान और कर्म का संतुलन। यज्ञ 'देने से पाने' की शिक्षा — निष्काम कर्म।")
        ));
        v.setRitualsAndPractices(List.of(
                lt("en", "Agnihotra (daily fire offering at sunrise/sunset), Darshapurnamasa (new/full moon sacrifices), Chaturmasya (seasonal rites), Ashvamedha, Rajasuya, Vajapeya. Adhvaryu priest recites Yajus while performing precise physical actions. Fire altar (Vedi) construction follows sacred geometry. Shatarudriya recitation in Shiva temples daily."),
                lt("hi", "अग्निहोत्र, दर्शपूर्णमास, चातुर्मास्य, अश्वमेध, राजसूय, वाजपेय। अध्वर्यु यजु:pढ़ते हुए कर्म करते हैं। वेदी निर्माण पवित्र ज्यामिति। शतरुद्री दैनिक शिव मंदिरों में।")
        ));
        v.setFamousHymns(List.of(
                lt("en", "Shatarudriya (Sri Rudram) — to Lord Shiva|Shivasankalpa Sukta — peace of mind|Shanti Mantras (Peace invocations)|Agniyadhana formulas|Prashna hymns|Ishtikadhana (brick altar) mantras"),
                lt("hi", "शतरुद्री (श्री रुद्रम्)|शिवसंकल्प सूक्त|शांति मंत्र|अग्न्याधान|प्रश्न सूक्त|इष्टिकाधान")
        ));
        v.setLearningGuides(List.of(
                lt("en", "Step 1: Choose a recension — Shukla (Vajasaneyi) for clear separation of mantra and prose, or Krishna (Taittiriya) for integrated study. Step 2: Learn basic yajna procedures from Shrauta Sutras. Step 3: Master Shatarudriya with correct pitch and rhythm. Step 4: Study the connection between Yajus and physical ritual action. Step 5: Understand the four Vedas' priest roles: Hotri (Rig), Udgatri (Sama), Adhvaryu (Yajur), Brahma (Atharva). Step 6: Practice Agnihotra with a qualified Acharya."),
                lt("hi", "चरण 1: शाखा चुनें — शुक्ल या कृष्ण। चरण 2: श्रौत सूत्र से यज्ञ विधि। चरण 3: शतरुद्री सही स्वर से। चरण 4: यजु: और कर्म का संबंध। चरण 5: चारों वेदों के पुजारी पद। चरण 6: आचार्य से अग्निहोत्र अभ्यास।")
        ));
        v.setCoreConcepts(List.of(
                lt("en", "Yajus (Sacrificial Formula)|Ahuti (Offering)|Vedi (Altar)|Adhvaryu (Ritual Priest)|Kalpa (Ritual Science)|Shrauta (Grand Sacrifice)|Smarta (Householder Rite)|Shukla/Krishna (White/Black)|Nishkama Karma (Selfless Action)"),
                lt("hi", "यजु:|आहुति|वेदी|अध्वर्यु|कल्प|श्रौत|स्मार्त|शुक्ल/कृष्ण|निष्काम कर्म")
        ));
        v.setModernRelevance(List.of(
                lt("en", "Shri Rudram is chanted in Shiva temples globally every day. Agnihotra is practiced worldwide for environmental and spiritual benefits. Yajurvedic concepts of sacred action influence modern Karma Yoga (Bhagavad Gita). Ayurvedic daily routines (Dinacharya) derive from Yajurvedic fire rituals."),
                lt("hi", "श्री रुद्रम् विश्व भर के शिव मंदिरों में। अग्निहोत्र पर्यावरण और आध्यात्मिक लाभ हेतु। कर्म योग की जड़ें। आयुर्वेदिक दिनचर्या यजुर्वैदिक अग्नि अनुष्ठान से।")
        ));
        v.setRelatedTexts(List.of(
                lt("en", "Shatapatha Brahmana (largest Brahmana text). Taittiriya, Kathaka, Maitrayani Samhitas. Apastamba, Baudhayana Shrauta Sutras. Taittiriya Upanishad (from Krishna Yajurveda). Brihadaranyaka Upanishad (Shukla Yajurveda)."),
                lt("hi", "शतपथ ब्राह्मण। तैत्तिरीय, काठक, मैत्रायणी संहिता। आपस्तंब, बौद्धायन श्रौत सूत्र। तैत्तिरीय उपनिषद्। बृहदारण्यक उपनिषद्।")
        ));
        v.setPronunciationGuides(List.of(
                lt("en", "Yajus mixes prose (Gadyam) and verse (Padyam) — maintain distinct rhythm for each. Shatarudriya requires specific intonation patterns (Svara markings). Visarga (:) at word endings is pronounced as soft echo. Practice with a recorded traditional patha before attempting Shrauta recitation."),
                lt("hi", "यजु: में गद्य और पद्य — अलग लय। शतरुद्री विशिष्ट स्वर चिह्न। विसर्ग को मृदु प्रतिध्वनि से। पारंपरिक पाठ से अभ्यास।")
        ));
    }

    private static void applyAtharvaveda(Veda v) {
        v.setPhilosophies(List.of(
                lt("en", "Atharvaveda bridges visible and invisible worlds — healing, protection, and philosophical inquiry coexist. The Prithvi Sukta reveres Earth as mother. Philosophical hymns question the nature of Brahman and Atman centuries before the Upanishads. It validates folk wisdom alongside priestly orthodoxy — knowledge belongs to all, not just elites."),
                lt("hi", "अथर्ववेद दृश्य और अदृश्य जगत को जोड़ता है — चिकित्सा, रक्षा, दर्शन एक साथ। पृथ्वी सूक्त पृथ्वी को माता मानता है। दार्शनिक सूक्त ब्रह्म और आत्मा पर प्रश्न। लोक ज्ञान और पुरोहित दोनों मान्य।")
        ));
        v.setRitualsAndPractices(List.of(
                lt("en", "Healing rituals (Bhaishajya), marriage ceremonies (Vivaha), funeral rites (Antyeshti), royal consecration (Rajasuya), house consecration (Grihapravesha), protection against disease and evil (Abhichara counter-rituals). Oshanam (herbal preparations) combined with mantras. Daily household rites for common people."),
                lt("hi", "भैषज्य चिकित्सा, विवाह, अंत्येष्टि, राजसूय, गृहप्रवेश, रक्षा अनुष्ठान। ओषध और मंत्र का संयोग। सामान्य लोगों के गृह्य कर्म।")
        ));
        v.setFamousHymns(List.of(
                lt("en", "Prithvi Sukta (Hymn to Earth)|Mystic charm against disease (1.16)|Marriage hymn (14.2)|Funeral hymn (18.1)|Royal consecration (15.18)|Philosophical dialogue on Brahman|Ayurvedic healing mantras"),
                lt("hi", "पृथ्वी सूक्त|रोग निवारण मंत्र (1.16)|विवाह सूक्त (14.2)|अंतिम संस्कार (18.1)|राजाभिषेक (15.18)|ब्रह्म पर संवाद|आयुर्वेदिक मंत्र")
        ));
        v.setLearningGuides(List.of(
                lt("en", "Step 1: Study the Shaunakiya recension (most accessible). Step 2: Begin with Book 1 healing hymns — practical and relatable. Step 3: Read Prithvi Sukta for environmental philosophy. Step 4: Explore marriage and funeral hymns for understanding Samskaras. Step 5: Connect to Mundaka and Prashna Upanishads (Atharvavedic tradition). Step 6: Study Ayurvedic herb references in Book 6. Step 7: Compare folk healing traditions with Vedic mantras."),
                lt("hi", "चरण 1: शौनकीय संहिता। चरण 2: कांड 1 चिकित्सा सूक्त। चरण 3: पृथ्वी सूक्त। चरण 4: विवाह-अंत्येष्टि सूक्त — संस्कार समझ। चरण 5: मुण्डक, प्रश्न उपनिषद्। चरण 6: कांड 6 औषधि संदर्भ। चरण 7: लोक चिकित्सा से तुलना।")
        ));
        v.setCoreConcepts(List.of(
                lt("en", "Bhaishajya (Healing)|Abhichara (Protection)|Samskara (Life Rites)|Prithvi (Earth Mother)|Brahman (Ultimate Reality)|Atman (Self)|Oshadhi (Sacred Herb)|Grihya (Household Rite)|Moksha (Liberation)|Lokayata (Worldly Wisdom)"),
                lt("hi", "भैषज्य|अभिचार|संस्कार|पृथ्वी|ब्रह्म|आत्मा|औषधि|गृह्य|मोक्ष|लोकायत")
        ));
        v.setModernRelevance(List.of(
                lt("en", "Ayurveda — India's traditional medicine — draws heavily from Atharvaveda. Prithvi Sukta inspires modern environmental movements. Marriage and funeral hymns are still used in Hindu ceremonies. Protection mantras are widely used in daily spiritual practice. The Mundaka Upanishad's 'two kinds of knowledge' (Para and Apara) remains relevant to modern education philosophy."),
                lt("hi", "आयुर्वेद अथर्ववेद से गहराई से जुड़ा। पृथ्वी सूक्त पर्यावरण आंदोलनों को प्रेरित करता है। विवाह-अंत्येष्टि मंत्र आज भी प्रयुक्त। रक्षा मंत्र दैनिक साधना में। मुण्डक उपनिषद् का 'दो ज्ञान' — आधुनिक शिक्षा दर्शन।")
        ));
        v.setRelatedTexts(List.of(
                lt("en", "Gopatha Brahmana (Atharvavedic Brahmana). Mundaka, Prashna, Mandukya Upanishads. Charaka Samhita (Ayurveda). Kashyapa Samhita (pediatrics). Atharvavedic Parisistas (supplementary texts)."),
                lt("hi", "गोपथ ब्राह्मण। मुण्डक, प्रश्न, माण्डूक्य उपनिषद्। चरक संहिता। काश्यप संहिता। अथर्ववैदिक परिशिष्ट।")
        ));
        v.setPronunciationGuides(List.of(
                lt("en", "Atharvaveda mantras often use repetitive syllables for rhythmic power (e.g., 'phat', 'hoom', 'vashat'). These Bija (seed) sounds must be pronounced with force and clarity. Healing mantras are chanted softly; protection mantras with strength. Learn the difference between Samhita patha and Padapatha for this Veda."),
                lt("hi", "अथर्ववैदिक मंत्रों में पुनरावृत्ति और बीज अक्षर ('फट', 'हूं', 'वषट')। बीज ध्वनि स्पष्ट और बलपूर्वक। चिकित्सा मंत्र मृदु; रक्षा मंत्र बलपूर्वक। संहिता और पदपाठ अंतर सीखें।")
        ));
    }

    private static LocalizedText lt(String code, String text) {
        return new LocalizedText(code, text);
    }
}
