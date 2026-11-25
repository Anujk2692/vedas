package com.vedas.service;

import com.vedas.dto.ChildNameRequestDto;
import com.vedas.dto.ChildNameResponseDto;
import com.vedas.dto.ChildNameSuggestionDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Generates detailed child name suggestions combining Father & Mother
 * syllables/initials with optional Deity synonyms, Nakshatra/Rashi,
 * numerology, pronunciation, and multi-language meanings.
 */
@Service
public class ChildNameService {

    private record DeityEntry(
            String deityKey,
            String name,
            String scriptText,
            String pronunciation,
            String gender,
            String meaningEn,
            String meaningHi,
            String meaningSa,
            String significanceEn,
            String significanceHi,
            List<String> synonyms) {}

    private record ReligionEntry(
            String religion,
            String name,
            String scriptText,
            String pronunciation,
            String gender,
            String meaningEn,
            String meaningHi,
            String origin,
            List<String> synonyms) {}

    private static final List<DeityEntry> DEITY_NAMES = List.of(
            // Shiva
            new DeityEntry("shiva", "Aarav", "आरव", "AA-rav", "BOY",
                    "Peaceful, wise, calm like Lord Shiva",
                    "शांत, ज्ञानी और भगवान शिव के समान सौम्य",
                    "शान्तः, शिवतुल्यः",
                    "Represents deep inner stillness and melodic wisdom rooted in Shiva's meditative silence.",
                    "भगवान शिव के शांत और ध्यानमग्न स्वरूप का प्रतीक।",
                    List.of("Shiva", "Rudra", "Shant", "Prashant")),
            new DeityEntry("shiva", "Rudra", "रुद्र", "RU-dra", "BOY",
                    "Fierce transformer, remover of sorrow",
                    "दुखों का नाश करने वाले, शिव का रूप",
                    "रुद्रः, दुःखहरः",
                    "Vedic name of Shiva celebrating courage that dissolves ignorance and negativity.",
                    "ऋग्वेद में वर्णित शिव का तेजस्वी और कल्याणकारी रूप।",
                    List.of("Shiva", "Mahadev", "Shankar", "Bhairav")),
            new DeityEntry("shiva", "Shivansh", "शिवांश", "shi-VAAN-sh", "BOY",
                    "Sacred part of Lord Shiva",
                    "भगवान शिव का पावन अंश",
                    "शिवस्य अंशः",
                    "Signifies carrying Shiva's auspicious grace, strength, and detachment.",
                    "शिव की कृपा, शक्ति और वैराग्य के गुणों का प्रतीक।",
                    List.of("Shiva", "Ishaan", "Mahesh", "Shambhu")),
            new DeityEntry("shiva", "Ishaan", "ईशान", "ee-SHAAN", "BOY",
                    "Ruler, Lord Shiva, auspicious northeast direction",
                    "ईश्वर, भगवान शिव, शुभ ईशान दिशा",
                    "ईशानः, सर्वेश्वरः",
                    "One of the Panchavaktra aspects of Shiva symbolizing knowledge and prosperity.",
                    "शिव के पांच मुखों में से ज्ञान और ऐश्वर्य का प्रतीक रूप।",
                    List.of("Shiva", "Prabhu", "Mahadev", "Omkar")),
            new DeityEntry("shiva", "Shivanya", "शिवाण्या", "shi-VAAN-ya", "GIRL",
                    "Devoted to Shiva, auspicious grace",
                    "शिव की कृपा, शुभ और सौम्य",
                    "शिवान्या, शुभदा",
                    "Reflects harmony of Shiva and Shakti—calm strength paired with grace.",
                    "शिव और शक्ति के सामंजस्य तथा मंगलमयी कृपा का प्रतीक।",
                    List.of("Shiva", "Parvati", "Gauri", "Uma")),
            new DeityEntry("shiva", "Mridula", "मृदुला", "mri-DU-la", "GIRL",
                    "Gentle, soft, graced by Shiva-Parvati",
                    "कोमल, सौम्य और शांत स्वभाव",
                    "मृदुला, कोमला",
                    "Celebrates gentle compassion and serene inner strength.",
                    "कोमल करुणा और शांत आत्मिक बल का प्रतीक।",
                    List.of("Parvati", "Shiva", "Saumya", "Aparna")),

            // Krishna / Vishnu
            new DeityEntry("krishna", "Achyut", "अच्युत", "ACH-yut", "BOY",
                    "Imperishable, infallible, Lord Krishna",
                    "अविनाशी, अडिग, श्रीकृष्ण का नाम",
                    "अच्युतः, अविनाशी",
                    "Used by Arjuna in the Bhagavad Gita for Krishna—one who never falls from truth.",
                    "भगवद्गीता में अर्जुन द्वारा श्रीकृष्ण के लिए प्रयुक्त पावन नाम।",
                    List.of("Krishna", "Vishnu", "Madhav", "Govind")),
            new DeityEntry("krishna", "Vihaan", "विहान", "vi-HAAN", "BOY",
                    "Dawn, new beginning, Krishna's radiant aura",
                    "प्रभात, नई शुरुआत, कृष्ण की आभा",
                    "विहानः, प्रभातः",
                    "Symbolizes fresh clarity, optimism, and the first light of morning.",
                    "नव प्रभात, आशा और सकारात्मक ऊर्जा का प्रतीक।",
                    List.of("Krishna", "Arun", "Prakash", "Surya")),
            new DeityEntry("krishna", "Madhav", "माधव", "MAA-dhav", "BOY",
                    "Sweet like spring, Lord Krishna",
                    "वसंत के समान मधुर, श्रीकृष्ण",
                    "माधवः, मधुरः",
                    "Means 'belonging to Maa (Lakshmi)' and evokes Krishna's joyful wisdom.",
                    "माँ लक्ष्मी के स्वामी और आनंदमय श्रीकृष्ण का मधुर नाम।",
                    List.of("Krishna", "Govind", "Keshav", "Murari")),
            new DeityEntry("krishna", "Radhika", "राधिका", "RAA-dhi-ka", "GIRL",
                    "Successful, prosperous, beloved of Krishna",
                    "सफल, समृद्ध, श्रीकृष्ण की प्रिय",
                    "राधिका, समृद्धा",
                    "Symbolizes pure devotion, grace, and spiritual fulfillment.",
                    "निस्वार्थ प्रेम, भक्ति और दिव्य सौंदर्य का प्रतीक।",
                    List.of("Radha", "Krishna", "Lakshmi", "Rukmini")),
            new DeityEntry("krishna", "Vrinda", "वृन्दा", "VRIN-da", "GIRL",
                    "Sacred basil (Tulsi), virtue and devotion",
                    "पवित्र तुलसी, सद्गुणों से युक्त",
                    "वृन्दा, पवित्रा",
                    "Sacred to Vishnu and Krishna, representing purity and healing presence.",
                    "विष्णु-कृष्ण की प्रिय पवित्र तुलसी और शुद्ध आचरण का प्रतीक।",
                    List.of("Tulsi", "Radha", "Devi", "Vaishnavi")),

            // Rama
            new DeityEntry("rama", "Raghav", "राघव", "RAA-ghav", "BOY",
                    "Descendant of Raghu, noble like Lord Rama",
                    "रघुवंशी, मर्यादा पुरुषोत्तम श्रीराम",
                    "राघवः, श्रेष्ठः",
                    "Honors Lord Rama's steadfast dharma, humility, and integrity.",
                    "श्रीराम के आदर्श चरित्र, मर्यादा और सत्यनिष्ठा का प्रतीक।",
                    List.of("Rama", "Ramachandra", "Raghavendra", "Dasharathi")),
            new DeityEntry("rama", "Aryan", "आर्यन", "AAR-yan", "BOY",
                    "Noble, honorable, upright",
                    "श्रेष्ठ, मर्यादित और सज्जन",
                    "आर्यः, श्रेष्ठः",
                    "Rooted in Sanskrit 'Arya' meaning noble-hearted and principled.",
                    "संस्कृत शब्द 'आर्य' से प्रेरित, जिसका अर्थ श्रेष्ठ और धर्मपरायण है।",
                    List.of("Rama", "Sreshtha", "Dharmik", "Uttam")),
            new DeityEntry("rama", "Siya", "सिया", "SI-ya", "GIRL",
                    "Goddess Sita, pure and resilient",
                    "माता सीता, पवित्र और धैर्यवान",
                    "सीता, जानकी",
                    "Celebrates Mata Sita's quiet courage, dignity, and grace.",
                    "माता सीता के धैर्य, पवित्रता और अडिग संकल्प का प्रतीक।",
                    List.of("Sita", "Janaki", "Vaidehi", "Maithili")),
            new DeityEntry("rama", "Janaki", "जानकी", "JAA-na-ki", "GIRL",
                    "Daughter of King Janak, Goddess Sita",
                    "जनक नंदिनी, माता सीता",
                    "जानकी, मैथिली",
                    "Connects to Mithila's philosophical heritage and Sita's wisdom.",
                    "मिथिला के ज्ञान और माता सीता की मर्यादा से जुड़ा नाम।",
                    List.of("Sita", "Siya", "Maithili", "Rama")),

            // Ganesha
            new DeityEntry("ganesha", "Reyansh", "रेयांश", "rey-AAN-sh", "BOY",
                    "First ray of light, auspicious beginning",
                    "सूर्य की पहली किरण, शुभ अंश",
                    "रश्मिः, शुभप्रदः",
                    "Evokes auspicious beginnings blessed by Ganesha and Surya.",
                    "शुभ आरंभ और सूर्य-गणेश के तेज का प्रतीक।",
                    List.of("Ganesha", "Aditya", "Pratham", "Ojas")),
            new DeityEntry("ganesha", "Vighnesh", "विघ्नेश", "vigh-NESH", "BOY",
                    "Remover of obstacles, Lord Ganesha",
                    "विघ्नों को हरने वाले, श्रीगणेश",
                    "विघ्नेशः, गणनायकः",
                    "Invokes Ganesha's wisdom to clear hurdles on life's path.",
                    "जीवन की बाधाओं को दूर करने वाले श्रीगणेश का पावन नाम।",
                    List.of("Ganesha", "Ganapati", "Vinayak", "Lambodar")),
            new DeityEntry("ganesha", "Atharva", "अथर्व", "a-THAR-va", "BOY",
                    "Fourth Veda, Lord Ganesha, wise",
                    "अथर्ववेद, ज्ञानी और श्रीगणेश",
                    "अथर्वः, ज्ञानवान्",
                    "Name of both the fourth Veda and Lord Ganesha, symbolizing intellect and peace.",
                    "चतुर्थ वेद और श्रीगणेश दोनों का प्रतीक—बुद्धि और शांति का संगम।",
                    List.of("Ganesha", "Veda", "Pragya", "Ganapati")),
            new DeityEntry("ganesha", "Riddhi", "ऋद्धि", "RID-dhi", "GIRL",
                    "Prosperity, wisdom, consort of Ganesha",
                    "समृद्धि, बुद्धि और सफलता",
                    "ऋद्धिः, समृद्धिः",
                    "Represents abundance of both material well-being and inner wisdom.",
                    "भौतिक और आध्यात्मिक दोनों समृद्धि का प्रतीक।",
                    List.of("Ganesha", "Siddhi", "Lakshmi", "Shree")),
            new DeityEntry("ganesha", "Siddhi", "सिद्धि", "SID-dhi", "GIRL",
                    "Accomplishment, spiritual attainment",
                    "सिद्धि, पूर्णता और सफलता",
                    "सिद्धिः, सफलता",
                    "Symbolizes focused mastery and fulfillment in every endeavor.",
                    "साधना, एकाग्रता और कार्य-सिद्धि का प्रतीक।",
                    List.of("Ganesha", "Riddhi", "Shakti", "Kriti")),

            // Devi / Durga / Lakshmi / Saraswati
            new DeityEntry("durga", "Aadhya", "आध्या", "AA-dhya", "GIRL",
                    "First power, primordial Goddess Durga",
                    "आदि शक्ति, माँ दुर्गा",
                    "आद्या, आदिशक्तिः",
                    "Means 'the first'—honoring Maa Durga as the origin of all strength.",
                    "आदि शक्ति माँ दुर्गा का पावन नाम।",
                    List.of("Durga", "Shakti", "Bhavani", "Ambika")),
            new DeityEntry("durga", "Ananya", "अनन्या", "a-NAN-ya", "GIRL",
                    "Matchless, unique, Goddess Parvati",
                    "अद्वितीय, अनुपम, माँ पार्वती",
                    "अनन्या, अद्वितीया",
                    "Signifies undivided devotion and unique grace.",
                    "अद्वितीय सौंदर्य और अनन्य भक्ति का प्रतीक।",
                    List.of("Durga", "Parvati", "Uma", "Gauri")),
            new DeityEntry("durga", "Shaurya", "शौर्य", "SHAU-rya", "BOY",
                    "Bravery, valor blessed by Maa Durga",
                    "शौर्य, वीरता और साहस",
                    "शौर्यः, पराक्रमः",
                    "Celebrates fearless dharma and protective courage.",
                    "निर्भय साहस और धर्म की रक्षा का प्रतीक।",
                    List.of("Durga", "Veer", "Kartikeya", "Vikram")),
            new DeityEntry("lakshmi", "Shriya", "श्रिया", "SHRI-ya", "GIRL",
                    "Prosperity, radiance, Goddess Lakshmi",
                    "श्री, समृद्धि और माँ लक्ष्मी",
                    "श्रिया, लक्ष्मीः",
                    "Evokes auspicious beauty, generosity, and abundance.",
                    "माँ लक्ष्मी की कृपा, शुभता और समृद्धि का प्रतीक।",
                    List.of("Lakshmi", "Padma", "Kamala", "Vaishnavi")),
            new DeityEntry("saraswati", "Vanya", "वान्या", "VAAN-ya", "GIRL",
                    "Gracious gift of God, Saraswati's eloquence",
                    "ईश्वर का वरदान, वाणी की देवी",
                    "वान्या, सरस्वती",
                    "Connects to 'Vani' (sacred speech) and gentle wisdom.",
                    "माँ सरस्वती की वाणी और मधुर ज्ञान का प्रतीक।",
                    List.of("Saraswati", "Vani", "Vidya", "Bharati")),
            new DeityEntry("saraswati", "Pragya", "प्रज्ञा", "PRAG-ya", "GIRL",
                    "Highest wisdom and discernment",
                    "प्रज्ञा, उच्चतम बुद्धि और विवेक",
                    "प्रज्ञा, विवेकः",
                    "Upanishadic term for awakened insight that sees truth clearly.",
                    "उपनिषदों में वर्णित जाग्रत विवेक और सत्य-दृष्टि का प्रतीक।",
                    List.of("Saraswati", "Buddhi", "Medha", "Jnana")),
            new DeityEntry("saraswati", "Vedant", "वेदांत", "ve-DAANT", "BOY",
                    "Essence of the Vedas, ultimate knowledge",
                    "वेदांत, ज्ञान की पराकाष्ठा",
                    "वेदान्तः, ब्रह्मज्ञानम्",
                    "Honors the philosophical crown of Sanatan Dharma—the Upanishads.",
                    "वेदों के सार और उपनिषद ज्ञान का प्रतीक।",
                    List.of("Saraswati", "Veda", "Jnana", "Bodh")),

            // Hanuman
            new DeityEntry("hanuman", "Tejas", "तेजस", "TE-jas", "BOY",
                    "Radiant energy, sharp intellect",
                    "तेजस्विता, ऊर्जा और बुद्धि",
                    "तेजः, ऊर्जा",
                    "Reflects Hanuman's fearless vitality and luminous focus.",
                    "हनुमानजी की असीम ऊर्जा और तीक्ष्ण बुद्धि का प्रतीक।",
                    List.of("Hanuman", "Surya", "Agni", "Pratap")),
            new DeityEntry("hanuman", "Mahavir", "महावीर", "ma-HAA-veer", "BOY",
                    "Great hero, courageous like Hanuman",
                    "महावीर, असीम साहसी",
                    "महावीरः, बलवान्",
                    "Celebrates selfless strength combined with humility.",
                    "निस्वार्थ सेवा, बल और विनय का प्रतीक।",
                    List.of("Hanuman", "Bajrang", "Veer", "Kesari")),
            new DeityEntry("hanuman", "Anjani", "अंजनी", "AN-ja-ni", "GIRL",
                    "Grace of Mother Anjani, devoted strength",
                    "माता अंजनी की कृपा, शक्ति",
                    "अञ्जनी, शक्तिः",
                    "Honors Hanuman's mother Anjani—symbol of maternal blessing and resilience.",
                    "हनुमानजी की माता अंजनी के स्नेह और शक्ति का प्रतीक।",
                    List.of("Hanuman", "Shakti", "Bhakti", "Devi"))
    );

