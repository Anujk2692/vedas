package com.vedas.config;

import com.vedas.dto.DeityDto;

import java.util.ArrayList;
import java.util.List;

/** Curated Gods & Goddesses knowledge (educational, public-domain summaries). */
public final class DeityCatalog {

    private DeityCatalog() {}

    public static List<DeityDto> all(String lang) {
        boolean hi = "hi".equalsIgnoreCase(lang);
        List<DeityDto> list = new ArrayList<>();
        list.add(d("shiva", "DEVTA", hi ? "शिव" : "Shiva", "शिव",
                hi ? "शिव संहार और योग के अधिपति हैं — नीलकंठ, महादेव, नटराज।"
                        : "Shiva is lord of dissolution and yoga — Neelakantha, Mahadeva, Nataraja.",
                hi ? "त्रिशूल, डमरू, भस्म, तीसरा नेत्र — तप, लय और जागरण।"
                        : "Trishula, damaru, ash, third eye — austerity, dissolution, awakening.",
                hi ? "पार्वती (शक्ति), गणेश, कार्तिकेय; नंदी वाहन।"
                        : "Parvati (Shakti), Ganesha, Kartikeya; Nandi as vehicle.",
                hi ? "त्रिशूल, पिनाक धनुष" : "Trishula, Pinaka bow",
                hi ? "नंदी (वृषभ)" : "Nandi (bull)",
                List.of("ॐ नमः शिवाय", "महामृत्युंजय मंत्र"),
                List.of("maha-shivaratri"), List.of("kashi-vishwanath", "kedarnath"),
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"));
        list.add(d("vishnu", "DEVTA", hi ? "विष्णु" : "Vishnu", "विष्णु",
                hi ? "विष्णु पालनकर्ता — दस अवतारों में धर्म की रक्षा।"
                        : "Vishnu the sustainer — protects dharma through ten avataras.",
                hi ? "शंख, चक्र, गदा, पद्म — संरक्षण और व्यवस्था।"
                        : "Shankha, chakra, gada, padma — protection and cosmic order.",
                hi ? "लक्ष्मी; अवतार: राम, कृष्ण आदि।" : "Lakshmi; avataras include Rama and Krishna.",
                hi ? "सुदर्शन चक्र, कौमोदकी गदा" : "Sudarshana chakra, Kaumodaki mace",
                hi ? "गरुड़" : "Garuda",
                List.of("ॐ नमो भगवते वासुदेवाय", "विष्णु सहस्रनाम"),
                List.of("diwali"), List.of("tirupati", "badrinath"),
                "https://images.unsplash.com/photo-1604608672516-f011cb612a8b?w=800"));
        list.add(d("krishna", "DEVTA", hi ? "कृष्ण" : "Krishna", "कृष्ण",
                hi ? "द्वापर के पूर्ण अवतार — गीता, लीला और भक्ति के स्रोत।"
                        : "Purna avatara of Dvapara — source of Gita, lila, and bhakti.",
                hi ? "मुरली, मोरमुकुट, पीताम्बर — प्रेम और धर्मोपदेश।"
                        : "Flute, peacock crown, pitambara — love and teaching of dharma.",
                hi ? "यशोदा-नंद; राधा; बलराम।" : "Yashoda-Nanda; Radha; Balarama.",
                hi ? "सुदर्शन (विष्णु रूप)" : "Sudarshana (as Vishnu)",
                hi ? "गरुड़ / रथ (अर्जुन सारथि)" : "Garuda / chariot (Arjuna's charioteer)",
                List.of("हरे कृष्ण", "ॐ नमो भगवते वासुदेवाय"),
                List.of("janmashtami", "holi"), List.of("vrindavan", "dwarka"),
                "https://images.unsplash.com/photo-1508672019048-805c086bbae5?w=800"));
        list.add(d("rama", "DEVTA", hi ? "राम" : "Rama", "राम",
                hi ? "मर्यादा पुरुषोत्तम — रामायण के नायक, आदर्श राजा।"
                        : "Maryada Purushottama — hero of Ramayana, ideal king.",
                hi ? "धनुष-बाण, जटा, सीता संग — धर्म और मर्यादा।"
                        : "Bow and arrow, jata, with Sita — dharma and dignity.",
                hi ? "दशरथ-कौशल्या; सीता; लक्ष्मण, भरत, शत्रुघ्न; हनुमान भक्त।"
                        : "Dasharatha-Kaushalya; Sita; Lakshmana, Bharata, Shatrughna; Hanuman.",
                hi ? "कोदंड धनुष" : "Kodanda bow",
                hi ? "रथ / पैदल वनवास" : "Chariot / forest exile on foot",
                List.of("श्री राम जय राम जय जय राम", "राम रक्षा स्तोत्र"),
                List.of("ram-navami", "dussehra", "diwali"), List.of("ayodhya", "rameswaram"),
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"));
        list.add(d("hanuman", "DEVTA", hi ? "हनुमान" : "Hanuman", "हनुमान",
                hi ? "राम भक्त, बल और सेवा के प्रतीक — संकटमोचन।"
                        : "Devotee of Rama — strength, service, and remover of obstacles.",
                hi ? "गदा, पर्वत, लंका दहन — भक्ति और शक्ति।"
                        : "Mace, mountain, burning of Lanka — devotion and power.",
                hi ? "अंजना-पुत्र; पवनपुत्र; राम-सेवक।" : "Son of Anjana; Pavana-putra; servant of Rama.",
                hi ? "गदा" : "Mace",
                hi ? "वायु / उड़ान" : "Wind / flight",
                List.of("हनुमान चालीसा", "ॐ हनुमते नमः"),
                List.of("hanuman-jayanti"), List.of("salasar", "prayagraj-hanuman"),
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"));
        list.add(d("durga", "DEVI", hi ? "दुर्गा" : "Durga", "दुर्गा",
                hi ? "शक्ति स्वरूपा — महिषासुर मर्दिनी, नवरात्रि की अधिष्ठात्री।"
                        : "Embodiment of Shakti — slayer of Mahishasura, goddess of Navratri.",
                hi ? "अष्टभुजा, सिंह — साहस और रक्षा।"
                        : "Eight arms, lion — courage and protection.",
                hi ? "पार्वती/शक्ति रूप; गणेश-कार्तिकेय से जुड़ी माता।"
                        : "Form of Parvati/Shakti; mother linked to Ganesha and Kartikeya.",
                hi ? "त्रिशूल, चक्र, धनुष आदि" : "Trishula, chakra, bow and more",
                hi ? "सिंह / व्याघ्र" : "Lion / tiger",
                List.of("या देवी सर्वभूतेषु", "दुर्गा सप्तशती"),
                List.of("navratri", "dussehra"), List.of("vaishno-devi", "kalighat"),
                "https://images.unsplash.com/photo-1604608672516-f011cb612a8b?w=800"));
        list.add(d("lakshmi", "DEVI", hi ? "लक्ष्मी" : "Lakshmi", "लक्ष्मी",
                hi ? "ऐश्वर्य, शुभ और समृद्धि की देवी — विष्णु की पत्नी।"
                        : "Goddess of prosperity and auspiciousness — consort of Vishnu.",
                hi ? "कमल, स्वर्ण — शुद्ध समृद्धि।" : "Lotus and gold — pure prosperity.",
                hi ? "विष्णु की संगिनी।" : "Companion of Vishnu.",
                hi ? "—" : "—",
                hi ? "उल्लू / कमल" : "Owl / lotus",
                List.of("ॐ श्रीं महालक्ष्म्यै नमः", "लक्ष्मी अष्टक"),
                List.of("diwali"), List.of("tirupati"),
                "https://images.unsplash.com/photo-1508672019048-805c086bbae5?w=800"));
        list.add(d("saraswati", "DEVI", hi ? "सरस्वती" : "Saraswati", "सरस्वती",
                hi ? "ज्ञान, संगीत और वाणी की देवी।"
                        : "Goddess of knowledge, music, and speech.",
                hi ? "वीणा, पुस्तक, हंस — विद्या।" : "Veena, book, swan — learning.",
                hi ? "ब्रह्मा से जुड़ी; ज्ञान की अधिष्ठात्री।" : "Linked with Brahma; patron of learning.",
                hi ? "—" : "—",
                hi ? "हंस" : "Swan",
                List.of("ॐ ऐं सरस्वत्यै नमः", "सरस्वती वंदना"),
                List.of("vasant-panchami"), List.of("kashi-vishwanath"),
                "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800"));
        list.add(d("ganesha", "DEVTA", hi ? "गणेश" : "Ganesha", "गणेश",
                hi ? "विघ्नहर्ता — हर शुभारंभ के प्रथम पूज्य।"
                        : "Remover of obstacles — first worshipped at beginnings.",
                hi ? "एकदंत, लड्डू, मूषक — बुद्धि और विनम्रता।"
                        : "Ekadanta, laddus, mouse — wisdom and humility.",
                hi ? "शिव-पार्वती पुत्र; कार्तिकेय भाई।" : "Son of Shiva-Parvati; brother of Kartikeya.",
                hi ? "पाश, अंकुश" : "Pasha, ankusha",
                hi ? "मूषक" : "Mouse",
                List.of("ॐ गं गणपतये नमः", "गणपति अथर्वशीर्ष"),
                List.of("ganesh-chaturthi"), List.of("siddhivinayak", "ashtavinayak"),
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"));
        list.add(d("kartikeya", "DEVTA", hi ? "कार्तिकेय" : "Kartikeya", "कार्तिकेय",
                hi ? "सेनापति देव — स्कंद, मुरुगन, षण्मुख।"
                        : "Commander of the gods — Skanda, Murugan, Shanmukha.",
                hi ? "वेल, मयूर — वीरता।" : "Vel and peacock — valor.",
                hi ? "शिव-पार्वती पुत्र।" : "Son of Shiva and Parvati.",
                hi ? "शक्ति वेल" : "Shakti vel",
                hi ? "मयूर" : "Peacock",
                List.of("ॐ शरवणभवाय नमः"),
                List.of("skanda-sashti"), List.of("palani", "tiruttani"),
                "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"));
        list.add(d("kali", "DEVI", hi ? "काली" : "Kali", "काली",
                hi ? "काल और अज्ञान का नाश करने वाली उग्र शक्ति।"
                        : "Fierce Shakti who destroys time-bound ego and ignorance.",
                hi ? "खड्ग, मुण्डमाला — परिवर्तन और मुक्ति।"
                        : "Sword and garland of heads — transformation and liberation.",
                hi ? "दुर्गा/पार्वती का उग्र रूप; शिव संग।"
                        : "Fierce form of Durga/Parvati; with Shiva.",
                hi ? "खड्ग, त्रिशूल" : "Sword, trishula",
                hi ? "शव / श्मशान प्रतीक" : "Symbolic cremation ground",
                List.of("ॐ कालिकायै नमः"),
                List.of("kali-puja", "navratri"), List.of("kalighat", "dakshineswar"),
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"));
        list.add(d("surya", "DEVTA", hi ? "सूर्य" : "Surya", "सूर्य",
                hi ? "प्रकाश और प्राण के देव — गायत्री और आदित्य हृदय।"
                        : "Deity of light and life-force — Gayatri and Aditya Hridaya.",
                hi ? "रथ, सप्त अश्व — जागरण।" : "Chariot of seven horses — awakening.",
                hi ? "वैवस्वत परंपरा; राम से जुड़ा आदित्य हृदय।"
                        : "Vaivasvata lineage; Aditya Hridaya linked to Rama.",
                hi ? "—" : "—",
                hi ? "सप्ताश्व रथ" : "Seven-horse chariot",
                List.of("ॐ सूर्याय नमः", "गायत्री मंत्र"),
                List.of("makar-sankranti", "chhath"), List.of("konark", "modhera"),
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"));
        return list;
    }

    private static DeityDto d(String slug, String category, String name, String sa,
                              String story, String symbolism, String family, String weapons,
                              String vehicles, List<String> mantras, List<String> festivals,
                              List<String> temples, String image) {
        DeityDto dto = new DeityDto();
        dto.setSlug(slug);
        dto.setCategory(category);
        dto.setName(name);
        dto.setSanskritName(sa);
        dto.setStory(story);
        dto.setSymbolism(symbolism);
        dto.setFamily(family);
        dto.setWeapons(weapons);
        dto.setVehicles(vehicles);
        dto.setMantras(mantras);
        dto.setFestivalSlugs(festivals);
        dto.setTempleSlugs(temples);
        dto.setImageUrl(image);
        return dto;
    }
}
