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
 * Generates meaningful child name suggestions by combining Father & Mother
 * syllables/initials with optional Deity synonyms and cultural/religious context.
 */
@Service
public class ChildNameService {

    private record DeityEntry(
            String deityKey,
            String name,
            String gender,
            String meaningEn,
            String meaningHi,
            String meaningSa,
            List<String> synonyms) {}

    private record ReligionEntry(
            String religion,
            String name,
            String gender,
            String meaningEn,
            String meaningHi,
            String origin,
            List<String> synonyms) {}

    private static final List<DeityEntry> DEITY_NAMES = List.of(
            // Shiva
            new DeityEntry("shiva", "Aarav", "BOY", "Peaceful, wise, calm like Shiva", "शांत, ज्ञानी और शिव के समान सौम्य", "शान्तः, शिवतुल्यः", List.of("Shiva", "Rudra", "Shant")),
            new DeityEntry("shiva", "Rudra", "BOY", "Fierce transformer, remover of sorrow", "दुखों का नाश करने वाले, शिव का रूप", "रुद्रः, दुःखहरः", List.of("Shiva", "Mahadev", "Shankar")),
            new DeityEntry("shiva", "Shivansh", "BOY", "Part of Lord Shiva", "भगवान शिव का अंश", "शिवस्य अंशः", List.of("Shiva", "Ishaan", "Mahesh")),
            new DeityEntry("shiva", "Ishaan", "BOY", "Ruler, Lord Shiva, northeast direction", "ईश्वर, भगवान शिव, शुभ दिशा", "ईशानः, सर्वेश्वरः", List.of("Shiva", "Prabhu", "Mahadev")),
            new DeityEntry("shiva", "Shivanya", "GIRL", "Devoted to Shiva, auspicious grace", "शिव की कृपा, शुभ और सौम्य", "शिवान्या, शुभदा", List.of("Shiva", "Parvati", "Gauri")),
            new DeityEntry("shiva", "Mridula", "GIRL", "Gentle, soft, graced by Shiva-Parvati", "कोमल, सौम्य और शांत स्वभाव", "मृदुला, कोमला", List.of("Parvati", "Shiva", "Saumya")),

            // Krishna / Vishnu
            new DeityEntry("krishna", "Achyut", "BOY", "Imperishable, infallible, Lord Krishna", "अविनाशी, अडिग, श्रीकृष्ण का नाम", "अच्युतः, अविनाशी", List.of("Krishna", "Vishnu", "Madhav")),
            new DeityEntry("krishna", "Vihaan", "BOY", "Dawn, new beginning, Krishna's flute aura", "प्रभात, नई शुरुआत, कृष्ण की आभा", "विहानः, प्रभातः", List.of("Krishna", "Arun", "Prakash")),
            new DeityEntry("krishna", "Madhav", "BOY", "Sweet like spring, Lord Krishna", "वसंत के समान मधुर, श्रीकृष्ण", "माधवः, मधुरः", List.of("Krishna", "Govind", "Keshav")),
            new DeityEntry("krishna", "Raghav", "BOY", "Descendant of Raghu, noble", "रघुवंशी, मर्यादा पुरुषोत्तम", "राघवः, श्रेष्ठः", List.of("Rama", "Vishnu", "Madhav")),
            new DeityEntry("krishna", "Radhika", "GIRL", "Successful, prosperous, beloved of Krishna", "सफल, समृद्ध, श्रीकृष्ण की प्रिय", "राधिका, समृद्धा", List.of("Radha", "Krishna", "Lakshmi")),
            new DeityEntry("krishna", "Vrinda", "GIRL", "Sacred basil (Tulsi), virtue", "पवित्र तुलसी, सद्गुणों से युक्त", "वृन्दा, पवित्रा", List.of("Tulsi", "Radha", "Devi")),

            // Rama
            new DeityEntry("rama", "Raghavendra", "BOY", "Lord Rama, chief of Raghus", "श्रीराम, रघुकुल के नायक", "राघवेन्द्रः, श्रीरामः", List.of("Rama", "Ramachandra", "Raghav")),
            new DeityEntry("rama", "Aryan", "BOY", "Noble, honorable, upright", "श्रेष्ठ, मर्यादित और सज्जन", "आर्यः, श्रेष्ठः", List.of("Rama", "Sreshtha", "Dharmik")),
            new DeityEntry("rama", "Siya", "GIRL", "Goddess Sita, pure and resilient", "माता सीता, पवित्र और धैर्यवान", "सीता, जानकी", List.of("Sita", "Janaki", "Vaidehi")),
            new DeityEntry("rama", "Janaki", "GIRL", "Daughter of Janak, Goddess Sita", "जनक नंदिनी, माता सीता", "जानकी, मैथिली", List.of("Sita", "Siya", "Maithili")),

            // Ganesha
            new DeityEntry("ganesha", "Reyansh", "BOY", "First ray of light, part of Vishnu/Ganesha", "सूर्य की पहली किरण, शुभ अंश", "रश्मिः, शुभप्रदः", List.of("Ganesha", "Aditya", "Pratham")),
            new DeityEntry("ganesha", "Vighnesh", "BOY", "Remover of obstacles, Lord Ganesha", "विघ्नों को हरने वाले, श्रीगणेश", "विघ्नेशः, गणनायकः", List.of("Ganesha", "Ganapati", "Vinayak")),
            new DeityEntry("ganesha", "Atharva", "BOY", "First Veda, Lord Ganesha, wise", "अथर्ववेद, ज्ञानी और श्रीगणेश", "अथर्वः, ज्ञानवान्", List.of("Ganesha", "Veda", "Pragya")),
            new DeityEntry("ganesha", "Riddhi", "GIRL", "Prosperity, wisdom, consort of Ganesha", "समृद्धि, बुद्धि और सफलता", "ऋद्धिः, समृद्धिः", List.of("Ganesha", "Siddhi", "Lakshmi")),
            new DeityEntry("ganesha", "Siddhi", "GIRL", "Accomplishment, spiritual attainment", "सिद्धि, पूर्णता और सफलता", "सिद्धिः, सफलता", List.of("Ganesha", "Riddhi", "Shakti")),

            // Devi / Durga / Lakshmi / Saraswati
            new DeityEntry("durga", "Aadhya", "GIRL", "First power, Goddess Durga", "आदि शक्ति, माँ दुर्गा", "आद्या, आदिशक्तिः", List.of("Durga", "Shakti", "Bhavani")),
            new DeityEntry("durga", "Ananya", "GIRL", "Matchless, unique, Goddess Parvati", "अद्वितीय, अनुपम, माँ पार्वती", "अनन्या, अद्वितीया", List.of("Durga", "Parvati", "Uma")),
            new DeityEntry("durga", "Shaurya", "BOY", "Bravery, valor blessed by Maa Durga", "शौर्य, वीरता और साहस", "शौर्यः, पराक्रमः", List.of("Durga", "Veer", "Kartikeya")),
            new DeityEntry("lakshmi", "Shriya", "GIRL", "Prosperity, grace, Goddess Lakshmi", "श्री, समृद्धि और माँ लक्ष्मी", "श्रिया, लक्ष्मीः", List.of("Lakshmi", "Padma", "Kamala")),
            new DeityEntry("lakshmi", "Niharika", "GIRL", "Dew drops, celestial grace", "ओस की बूँदें, दिव्य आभा", "नीहारिका, शुभा", List.of("Lakshmi", "Saraswati", "Jyoti")),
            new DeityEntry("saraswati", "Vanya", "GIRL", "Gracious gift of God, Saraswati's wisdom", "ईश्वर का वरदान, वाणी की देवी", "वान्या, सरस्वती", List.of("Saraswati", "Vani", "Vidya")),
            new DeityEntry("saraswati", "Pragya", "GIRL", "Highest wisdom, discernment", "प्रज्ञा, उच्चतम बुद्धि और विवेक", "प्रज्ञा, विवेकः", List.of("Saraswati", "Buddhi", "Medha")),
            new DeityEntry("saraswati", "Vedant", "BOY", "Essence of the Vedas, ultimate knowledge", "वेदांत, ज्ञान की पराकाष्ठा", "वेदान्तः, ब्रह्मज्ञानम्", List.of("Saraswati", "Veda", "Jnana")),

            // Hanuman
            new DeityEntry("hanuman", "Tejas", "BOY", "Radiant energy, sharp intellect", "तेजस्विता, ऊर्जा और बुद्धि", "तेजः, ऊर्जा", List.of("Hanuman", "Surya", "Agni")),
            new DeityEntry("hanuman", "Mahavir", "BOY", "Great hero, courageous like Hanuman", "महावीर, असीम साहसी", "महावीरः, बलवान्", List.of("Hanuman", "Bajrang", "Veer")),
            new DeityEntry("hanuman", "Anjani", "GIRL", "Grace of Mother Anjani, devoted strength", "माता अंजनी की कृपा, शक्ति", "अञ्जनी, शक्तिः", List.of("Hanuman", "Shakti", "Bhakti"))
    );