    private static final List<ReligionEntry> MULTI_RELIGION_NAMES = List.of(
            new ReligionEntry("Sikhism", "Gurleen", "गुरलीन", "gur-LEEN", "GIRL",
                    "Absorbed in the Guru's wisdom", "गुरु के ज्ञान में लीन", "Punjabi / Sikh", List.of("Gurbani", "Simran", "Noor")),
            new ReligionEntry("Sikhism", "Angad", "अंगद", "AN-gad", "BOY",
                    "Part of oneself, second Sikh Guru", "आत्म-अंश, गुरु अंगद देव", "Punjabi / Sikh", List.of("Guru", "Nanak", "Seva")),
            new ReligionEntry("Jainism", "Arihant", "अरिहंत", "a-ri-HANT", "BOY",
                    "Conqueror of inner enemies", "अंतर-शत्रुओं को जीतने वाला", "Prakrit / Jain", List.of("Mahavir", "Ahimsa", "Jina")),
            new ReligionEntry("Jainism", "Jinaya", "जिनया", "ji-NAA-ya", "GIRL",
                    "Born of spiritual victory", "आध्यात्मिक विजय से उत्पन्न", "Prakrit / Jain", List.of("Jina", "Ahimsa", "Shanti")),
            new ReligionEntry("Buddhism", "Bodhi", "बोधि", "BO-dhi", "UNISEX",
                    "Awakening, supreme enlightenment", "बोधि, परम ज्ञान और जागरण", "Pali / Buddhist", List.of("Buddha", "Prajna", "Karuna")),
            new ReligionEntry("Buddhism", "Tara", "तारा", "TAA-ra", "GIRL",
                    "Guiding star, compassionate savior", "मार्गदर्शक तारा, करुणामयी", "Sanskrit / Buddhist", List.of("Karuna", "Bodhi", "Shanti")),
            new ReligionEntry("Islam", "Zoya", "ज़ोया", "ZO-ya", "GIRL",
                    "Alive, loving, radiant", "जीवंत, स्नेही और प्रकाशमय", "Arabic / Persian", List.of("Noor", "Hayat", "Amina")),
            new ReligionEntry("Islam", "Zayan", "ज़यान", "za-YAAN", "BOY",
                    "Graceful, bright, hospitable", "सौम्य, उज्ज्वल और सुंदर", "Arabic", List.of("Noor", "Ayan", "Raza")),
            new ReligionEntry("Christianity", "Ethan", "ईथन", "EE-than", "BOY",
                    "Strong, enduring, steadfast", "दृढ़, अडिग और शक्तिशाली", "Hebrew / Christian", List.of("David", "Noah", "Grace")),
            new ReligionEntry("Christianity", "Hannah", "हन्ना", "HAN-nah", "GIRL",
                    "Grace, favor, compassion", "अनुग्रह, कृपा और करुणा", "Hebrew / Christian", List.of("Grace", "Clara", "Joy")),
            new ReligionEntry("Universal", "Aarohi", "आरोही", "aa-RO-hee", "GIRL",
                    "Ascending musical note, progress", "आरोही, निरंतर प्रगति", "Sanskrit / Global", List.of("Swara", "Pragati", "Sargam")),
            new ReligionEntry("Universal", "Kabir", "कबीर", "ka-BEER", "BOY",
                    "Great, noble, timeless poet-sage", "महान, संत कबीर की वाणी", "Indian / Universal", List.of("Sant", "Satya", "Prem"))
    );

