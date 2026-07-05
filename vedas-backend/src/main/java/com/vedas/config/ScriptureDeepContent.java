package com.vedas.config;

import com.vedas.model.LocalizedText;
import com.vedas.model.Veda;

import java.util.List;

/** Deep knowledge for Itihasa, Upanishad, Purana and Darshan scriptures. */
public final class ScriptureDeepContent {

    private ScriptureDeepContent() {}

    public static void apply(Veda v) {
        switch (v.getSlug()) {
            case "gita" -> applyGita(v);
            case "ramayana" -> applyRamayana(v);
            case "mahabharata" -> applyMahabharata(v);
            case "ramcharitmanas" -> applyRamcharitmanas(v);
            case "upnishads" -> applyUpanishads(v);
            case "puranas" -> applyPuranas(v);
            case "yoga-sutra" -> applyYogaSutra(v);
            default -> { }
        }
    }

    private static void applyGita(Veda v) {
        v.setOverviews(lt(
                "The Bhagavad Gita is Krishna's counsel to Arjuna on the battlefield of Kurukshetra — 700 verses across 18 chapters covering dharma, karma, bhakti, jnana, and moksha.",
                "भगवद्गीता कुरुक्षेत्र में अर्जुन को श्रीकृष्ण का उपदेश है — 18 अध्याय, 700 श्लोक, धर्म, कर्म, भक्ति, ज्ञान और मोक्ष का सार।"));
        v.setSignificances(lt(
                "Called the essence of Upanishads (Gita Upanishad). Accepted by all major sampradayas. Daily reading (Gita Path) is a central Hindu practice.",
                "उपनिषदों का सार — 'गीता उपनिषद'। सभी सम्प्रदायों में मान्य। प्रतिदिन गीता पाठ एक केंद्रीय साधना है।"));
        v.setStructures(lt(
                "18 chapters (Yogas): Vishada, Sankhya, Karma, Jnana, Karma-Sanyasa, Dhyana, Jnana-Vijnana, Akshara, Raja, Vibhuti, Vishvarupa, Bhakti, Kshetra-Kshetrajna, Gunatraya, Purushottama, Daivasura, Shraddhatraya, Moksha.",
                "18 अध्याय (योग): विषाद, सांख्य, कर्म, ज्ञान, कर्मसंन्यास, ध्यान, ज्ञानविज्ञान, अक्षर, राज, विभूति, विश्वरूप, भक्ति, क्षेत्र-क्षेत्रज्ञ, गुणत्रय, पुरुषोत्तम, दैवासुर, श्रद्धात्रय, मोक्ष।"));
        v.setPhilosophies(lt(
                "Three paths: Karma Yoga (selfless action), Bhakti Yoga (loving devotion), Jnana Yoga (discrimination of Atman). Krishna reveals both Saguna and Nirguna Brahman.",
                "तीन मार्ग: कर्मयोग, भक्तियोग, ज्ञानयोग। कृष्ण सगुण और निर्गुण ब्रह्म दोनों का उपदेश देते हैं।"));
        v.setLearningGuides(lt(
                "Read one chapter daily for 18 days. Use Gita Press PDF with Hindi tika. Memorize 2.47, 4.7, 9.22, 18.66. Listen to chapter-wise pravachan. After reading, practice one teaching daily.",
                "18 दिन में 18 अध्याय — प्रतिदिन एक। गीता प्रेस PDF हिंदी टीका सहित पढ़ें। 2.47, 4.7, 9.22, 18.66 कंठस्थ करें। अध्यायवार प्रवचन सुनें।"));
        v.setCoreConcepts(lt(
                "Dharma|Karma|Bhakti|Jnana|Moksha|Atman|Brahman|Nishkama Karma|Surrender|Gunas",
                "धर्म|कर्म|भक्ति|ज्ञान|मोक्ष|आत्मा|ब्रह्म|निष्काम कर्म|शरणागति|गुण"));
        v.setModernRelevance(lt(
                "Gita guides leadership, stress management, ethical decision-making, and spiritual growth. Widely studied globally in universities and yoga communities.",
                "गीता नेतृत्व, तनाव प्रबंधन, नैतिक निर्णय और आध्यात्मिक विकास का मार्गदर्शन करती है। विश्वभर में अध्ययन।"));
    }