    private static final List<ReligionEntry> MULTI_RELIGION_NAMES = List.of(
            new ReligionEntry("Sikhism", "Gurleen", "GIRL", "Absorbed in the Guru's wisdom", "गुरु के ज्ञान में लीन", "Punjabi / Sikh", List.of("Gurbani", "Simran", "Noor")),
            new ReligionEntry("Sikhism", "Angad", "BOY", "Part of oneself, second Sikh Guru", "आत्म-अंश, गुरु अंगद देव", "Punjabi / Sikh", List.of("Guru", "Nanak", "Seva")),
            new ReligionEntry("Jainism", "Arihant", "BOY", "Conqueror of inner enemies", "अंतर-शत्रुओं को जीतने वाला", "Prakrit / Jain", List.of("Mahavir", "Ahimsa", "Jina")),
            new ReligionEntry("Jainism", "Jinaya", "GIRL", "Born of spiritual victory", "आध्यात्मिक विजय से उत्पन्न", "Prakrit / Jain", List.of("Jina", "Ahimsa", "Shanti")),
            new ReligionEntry("Buddhism", "Bodhi", "UNISEX", "Awakening, supreme enlightenment", "बोधि, परम ज्ञान और जागरण", "Pali / Buddhist", List.of("Buddha", "Prajna", "Karuna")),
            new ReligionEntry("Buddhism", "Tara", "GIRL", "Guiding star, compassionate savior", "मार्गदर्शक तारा, करुणामयी", "Sanskrit / Buddhist", List.of("Karuna", "Bodhi", "Shanti")),
            new ReligionEntry("Islam", "Zoya", "GIRL", "Alive, loving, radiant", "जीवंत, स्नेही और प्रकाशमय", "Arabic / Persian", List.of("Noor", "Hayat", "Amina")),
            new ReligionEntry("Islam", "Zayan", "BOY", "Graceful, bright, hospitable", "सौम्य, उज्ज्वल और सुंदर", "Arabic", List.of("Noor", "Ayan", "Raza")),
            new ReligionEntry("Christianity", "Ethan", "BOY", "Strong, enduring, steadfast", "दृढ़, अडिग और शक्तिशाली", "Hebrew / Christian", List.of("David", "Noah", "Grace")),
            new ReligionEntry("Christianity", "Hannah", "GIRL", "Grace, favor, compassion", "अनुग्रह, कृपा और करुणा", "Hebrew / Christian", List.of("Grace", "Clara", "Joy")),
            new ReligionEntry("Universal", "Aarohi", "GIRL", "Ascending musical note, progress", "आरोही, निरंतर प्रगति", "Sanskrit / Global", List.of("Swara", "Pragati", "Sargam")),
            new ReligionEntry("Universal", "Kabir", "BOY", "Great, noble, timeless poet-sage", "महान, संत कबीर की वाणी", "Indian / Universal", List.of("Sant", "Satya", "Prem"))
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

        Map<String, ChildNameSuggestionDto> unique = new LinkedHashMap<>();

        // 1. Direct Father + Mother syllable/letter blend combinations
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

        // Sort so names starting with father or mother initial appear first
        matchingDeity.sort((a, b) -> {
            int scoreA = initialScore(a.name(), fInit, mInit);
            int scoreB = initialScore(b.name(), fInit, mInit);
            return Integer.compare(scoreB, scoreA);
        });

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
            String sourceNote = buildParentConnectionNote(entry.name(), father, mother, lang);
            unique.putIfAbsent(
                    entry.name().toLowerCase(Locale.ROOT),
                    new ChildNameSuggestionDto(
                            entry.name(),
                            meaning + " (" + country + " friendly)",
                            sourceNote,
                            deity.isBlank() ? entry.origin() : deity + " · " + entry.origin(),
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

            List<String> syns = new ArrayList<>();
            syns.add(father + " + " + mother);
            if (!deity.isBlank()) syns.add(capitalize(deity) + " Grace");

            blends.add(new ChildNameSuggestionDto(
                    candidate,
                    meaning,
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
        String comboNote = buildParentConnectionNote(entry.name(), father, mother, lang);
        unique.putIfAbsent(
                entry.name().toLowerCase(Locale.ROOT),
                new ChildNameSuggestionDto(
                        entry.name(),
                        meaning + " · (" + country + ")",
                        comboNote,
                        capitalize(entry.deityKey()),
                        entry.gender(),
                        religion,
                        "Sanskrit / " + capitalize(entry.deityKey()),
                        entry.synonyms()
                )
        );
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