    public ChildNameResponseDto suggest(ChildNameRequestDto req) {
        String father = cleanName(req.getFatherName());
        String mother = cleanName(req.getMotherName());
        String deity = normalizeOptional(req.getDeity());
        String gender = normalizeGender(req.getGender());
        String religion = normalizeReligion(req.getReligion());
        String country = normalizeOptional(req.getCountry());
        if (country.isBlank()) country = "India";
        String lang = normalizeLang(req.getLanguage());
        String startLetter = normalizeStartingLetter(req.getStartingLetter());

        Map<String, ChildNameSuggestionDto> unique = new LinkedHashMap<>();

        // 1. Direct Father + Mother syllable/letter blend combinations (+ optional Deity blends)
        for (ChildNameSuggestionDto blend : generateParentBlends(father, mother, deity, gender, religion, country, lang)) {
            unique.putIfAbsent(blend.getName().toLowerCase(Locale.ROOT), blend);
        }

        // 2. Religion-specific & global/country-friendly names (prioritized when non-Hindu or Universal)
        if (!"Hinduism".equalsIgnoreCase(religion)) {
            addReligionEntries(unique, father, mother, deity, gender, religion, country, lang);
        }

        // 3. Deity-linked & synonym-rich names (prioritizing those matching Father/Mother initials/syllables)
        String deityKey = deity.toLowerCase(Locale.ROOT);
        String fInit = father.substring(0, 1).toLowerCase(Locale.ROOT);
        String mInit = mother.substring(0, 1).toLowerCase(Locale.ROOT);

        List<DeityEntry> matchingDeity = new ArrayList<>();
        List<DeityEntry> otherDeity = new ArrayList<>();
        for (DeityEntry entry : DEITY_NAMES) {
            if (!matchesGender(entry.gender(), gender)) continue;
            boolean deityMatch = !deityKey.isBlank()
                    && (entry.deityKey().contains(deityKey)
                    || entry.synonyms().stream().anyMatch(s -> s.toLowerCase(Locale.ROOT).contains(deityKey)));
            if (deityMatch) {
                matchingDeity.add(entry);
            } else if (deityKey.isBlank() && ("Hinduism".equalsIgnoreCase(religion) || "Universal".equalsIgnoreCase(religion))) {
                otherDeity.add(entry);
            }
        }

        matchingDeity.sort((a, b) -> Integer.compare(initialScore(b.name(), fInit, mInit), initialScore(a.name(), fInit, mInit)));

        for (DeityEntry entry : matchingDeity) {
            addDeitySuggestion(unique, entry, father, mother, religion, country, lang);
        }
        for (DeityEntry entry : otherDeity) {
            if (unique.size() >= 18) break;
            addDeitySuggestion(unique, entry, father, mother, religion, country, lang);
        }

        if ("Hinduism".equalsIgnoreCase(religion)) {
            addReligionEntries(unique, father, mother, deity, gender, religion, country, lang);
        }

        List<ChildNameSuggestionDto> list = new ArrayList<>(unique.values());
        if (!startLetter.isBlank()) {
            list.sort((a, b) -> {
                boolean aMatch = a.getName().toLowerCase(Locale.ROOT).startsWith(startLetter);
                boolean bMatch = b.getName().toLowerCase(Locale.ROOT).startsWith(startLetter);
                return Boolean.compare(bMatch, aMatch);
            });
        }
        if (list.size() > 24) {
            list = list.subList(0, 24);
        }

        ChildNameResponseDto response = new ChildNameResponseDto();
        response.setFatherName(father);
        response.setMotherName(mother);
        response.setDeity(deity.isBlank() ? "Any / Universal" : capitalize(deity));
        response.setReligion(religion);
        response.setCountry(country);
        response.setLanguage(lang);
        response.setTotalSuggestions(list.size());
        response.setSuggestions(list);
        return response;
    }