    private static void applyRamayana(Veda v) {
        v.setOverviews(lt(
                "Valmiki Ramayana — the Adi Kavya (first epic). Seven Kandas narrate Sri Rama's life: ideal king, son, husband, and dharma embodiment.",
                "वाल्मीकि रामायण — आदिकाव्य। सात काण्डों में श्री राम का जीवन — आदर्श राजा, पुत्र, पति और धर्म मूर्ति।"));
        v.setSignificances(lt(
                "Foundation of Rama Bhakti. Influenced Ramcharitmanas, art, dance (Ram Lila), and governance ideals in Indian culture.",
                "राम भक्ति की आधारशिला। रामचरितमानस, कला, रामलीला और शासन-नीति पर गहरा प्रभाव।"));
        v.setLearningGuides(lt(
                "Start with Bala Kanda. Read Gita Press Hindi PDF. One sarga daily. Compare with Ramcharitmanas dohas for devotional depth.",
                "बालकाण्ड से आरंभ। गीता प्रेस PDF पढ़ें। प्रतिदिन एक सर्ग। रामचरितमानस से तुलना करें।"));
        v.setCoreConcepts(lt(
                "Maryada Purushottam|Dharma|Ideal Rule|Bhakti|Family Duty|Victory of Good",
                "मर्यादा पुरुषोत्तम|धर्म|आदर्श शासन|भक्ति|पारिवारिक कर्तव्य|सद्‌जय"));
    }

    private static void applyMahabharata(Veda v) {
        v.setOverviews(lt(
                "Mahabharata by Vyasa — world's longest epic (~100,000 verses). Contains Bhagavad Gita, stories of Pandavas-Kauravas, and encyclopedic dharma-shastra.",
                "व्यास कृत महाभारत — विश्व का सबसे लंबा महाकाव्य। भगवद्गीता, पांडव-कौरव कथा और धर्मशास्त्र का भंडार।"));
        v.setSignificances(lt(
                "'What is not in Bharata is not in Bharata' — comprehensive guide to life, politics, ethics, and spirituality.",
                "'भारत में जो नहीं है वह कहीं नहीं' — जीवन, राजनीति, नीति और अध्यात्म का विश्वकोश।"));
        v.setLearningGuides(lt(
                "Begin with Adi Parva and Gita chapters. Use Gita Press 6-volume Hindi PDF. Read one chapter weekly for deep study.",
                "आदि पर्व और गीता से आरंभ। गीता प्रेस 6-खंड PDF। गहन अध्ययन हेतु साप्ताहिक एक अध्याय।"));
        v.setCoreConcepts(lt(
                "Dharma|Karma|Just War|Family|Destiny|Vyasa's Vision",
                "धर्म|कर्म|धर्मयुद्ध|कुटुंब|प्रारब्ध|व्यास का दर्शन"));
    }

    private static void applyRamcharitmanas(Veda v) {
        v.setOverviews(lt(
                "Tulsidas's Ramcharitmanas — Awadhi retelling of Ramayana in seven Kandas. Most recited Hindu text in North India after Gita.",
                "तुलसीदास कृत रामचरितमानस — अवधी में सात काण्ड। उत्तर भारत में गीता के बाद सबसे अधिक पठित ग्रंथ।"));
        v.setSignificances(lt(
                "Hanuman Chalisa and many bhajans originate from this tradition. Daily Manas Path in millions of homes.",
                "हनुमान चालीसा और अनेक भजन इसी परंपरा से। लाखों घरों में दैनिक मानस पाठ।"));
        v.setLearningGuides(lt(
                "Read one doha/chopai with meaning daily. Full Gita Press PDF for complete text. Start with Bal Kand.",
                "प्रतिदिन एक दोहा/चौपाई अर्थ सहित। पूर्ण PDF — गीता प्रेस। बालकाण्ड से आरंभ।"));
        v.setCoreConcepts(lt(
                "Bhakti|Ram Nam|Hanuman Devotion|Simple Dharma|Awadhi Poetry",
                "भक्ति|राम नाम|हनुमान भक्ति|सरल धर्म|अवधी काव्य"));
    }

