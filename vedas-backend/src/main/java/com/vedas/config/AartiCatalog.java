package com.vedas.config;

import com.vedas.model.Aarti;
import com.vedas.model.AartiLine;
import com.vedas.model.LocalizedText;

import java.util.ArrayList;
import java.util.List;

public final class AartiCatalog {

    private AartiCatalog() {}

    public record AartiDef(
            String slug,
            Aarti.DeityType deityType,
            int order,
            String sanskritName,
            String transliteration,
            String titleEn,
            String titleHi,
            String descEn,
            String descHi,
            List<AartiLine> lines
    ) {}

    public static java.util.Optional<AartiDef> bySlug(String slug) {
        return all().stream().filter(d -> d.slug().equals(slug)).findFirst();
    }

    public static List<AartiDef> all() {
        List<AartiDef> list = new ArrayList<>();
        int o = 1;

        // —— Devta ——
        list.add(def("ganesha", Aarti.DeityType.DEVTA, o++, "श्री गणेश", "Śrī Gaṇeśa",
                "Ganesha Aarti", "गणेश आरती",
                "Jai Ganesh — Shendur Laal Chadhayo & Siddhivinayak aarti", "जय गणेश — शेंदुर लाल चढ़ायो",
                lines(
                        line("जय गणेश, जय गणेश, जय गणेश देवा ।", "Jaya Gaṇeśa, jaya Gaṇeśa, jaya Gaṇeśa devā |",
                                "Victory to Lord Ganesha", "जय हो गणेश देव"),
                        line("माता जाकी पार्वती, पिता महादेवा ॥", "Mātā jākī Pārvatī, pitā Mahādevā ||",
                                "Mother Parvati, father Mahadeva", "माता पार्वती, पिता महादेव"),
                        line("एक दन्त दयावन्त, चार भुजा धारी ।", "Eka danta dayāvanta, cāra bhujā dhārī |",
                                "Single-tusked, merciful, four-armed Lord", "एक दांत दयालु, चार भुजाधारी"),
                        line("मांगे सतत, तुम्हें शरण पड़े कारी ॥", "Māṃge satata, tumheṃ śaraṇa paḍe kārī ||",
                                "Always seeking your refuge", "सदा तेरी शरण में"),
                        line("तुम्हरे द्वारे, आए सब कोई ।", "Tumhare dvāre, āe saba koī |",
                                "All come to your door", "तेरे द्वार पर सब आते"),
                        line("मांगे सतत, तुम्हें शरण पड़े सोई ॥", "Māṃge satata, tumheṃ śaraṇa paḍe soī ||",
                                "All seek your shelter", "शरण में पड़े सभी"))));

        list.add(def("shiva", Aarti.DeityType.DEVTA, o++, "श्री शिव", "Śrī Śiva",
                "Shiva Aarti", "शिव आरती",
                "Om Jai Shiv Omkara — Lord of the three worlds", " ॐ जय शिव ओंकारा",
                lines(
                        line(" ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा ।", "Om jaya Śiva Omkārā, svāmī jaya Śiva Omkārā |",
                                "Glory to Shiva the Om-formed Lord", " ॐ जय शिव ओंकार स्वामी को"),
                        line("ब्रह्मा, विष्णु, सदाशिव, अर्धांगी धारा ॥", "Brahmā, Viṣṇu, Sadāśiva, ardhāṅgī dhārā ||",
                                "Brahma, Vishnu, Sadashiva — with Parvati", "ब्रह्मा विष्णु सदाशिव अर्धांगी सहित"))));

        list.add(def("vishnu", Aarti.DeityType.DEVTA, o++, "श्री विष्णु", "Śrī Viṣṇu",
                "Vishnu Aarti", "विष्णु आरती",
                "Om Jai Jagdish Hare — Lord of the universe", " ॐ जय जगदीश हरे",
                lines(
                        line(" ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।", "Om jaya Jagdīśa hare, svāmī jaya Jagdīśa hare |",
                                "Glory to Lord of the universe", "जगत के स्वामी को जय"),
                        line("भक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥", "Bhakta jano ke saṅkaṭ, dāsa jano ke saṅkaṭ, kṣaṇa meṃ dūr kare ||",
                                "Removes devotees' troubles in an instant", "भक्तों के कष्ट क्षण में दूर करें"))));

        list.add(def("krishna", Aarti.DeityType.DEVTA, o++, "श्री कृष्ण", "Śrī Kṛṣṇa",
                "Krishna Aarti", "कृष्ण आरती",
                "Aarti Kunj Bihari Ki — Lord of Vrindavan", "आरती कुंज बिहारी की",
                lines(
                        line("आरती कुंज बिहारी की, श्री गिरिधर कृष्ण मुरारी की ॥", "Āratī kuñja bihārī kī, śrī Giridhara Kṛṣṇa murārī kī ||",
                                "Aarti of Kunj Bihari, Krishna the lifter of Govardhan", "कुंज बिहारी गिरिधर कृष्ण की आरती"),
                        line("गale में बैजंती माला, बजावै मुरली मधुर बाला ॥", "Gale meṃ baijaṃtī mālā, bajāvai muralī madhura bālā ||",
                                "With vaijanti garland, playing sweet flute", "वैजंती माला और मधुर मुरली"))));

        list.add(def("rama", Aarti.DeityType.DEVTA, o++, "श्री राम", "Śrī Rāma",
                "Ram Aarti", "राम आरती",
                "Shri Ramchandra Kripalu — praise of Maryada Purushottam", "श्री रामचंद्र कृपालु",
                lines(
                        line("श्री रामचंद्र कृपालु भजु मन हरण भवभय दारुणम् ।", "Śrī Rāmacandra kṛpālu bhaju mana haraṇa bhavabhaya dāruṇam |",
                                "Worship merciful Ramchandra, dispeller of worldly fear", "कृपालु रामचंद्र की भक्ति करें"),
                        line("नवकंज-लोचन, कंज-मुख, कर कंज, पद कंजारुणम् ॥", "Navakañja-locana, kañja-mukha, kara kañja, pada kañjāruṇam ||",
                                "Lotus eyes, lotus face, lotus hands and feet", "कमल जैसे नेत्र, मुख और चरण"))));

        list.add(def("hanuman", Aarti.DeityType.DEVTA, o++, "श्री हनुमान", "Śrī Hanumān",
                "Hanuman Aarti", "हनुमान आरती",
                "Aarti Keejai Hanuman Lala Ki — devotion to Bajrang Bali", "आरती कीजै हनुमान लला की",
                lines(
                        line("आरती कीजै हनुमान लला की, दुष्ट दलन रघुनाथ कला की ॥", "Āratī kījai Hanumān lalā kī, duṣṭa dalana Raghunātha kalā kī ||",
                                "Perform aarti of Hanuman, skill of Raghu's destroyer of evil", "हनुमान लला की आरती — रघुनाथ की कला"),
                        line("जाकी शरण में सुख-साधन, दुःख-दारिद्र सब दूर भागै ॥", "Jākī śaraṇa meṃ sukha-sādhana, duḥkha-dāridra saba dūra bhāgai ||",
                                "In his refuge — happiness; sorrows and poverty flee", "शरण में सुख, दुःख दूर हो"))));

        list.add(def("kartikeya", Aarti.DeityType.DEVTA, o++, "श्री कार्तिकेय", "Śrī Kārtikeya",
                "Kartikeya Aarti", "कार्तिकेय आरती",
                "Aarti of Skanda — commander of the gods", "स्कंद देव की आरती",
                lines(
                        line("जय जय महासेन, जय शक्तिधर कुमार ।", "Jaya jaya Mahāsena, jaya Śaktidhara Kumāra |",
                                "Victory to great commander, bearer of Shakti", "महासेन शक्तिधर कुमार को जय"),
                        line("देवसेनापति, तारकारि, सदा विजयी ॥", "Devasenāpati, Tārakāri, sadā vijayī ||",
                                "Army chief of gods, slayer of Taraka, ever victorious", "देवसेनापति तारकासुर विनाशक"))));

        list.add(def("surya", Aarti.DeityType.DEVTA, o++, "श्री सूर्य", "Śrī Sūrya",
                "Surya Aarti", "सूर्य आरती",
                "Jai Kali Kalyan Mala — Sun God aarti", "जय कली कल्याण माला",
                lines(
                        line("जय कली कल्याण माला, जय तुम्हारी शोभा न्यारी ॥", "Jaya kalī kalyāṇa mālā, jaya tumhārī śobhā nyārī ||",
                                "Victory to the garland of welfare, your splendor is unique", "कल्याण माला, अद्भुत शोभा"),
                        line("तुम हो दिवाकर देवा, प्रभु तुम हो दिवाकर देवा ॥", "Tuma ho Divākara devā, prabhu tuma ho Divākara devā ||",
                                "You are the Sun God, Lord of daylight", "आप दिवाकर देव हैं"))));

        list.add(def("vitthal", Aarti.DeityType.DEVTA, o++, "श्री विठ्ठल", "Śrī Viṭṭhala",
                "Vitthal Aarti", "विठ्ठल आरती",
                "Panduranga Vithoba aarti — Lord of Pandharpur", "पांडुरंग विठ्ठल आरती",
                lines(
                        line("येई हो विठ्ठले, नाम तुझे आहे पांडुरंगा ।", "Yēī ho Viṭṭhale, nāma tujhē āhē Pāṇḍuraṅgā |",
                                "Only you are Vithala, named Panduranga", "हे विठ्ठला, तुम्ही पांडुरंग"),
                        line("चरणी रतांचा, वारा निज दासांचा ॥", "Charaṇī ratāñcā, vārā nija dāsāñcā ||",
                                "Devotees at your feet, blessing on your servants", "चरणों में भक्त और दास"))));

        list.add(def("jagannath", Aarti.DeityType.DEVTA, o++, "श्री जगन्नाथ", "Śrī Jagannātha",
                "Jagannath Aarti", "जगन्नाथ आरती",
                "Aarti of Lord of the Universe — Puri", "जगन्नाथ देव की आरती",
                lines(
                        line("जय जगन्नाथ स्वामी, नयन पथ गामी ॥", "Jaya Jagannātha svāmī, nayana patha gāmī ||",
                                "Victory to Jagannath who walks the path of our eyes", "जगन्नाथ स्वामी की जय"),
                        line("भक्त चरण सेवत, प्रेम भक्ति देत ॥", "Bhakta charaṇa sevata, prema bhakti deta ||",
                                "Serving devotees' feet, granting loving devotion", "प्रेम भक्ति देने वाले"))));

        list.add(def("shani-dev", Aarti.DeityType.DEVTA, o++, "श्री शनि", "Śrī Śani",
                "Shani Dev Aarti", "शनि देव आरती",
                "Aarti of Shani Dev — justice and karma", "शनि देव की आरती",
                lines(
                        line("जय शनिदेव महाराज, सूर्य पुत्र नमो नमः ॥", "Jaya Śanideva Mahārāja, Sūrya putra namo namaḥ ||",
                                "Victory to King Shani, salutations to Sun's son", "शनिदेव महाराज को नमन"),
                        line("नीलांजन समाभासं, रवि पुत्रं यमाग्रजम् ॥", "Nīlāñjana samābhāsaṃ, ravi putraṃ Yamāgrajam ||",
                                "Dark as collyrium, son of Sun, elder brother of Yama", "नीले वर्ण, रवि पुत्र"))));

        list.add(def("sai-baba", Aarti.DeityType.DEVTA, o++, "श्री साईं", "Śrī Sāīṃ",
                "Sai Baba Aarti", "साईं बाबा आरती",
                "Om Sai Shri Sai — Shirdi Sai Baba aarti", " ॐ साईं श्री साईं",
                lines(
                        line(" ॐ साईं श्री साईं जय जय साईं ॥", "Om Sāīṃ Śrī Sāīṃ jaya jaya Sāīṃ ||",
                                "Om Sai, Shri Sai — victory to Sai", " ॐ साईं — जय साईं"),
                        line("सद्गुरु साईं, कृपा करो हम पर ॥", "Sadguru Sāīṃ, kṛpā karo hama para ||",
                                "Sadguru Sai, bless us", "सद्गुरु की कृपा"))));

        // —— Devi ——
        list.add(def("durga", Aarti.DeityType.DEVI, o++, "श्री दुर्गा", "Śrī Durgā",
                "Durga Aarti", "दुर्गा आरती",
                "Jai Ambe Gauri — Mother of the universe", "जय अंबे गौरी",
                lines(
                        line("जय अंबे गौरी, मैया जय श्यामा गौरी ॥", "Jaya Ambe Gaurī, maiyā jaya Śyāmā Gaurī ||",
                                "Victory to Mother Ambe Gauri", "जय अंबे गौरी मैया"),
                        line("तुमको निशदिन ध्यavat, हरि ब्रह्मा शिवरी ॥", "Tumako niśadina dhyāvata, Hari Brahmā Śivarī ||",
                                "Hari, Brahma, Shiva meditate on you day and night", "हरि ब्रह्मा शिव निशचर ध्यान"))));

        list.add(def("lakshmi", Aarti.DeityType.DEVI, o++, "श्री लक्ष्मी", "Śrī Lakṣmī",
                "Lakshmi Aarti", "लक्ष्मी आरती",
                "Om Jai Lakshmi Mata — goddess of prosperity", " ॐ जय लक्ष्मी माता",
                lines(
                        line(" ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता ॥", "Om jaya Lakṣmī mātā, maiyā jaya Lakṣmī mātā ||",
                                "Glory to Mother Lakshmi", " ॐ जय लक्ष्मी माता"),
                        line("तुमको निशदिन सेवत, हरि विष्णु विधाता ॥", "Tumako niśadina sevata, Hari Viṣṇu Vidhātā ||",
                                "Hari Vishnu serves you day and night", "विष्णु निशचर सेवा"))));

        list.add(def("saraswati", Aarti.DeityType.DEVI, o++, "श्री सरस्वती", "Śrī Sarasvatī",
                "Saraswati Aarti", "सरस्वती आरती",
                "Jai Saraswati Mata — goddess of knowledge", "जय सरस्वती माता",
                lines(
                        line("जय सरस्वती माता, जय जय सरस्वती माता ॥", "Jaya Sarasvatī mātā, jaya jaya Sarasvatī mātā ||",
                                "Victory to Mother Saraswati", "जय सरस्वती माता"),
                        line("सदगun बखानी, जात teri seva ॥", "Sadaguṇa bakhānī, jāta terī sevā ||",
                                "Virtues are praised through your worship", "सद्गुणों की स्तुति"))));

        list.add(def("kali", Aarti.DeityType.DEVI, o++, "श्री काली", "Śrī Kālī",
                "Kali Aarti", "काली आरती",
                "Mahakali aarti — destroyer of evil", "महाकाली आरती",
                lines(
                        line("जय काली, जय माँ काली, काली काली जय ॥", "Jaya Kālī, jaya māṃ Kālī, Kālī Kālī jaya ||",
                                "Victory to Mother Kali", "जय माँ काली"),
                        line("सर्व मंगala मांगale, शुभ सिद्धि सब दे ॥", "Sarva maṅgala māṅgale, śubha siddhi saba de ||",
                                "Grant all auspiciousness and success", "सर्व मंगल और सिद्धि"))));

        list.add(def("parvati", Aarti.DeityType.DEVI, o++, "श्री पार्वती", "Śrī Pārvatī",
                "Parvati Aarti", "पार्वती आरती",
                "Uma Parvati aarti — divine mother", "उमा पार्वती आरती",
                lines(
                        line("जय पार्वती माता, जय पार्वती माता ॥", "Jaya Pārvatī mātā, jaya Pārvatī mātā ||",
                                "Victory to Mother Parvati", "जय पार्वती माता"),
                        line("ब्रह्मा विष्णु सदा पूजत, शिव संग नित ॥", "Brahmā Viṣṇu sadā pūjata, Śiva saṅga nita ||",
                                "Brahma and Vishnu ever worship with Shiva", "ब्रह्मा विष्णु शिव संग पूजा"))));

        list.add(def("santoshi-maa", Aarti.DeityType.DEVI, o++, "संतोषी माँ", "Santoṣī Māṃ",
                "Santoshi Maa Aarti", "संतोषी माँ आरती",
                "Jai Santoshi Mata — goddess of satisfaction", "जय संतोषी माता",
                lines(
                        line("जय संतोषी माता, मैया जय संतोषी माता ॥", "Jaya Santoṣī mātā, maiyā jaya Santoṣī mātā ||",
                                "Victory to Mother Santoshi", "जय संतोषी माता"),
                        line("अपने भक्त जन की, सुख sampatti deti ॥", "Apane bhakta jana kī, sukha sampatti deti ||",
                                "Grants happiness and wealth to devotees", "भक्तों को सुख सम्पत्ति"))));

        list.add(def("vaishno-devi", Aarti.DeityType.DEVI, o++, "वैष्णो देवी", "Vaiṣṇo Devī",
                "Vaishno Devi Aarti", "वैष्णो देवी आरती",
                "Jai Mata Di — Trikuta Devi aarti", "जय माता दी",
                lines(
                        line("जय माता दी, सब की भैया जय माता दी ॥", "Jaya Mātā dī, saba kī bhaiyā jaya Mātā dī ||",
                                "Victory to the Mother — for everyone", "जय माता दी सभी के लिए"),
                        line("शera par sawar, adbhut darshan deti ॥", "Śera para savāra, adbhuta darśana deti ||",
                                "Rides the lion, grants wondrous vision", "शेर पर सवार, अद्भुत दर्शन"))));

        list.add(def("ganga-maa", Aarti.DeityType.DEVI, o++, "गंगा माँ", "Gaṅgā Māṃ",
                "Ganga Aarti", "गंगा आरती",
                "Har Har Gange — aarti of the sacred river", "हर हर गंगे",
                lines(
                        line("हर हर गंगे, नमामि गंगे ॥", "Hara Hara Gaṅge, namāmi Gaṅge ||",
                                "Glory to Ganga, I bow to Ganga", "हर हर गंगे — नमन"),
                        line("पाप ताप सब हरो, त्राहि त्राहि जगत ॥", "Pāpa tāpa saba haro, trāhi trāhi jagata ||",
                                "Remove all sins and suffering, save the world", "पाप ताप हरो, जगत की रक्षा"))));

        list.add(def("annapurna", Aarti.DeityType.DEVI, o++, "श्री अन्नपूर्णा", "Śrī Annapūrṇā",
                "Annapurna Aarti", "अन्नपूर्णा आरती",
                "Goddess of food and nourishment", "अन्न दात्री देवी",
                lines(
                        line("जय अन्नपूर्णा माता, जय अन्नपूर्णा माता ॥", "Jaya Annapūrṇā mātā, jaya Annapūrṇā mātā ||",
                                "Victory to Mother Annapurna", "जय अन्नपूर्णा माता"),
                        line("अन्न दान से जगत, तृpt ho sada ॥", "Anna dāna se jagata, tṛpta ho sadā ||",
                                "World ever satisfied by your gift of food", "अन्न दान से जगत तृpt"))));

        return list;
    }

    private static AartiDef def(String slug, Aarti.DeityType type, int order,
                                String sanskrit, String translit,
                                String titleEn, String titleHi, String descEn, String descHi,
                                List<AartiLine> lines) {
        return new AartiDef(slug, type, order, sanskrit, translit, titleEn, titleHi, descEn, descHi, lines);
    }

    private static List<AartiLine> lines(AartiLine... items) {
        return List.of(items);
    }

    private static AartiLine line(String sanskrit, String transliteration, String en, String hi) {
        return new AartiLine(sanskrit, transliteration, List.of(
                new LocalizedText("en", en),
                new LocalizedText("hi", hi)
        ));
    }
}