    public Map<String, List<String>> getOptions() {
        Map<String, List<String>> opts = new LinkedHashMap<>();
        opts.put("deities", List.of("Any", "Shiva", "Krishna", "Rama", "Ganesha", "Durga", "Lakshmi", "Saraswati", "Hanuman"));
        opts.put("religions", List.of("Hinduism", "Sikhism", "Jainism", "Buddhism", "Islam", "Christianity", "Universal"));
        opts.put("countries", List.of("India", "United States", "United Kingdom", "Canada", "Australia", "Nepal", "Global"));
        opts.put("languages", List.of("en", "hi", "sa"));
        opts.put("genders", List.of("ANY", "BOY", "GIRL"));
        return opts;
    }

    private void addReligionEntries(
            Map<String, ChildNameSuggestionDto> unique,
            String father,
            String mother,
            String deity,
            String gender,
            String religion,
            String country,
            String lang) {
        for (ReligionEntry entry : MULTI_RELIGION_NAMES) {
            if (!matchesGender(entry.gender(), gender)) continue;
            boolean relMatch = "Universal".equalsIgnoreCase(religion)
                    || entry.religion().equalsIgnoreCase(religion)
                    || ("Hinduism".equalsIgnoreCase(religion) && "Universal".equalsIgnoreCase(entry.religion()));
            if (!relMatch) continue;
            String meaning = "hi".equals(lang) ? entry.meaningHi() : entry.meaningEn();
            String significance = "hi".equals(lang)
                    ? entry.origin() + " परंपरा से जुड़ा शुभ और आधुनिक नाम।"
                    : "Rooted in " + entry.origin() + " heritage; easy to pronounce in " + country + ".";
            String sourceNote = buildParentConnectionNote(entry.name(), father, mother, lang);
            unique.putIfAbsent(
                    entry.name().toLowerCase(Locale.ROOT),
                    buildSuggestion(
                            entry.name(),
                            entry.scriptText(),
                            entry.pronunciation(),
                            meaning + " (" + country + " friendly)",
                            significance,
                            sourceNote,
                            deity.isBlank() ? entry.origin() : capitalize(deity) + " · " + entry.origin(),
                            entry.gender(),
                            entry.religion(),
                            entry.origin(),
                            entry.synonyms()
                    )
            );
        }
    }