    private static void applyUpanishads(Veda v) {
        v.setOverviews(lt(
                "Upanishads — Vedanta's foundation. Explore Atman, Brahman, meditation, and moksha. Major ones: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka.",
                "उपनिषद — वेदांत की आधारशिला। आत्मा, ब्रह्म, ध्यान, मोक्ष। प्रमुख: ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छांदोग्य, बृहदारण्यक।"));
        v.setSignificances(lt(
                "Source of mahavakyas: Tat Tvam Asi, Aham Brahmasmi, Ayam Atma Brahma, Prajnanam Brahma.",
                "महावाक्यों का स्रोत: तत् त्वं असि, अहं ब्रह्मास्मि, अयम् आत्मा ब्रह्म, प्रज्ञानं ब्रह्म।"));
        v.setLearningGuides(lt(
                "Start with Isha and Katha Upanishad PDFs from Gita Press. One verse daily with Shankara bhashya if available.",
                "ईश और कठ उपनिषद PDF से आरंभ। प्रतिदिन एक मंत्र — शंकर भाष्य सहित।"));
        v.setCoreConcepts(lt(
                "Atman|Brahman|Moksha|Maya|Neti Neti|Mahavakyas",
                "आत्मा|ब्रह्म|मोक्ष|माया|नेति नेति|महावाक्य"));
    }

    private static void applyPuranas(Veda v) {
        v.setOverviews(lt(
                "18 Mahapuranas — Vishnu, Shiva, Bhagavata, Devi, Agni and more. Stories of gods, creation, dharma, and devotion for all levels.",
                "18 महापुराण — विष्णु, शिव, भागवत, देवी, अग्नि आदि। सृष्टि, धर्म, भक्ति की कथाएँ — सभी के लिए।"));
        v.setSignificances(lt(
                "Bhagavata Purana is crown jewel for Krishna Bhakti. Puranas make complex philosophy accessible through narrative.",
                "भागवत पुराण कृष्ण भक्ति का रत्न। पुराण कथा द्वारा दर्शन को सरल बनाते हैं।"));
        v.setLearningGuides(lt(
                "Begin with Bhagavata Skandha 1 or Vishnu Purana. Read Gita Press Bhagavata PDF. One story per week with moral reflection.",
                "भागवत प्रथम स्कंध या विष्णु पुराण से। गीता प्रेस भागवत PDF। साप्ताहिक एक कथा — नैतिक चिंतन सहित।"));
        v.setCoreConcepts(lt(
                "Bhakti|Cosmology|Avatara|Dharma Stories|Devotion",
                "भक्ति|सृष्टि|अवतार|धर्म कथा|समर्पण"));
    }

    private static void applyYogaSutra(Veda v) {
        v.setOverviews(lt(
                "Patanjali's Yoga Sutras — 196 aphorisms in four Padas: Samadhi, Sadhana, Vibhuti, Kaivalya. Foundation of Ashtanga Yoga.",
                "पतंजलि योगसूत्र — चार पाद, 196 सूत्र। समाधि, साधना, विभूति, कैवल्य। अष्टांग योग की नींव।"));
        v.setSignificances(lt(
                "Defines Yoga as 'Chitta Vritti Nirodha'. Eight limbs from Yama-Niyama to Samadhi guide systematic spiritual practice.",
                "योग = चित्तवृत्ति निरोध। यम-नियम से समाधि तक अष्टांग — व्यवस्थित साधना।"));
        v.setLearningGuides(lt(
                "Study one sutra daily with Hindi commentary PDF. Practice Yama/Niyama alongside asana-pranayama.",
                "प्रतिदिन एक सूत्र — हिंदी टीका PDF सहित। यम-नियम का अभ्यास असन-प्राणायाम के साथ।"));
        v.setCoreConcepts(lt(
                "Ashtanga|Samadhi|Chitta|Vritti|Kaivalya|Dhyana",
                "अष्टांग|समाधि|चित्त|वृत्ति|कैवल्य|ध्यान"));
    }

    private static List<LocalizedText> lt(String en, String hi) {
        return List.of(new LocalizedText("en", en), new LocalizedText("hi", hi));
    }
}