    private List<ChildNameSuggestionDto> generateParentBlends(
            String father, String mother, String deity, String gender, String religion, String country, String lang) {
        List<ChildNameSuggestionDto> blends = new ArrayList<>();
        String fPre2 = prefix(father, 2);
        String fPre3 = prefix(father, 3);
        String mPre2 = prefix(mother, 2);
        String mPre3 = prefix(mother, 3);
        String fSuf2 = suffix(father, 2);
        String fSuf3 = suffix(father, 3);
        String mSuf2 = suffix(mother, 2);
        String mSuf3 = suffix(mother, 3);

        List<String[]> rawPairs = List.of(
                new String[]{capitalize(fPre2 + mSuf3), father + " (" + fPre2 + ") + " + mother + " (" + mSuf3 + ")"},
                new String[]{capitalize(mPre2 + fSuf3), mother + " (" + mPre2 + ") + " + father + " (" + fSuf3 + ")"},
                new String[]{capitalize(fPre3 + mSuf2), father + " (" + fPre3 + ") + " + mother + " (" + mSuf2 + ")"},
                new String[]{capitalize(mPre3 + fSuf2), mother + " (" + mPre3 + ") + " + father + " (" + fSuf2 + ")"},
                new String[]{capitalize(fPre2 + "a" + mSuf2), father + " (" + fPre2 + ") + " + mother + " (" + mSuf2 + ")"},
                new String[]{capitalize(mPre2 + "i" + fSuf2), mother + " (" + mPre2 + ") + " + father + " (" + fSuf2 + ")"}
        );

        for (String[] pair : rawPairs) {
            String candidate = smoothVowels(pair[0]);
            if (candidate.length() < 3 || candidate.length() > 11) continue;
            String inferredGender = candidate.endsWith("a") || candidate.endsWith("i") ? "GIRL" : "BOY";
            if (!"ANY".equals(gender) && !inferredGender.equals(gender)) {
                inferredGender = gender;
            }
            String meaning = switch (lang) {
                case "hi" -> father + " और " + mother + " के नामों का शुभ संगम"
                        + (deity.isBlank() ? "" : " · " + capitalize(deity) + " के आशीर्वाद सहित");
                case "sa" -> father + "-" + mother + " नाम्नोः शुभसंयोगः"
                        + (deity.isBlank() ? "" : " · " + capitalize(deity) + " प्रसादः");
                default -> "Harmonious blend of " + father + " & " + mother
                        + (deity.isBlank() ? "" : " · Blessed by " + capitalize(deity))
                        + " (" + country + ")";
            };
            String significance = "hi".equals(lang)
                    ? "माता-पिता दोनों के नामों की ध्वनि से बना अद्वितीय पारिवारिक नाम।"
                    : "A unique family-woven name carrying syllables from both parents.";

            List<String> syns = new ArrayList<>();
            syns.add(father + " + " + mother);
            if (!deity.isBlank()) syns.add(capitalize(deity) + " Grace");

            blends.add(buildSuggestion(
                    candidate,
                    candidate,
                    candidate.toUpperCase(Locale.ROOT),
                    meaning,
                    significance,
                    pair[1],
                    deity.isBlank() ? "Parents' Union" : capitalize(deity) + " Blessing",
                    inferredGender,
                    religion,
                    "Parent Syllable Blend",
                    syns
            ));
        }
        return blends;
    }

    private void addDeitySuggestion(
            Map<String, ChildNameSuggestionDto> unique,
            DeityEntry entry,
            String father,
            String mother,
            String religion,
            String country,
            String lang) {
        String meaning = switch (lang) {
            case "hi" -> entry.meaningHi();
            case "sa" -> entry.meaningSa();
            default -> entry.meaningEn();
        };
        String significance = "hi".equals(lang) ? entry.significanceHi() : entry.significanceEn();
        String comboNote = buildParentConnectionNote(entry.name(), father, mother, lang);
        unique.putIfAbsent(
                entry.name().toLowerCase(Locale.ROOT),
                buildSuggestion(
                        entry.name(),
                        entry.scriptText(),
                        entry.pronunciation(),
                        meaning + " · (" + country + ")",
                        significance,
                        comboNote,
                        capitalize(entry.deityKey()),
                        entry.gender(),
                        religion,
                        "Sanskrit / " + capitalize(entry.deityKey()),
                        entry.synonyms()
                )
        );
    }

    private ChildNameSuggestionDto buildSuggestion(
            String name,
            String scriptText,
            String pronunciation,
            String meaning,
            String significance,
            String comboSource,
            String deityConnection,
            String gender,
            String religion,
            String origin,
            List<String> synonyms) {
        int num = numerologyNumber(name);
        return new ChildNameSuggestionDto(
                name,
                scriptText,
                pronunciation,
                meaning,
                significance,
                comboSource,
                deityConnection,
                gender,
                religion,
                origin,
                rashiFor(name),
                nakshatraFor(name),
                num,
                numerologyTrait(num),
                luckyDayFor(num),
                luckyColorFor(num),
                synonyms
        );
    }

    private String rashiFor(String name) {
        char c = Character.toUpperCase(name.charAt(0));
        return switch (c) {
            case 'A', 'L', 'E' -> "Mesha (Aries)";
            case 'B', 'V', 'U' -> "Vrishabha (Taurus)";
            case 'K', 'C', 'G' -> "Mithuna (Gemini)";
            case 'H', 'D' -> "Karka (Cancer)";
            case 'M', 'T' -> "Simha (Leo)";
            case 'P', 'N' -> "Kanya (Virgo)";
            case 'R' -> "Tula (Libra)";
            case 'Y' -> "Vrishchika (Scorpio)";
            case 'S' -> "Kumbha (Aquarius)";
            case 'J', 'Z' -> "Makara (Capricorn)";
            default -> "Meena (Pisces)";
        };
    }

    private String nakshatraFor(String name) {
        char c = Character.toUpperCase(name.charAt(0));
        return switch (c) {
            case 'A' -> "Krittika / Ashwini";
            case 'R' -> "Chitra / Swati";
            case 'S' -> "Shatabhisha / Mula";
            case 'V' -> "Rohini / Mrigashira";
            case 'M' -> "Magha / Purva Phalguni";
            case 'G' -> "Ardra / Punarvasu";
            case 'P' -> "Uttara Phalguni / Hasta";
            case 'I', 'E' -> "Ashwini / Rohini";
            case 'J', 'Z' -> "Uttara Ashadha / Shravana";
            default -> "Revati / Bharani";
        };
    }

    private int numerologyNumber(String name) {
        int sum = 0;
        for (char c : name.toUpperCase(Locale.ROOT).toCharArray()) {
            if (c >= 'A' && c <= 'Z') {
                sum += ((c - 'A') % 9) + 1;
            }
        }
        while (sum > 9) {
            int next = 0;
            while (sum > 0) {
                next += sum % 10;
                sum /= 10;
            }
            sum = next;
        }
        return sum == 0 ? 1 : sum;
    }

    private String numerologyTrait(int n) {
        return switch (n) {
            case 1 -> "Leadership, independence & clarity";
            case 2 -> "Harmony, empathy & diplomacy";
            case 3 -> "Creativity, joy & expression";
            case 4 -> "Stability, discipline & trust";
            case 5 -> "Curiosity, adaptability & freedom";
            case 6 -> "Compassion, family & grace";
            case 7 -> "Wisdom, introspection & spirituality";
            case 8 -> "Strength, abundance & determination";
            default -> "Humanitarianism, courage & generosity";
        };
    }

    private String luckyDayFor(int n) {
        return switch (n % 7) {
            case 1 -> "Sunday";
            case 2 -> "Monday";
            case 3 -> "Thursday";
            case 4 -> "Saturday";
            case 5 -> "Wednesday";
            case 6 -> "Friday";
            default -> "Tuesday";
        };
    }

    private String luckyColorFor(int n) {
        return switch (n % 6) {
            case 1 -> "Saffron Gold";
            case 2 -> "Pearl White";
            case 3 -> "Warm Yellow";
            case 4 -> "Emerald Green";
            case 5 -> "Sky Blue";
            default -> "Deep Maroon";
        };
    }

    private String buildParentConnectionNote(String name, String father, String mother, String lang) {
        String lower = name.toLowerCase(Locale.ROOT);
        boolean startsF = lower.startsWith(father.substring(0, 1).toLowerCase(Locale.ROOT));
        boolean startsM = lower.startsWith(mother.substring(0, 1).toLowerCase(Locale.ROOT));
        if (startsF && startsM) {
            return "hi".equals(lang)
                    ? father + " और " + mother + " दोनों के प्रथम अक्षर से प्रेरित"
                    : "Shares starting letter with both " + father + " & " + mother;
        }
        if (startsF) {
            return "hi".equals(lang)
                    ? father + " के प्रथम अक्षर ('" + father.substring(0, 1) + "') से प्रेरित"
                    : "Inspired by " + father + "'s initial ('" + father.substring(0, 1) + "')";
        }
        if (startsM) {
            return "hi".equals(lang)
                    ? mother + " के प्रथम अक्षर ('" + mother.substring(0, 1) + "') से प्रेरित"
                    : "Inspired by " + mother + "'s initial ('" + mother.substring(0, 1) + "')";
        }
        return "hi".equals(lang)
                ? father + " व " + mother + " के परिवार हेतु शुभ चयन"
                : "Auspicious match for " + father + " & " + mother;
    }

    private int initialScore(String name, String fInit, String mInit) {
        String n = name.toLowerCase(Locale.ROOT);
        int score = 0;
        if (n.startsWith(fInit)) score += 2;
        if (n.startsWith(mInit)) score += 2;
        return score;
    }

    private boolean matchesGender(String entryGender, String requested) {
        return "ANY".equals(requested) || "UNISEX".equalsIgnoreCase(entryGender) || entryGender.equalsIgnoreCase(requested);
    }

    private String cleanName(String raw) {
        String cleaned = raw == null ? "" : raw.trim().replaceAll("[^\\p{L}]", "");
        if (cleaned.length() < 2) return "Anand";
        return capitalize(cleaned);
    }

    private String normalizeOptional(String s) {
        if (s == null) return "";
        String t = s.trim();
        return "any".equalsIgnoreCase(t) || "none".equalsIgnoreCase(t) ? "" : t;
    }

    private String normalizeGender(String g) {
        if (g == null) return "ANY";
        String up = g.trim().toUpperCase(Locale.ROOT);
        return ("BOY".equals(up) || "GIRL".equals(up)) ? up : "ANY";
    }

    private String normalizeReligion(String r) {
        if (r == null || r.isBlank()) return "Hinduism";
        return capitalize(r.trim());
    }

    private String normalizeLang(String l) {
        if (l == null) return "en";
        String low = l.trim().toLowerCase(Locale.ROOT);
        if ("hi".equals(low) || "sa".equals(low)) return low;
        return "en";
    }

    private String normalizeStartingLetter(String s) {
        if (s == null) return "";
        String cleaned = s.trim().replaceAll("[^a-zA-Z]", "").toLowerCase(Locale.ROOT);
        return cleaned.isEmpty() ? "" : cleaned.substring(0, 1);
    }

    private String prefix(String s, int n) {
        return s.substring(0, Math.min(n, s.length())).toLowerCase(Locale.ROOT);
    }

    private String suffix(String s, int n) {
        return s.length() <= n ? s.toLowerCase(Locale.ROOT) : s.substring(s.length() - n).toLowerCase(Locale.ROOT);
    }

    private String smoothVowels(String s) {
        return s.replaceAll("([aeiouAEIOU])\\1+", "$1")
                .replaceAll("([^aeiouAEIOU])\\1{2,}", "$1$1");
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return "";
        return s.substring(0, 1).toUpperCase(Locale.ROOT) + s.substring(1).toLowerCase(Locale.ROOT);
    }
}
