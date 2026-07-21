package com.vedas.config;

import com.vedas.dto.TempleDto;

import java.util.ArrayList;
import java.util.List;

/** Educational temple guide — history and practice notes (not live booking). */
public final class TempleCatalog {

    private TempleCatalog() {}

    public static List<TempleDto> all(String lang) {
        boolean hi = "hi".equalsIgnoreCase(lang);
        List<TempleDto> list = new ArrayList<>();
        list.add(t("kashi-vishwanath", hi ? "काशी विश्वनाथ" : "Kashi Vishwanath", "shiva",
                hi ? "वाराणसी, उत्तर प्रदेश" : "Varanasi, Uttar Pradesh",
                hi ? "ज्योतिर्लिंग — काशी का हृदय, शिव की नगरी।"
                        : "Jyotirlinga — heart of Kashi, city of Shiva.",
                hi ? "मोक्ष और ज्ञान की नगरी में मुख्य शिव मंदिर।"
                        : "Principal Shiva temple in the city of liberation and learning.",
                hi ? "गर्भगृह, गंगा घाटों से जुड़ा परिसर।" : "Sanctum linked to the Ganga ghats.",
                hi ? "प्रातः से रात्रि आरती तक (स्थानीय घोषणा देखें)" : "Dawn to evening aarti (check local notices)",
                List.of("maha-shivaratri"), hi ? "गंगा आरती, संकटमोचन" : "Ganga aarti, Sankat Mochan",
                "https://www.google.com/maps/search/?api=1&query=Kashi+Vishwanath+Temple",
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"));
        list.add(t("kedarnath", hi ? "केदारनाथ" : "Kedarnath", "shiva",
                hi ? "उत्तराखंड हिमालय" : "Uttarakhand Himalayas",
                hi ? "चार धाम ज्योतिर्लिंग — पर्वत में शिव।"
                        : "Char Dham jyotirlinga — Shiva in the mountains.",
                hi ? "तीर्थयात्रा और तप की प्रतीक।" : "Symbol of pilgrimage and austerity.",
                hi ? "पाषाण मंदिर, बर्फीले परिवेश।" : "Stone shrine in snowy terrain.",
                hi ? "ऋतु अनुसार (ग्रीष्म-शरद)" : "Seasonal (summer–autumn)",
                List.of("maha-shivaratri"), hi ? "गंगोत्री, बद्रीनाथ मार्ग" : "Gangotri, Badrinath route",
                "https://www.google.com/maps/search/?api=1&query=Kedarnath+Temple",
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"));
        list.add(t("tirupati", hi ? "तिरुपति बालाजी" : "Tirupati Balaji", "vishnu",
                hi ? "आंध्र प्रदेश" : "Andhra Pradesh",
                hi ? "वेंकटेश्वर — दक्षिण भारत का प्रमुख विष्णु धाम।"
                        : "Venkateswara — major Vishnu shrine of South India.",
                hi ? "भक्ति और दान की विशाल परंपरा।" : "Vast tradition of devotion and offering.",
                hi ? "द्रविड़ शिखर, पहाड़ी परिसर।" : "Dravidian vimana on a hill complex.",
                hi ? "दिनभर दर्शन (कतार/ऑनलाइन टोकन)" : "Day-long darshan (queue/online token)",
                List.of("diwali"), hi ? "तिरुमाला परिवेश" : "Tirumala environs",
                "https://www.google.com/maps/search/?api=1&query=Tirumala+Tirupati",
                "https://images.unsplash.com/photo-1604608672516-f011cb612a8b?w=800"));
        list.add(t("badrinath", hi ? "बद्रीनाथ" : "Badrinath", "vishnu",
                hi ? "उत्तराखंड" : "Uttarakhand",
                hi ? "चार धाम — नारायण की हिमालयी पीठ।"
                        : "Char Dham — Himalayan seat of Narayana.",
                hi ? "वैष्णव भक्ति का उत्तरी स्तंभ।" : "Northern pillar of Vaishnava bhakti.",
                hi ? "रंगीन गर्भगृह, अलकनंदा तट।" : "Colorful sanctum by the Alaknanda.",
                hi ? "ऋतु अनुसार" : "Seasonal",
                List.of("diwali"), hi ? "केदारनाथ मार्ग" : "Kedarnath route",
                "https://www.google.com/maps/search/?api=1&query=Badrinath+Temple",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"));
        list.add(t("ayodhya", hi ? "अयोध्या राम मंदिर" : "Ayodhya Ram Mandir", "rama",
                hi ? "अयोध्या, उत्तर प्रदेश" : "Ayodhya, Uttar Pradesh",
                hi ? "राम जन्मभूमि — मर्यादा पुरुषोत्तम की नगरी।"
                        : "Ram Janmabhoomi — city of Maryada Purushottama.",
                hi ? "राम भक्ति और सांस्कृतिक पुनरुत्थान का केंद्र।"
                        : "Center of Rama bhakti and cultural renewal.",
                hi ? "नवीन मंदिर परिसर, सरयू किनारा।" : "New temple complex by the Sarayu.",
                hi ? "प्रातः–सायं आरती" : "Morning–evening aarti",
                List.of("ram-navami", "diwali"), hi ? "हनुमानगढ़ी, सरयू घाट" : "Hanuman Garhi, Sarayu ghats",
                "https://www.google.com/maps/search/?api=1&query=Ram+Mandir+Ayodhya",
                "https://images.unsplash.com/photo-1548013146-72479768bada?w=800"));
        list.add(t("vrindavan", hi ? "वृंदावन" : "Vrindavan", "krishna",
                hi ? "मथुरा ज़िला, उत्तर प्रदेश" : "Mathura district, Uttar Pradesh",
                hi ? "कृष्ण लीला भूमि — बैंकें बिहारी, राधा रमण आदि।"
                        : "Land of Krishna lila — Banke Bihari, Radha Raman and more.",
                hi ? "भक्ति संगीत और रास की नगरी।" : "City of bhakti music and rasa.",
                hi ? "कई मंदिर, यमुना तट।" : "Many temples along the Yamuna.",
                hi ? "मंदिर अनुसार" : "Varies by temple",
                List.of("janmashtami", "holi"), hi ? "मथुरा, गोवर्धन" : "Mathura, Govardhan",
                "https://www.google.com/maps/search/?api=1&query=Vrindavan",
                "https://images.unsplash.com/photo-1508672019048-805c086bbae5?w=800"));
        list.add(t("vaishno-devi", hi ? "वैष्णो देवी" : "Vaishno Devi", "durga",
                hi ? "कटरा, जम्मू-कश्मीर" : "Katra, Jammu & Kashmir",
                hi ? "त्रिकुटा पर्वत पर माता का धाम।"
                        : "Mother’s shrine on Trikuta hills.",
                hi ? "शक्ति तीर्थ — तीन पिंडियाँ।" : "Shakti tirtha — three pindis.",
                hi ? "गुफा गर्भगृह, पैदल/हेली मार्ग।" : "Cave sanctum; trek/heli routes.",
                hi ? "दिन-रात दर्शन" : "Darshan day and night",
                List.of("navratri"), hi ? "जम्वान, कटरा बाज़ार" : "Jammu, Katra bazaar",
                "https://www.google.com/maps/search/?api=1&query=Vaishno+Devi",
                "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"));
        list.add(t("siddhivinayak", hi ? "सिद्धिविनायक" : "Siddhivinayak", "ganesha",
                hi ? "मुंबई, महाराष्ट्र" : "Mumbai, Maharashtra",
                hi ? "प्रसिद्ध गणेश मंदिर — शुभारंभ और मनोकामना।"
                        : "Famous Ganesha temple — beginnings and wishes.",
                hi ? "महाराष्ट्र भक्ति का आधुनिक केंद्र।" : "Modern hub of Maharashtrian devotion.",
                hi ? "नगर मंदिर, स्वर्ण शिखर।" : "Urban temple with golden shikhara.",
                hi ? "प्रातः–रात्रि" : "Morning–night",
                List.of("ganesh-chaturthi"), hi ? "प्रभादेवी परिवेश" : "Prabhadevi area",
                "https://www.google.com/maps/search/?api=1&query=Siddhivinayak+Temple",
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800"));
        list.add(t("konark", hi ? "कोणार्क सूर्य मंदिर" : "Konark Sun Temple", "surya",
                hi ? "ओडिशा" : "Odisha",
                hi ? "१३वीं शताब्दी का सूर्य रथ मंदिर — विश्व धरोहर।"
                        : "13th-century sun chariot temple — World Heritage.",
                hi ? "भारतीय कला और ज्योतिष का प्रतीक।" : "Icon of Indian art and astronomy.",
                hi ? "रथ आकार, पाषाण मूर्तियाँ।" : "Chariot form, stone sculpture.",
                hi ? "दिन का समय (ASI)" : "Daytime (ASI)",
                List.of("makar-sankranti"), hi ? "पुरी जगन्नाथ" : "Puri Jagannath",
                "https://www.google.com/maps/search/?api=1&query=Konark+Sun+Temple",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"));
        list.add(t("kalighat", hi ? "कालीघाट" : "Kalighat", "kali",
                hi ? "कोलकाता, पश्चिम बंगाल" : "Kolkata, West Bengal",
                hi ? "शक्ति पीठ — काली माता का प्रसिद्ध मंदिर।"
                        : "Shakti peeth — famous Kali temple.",
                hi ? "बंगाल की शक्ति उपासना का केंद्र।" : "Center of Bengali Shakti worship.",
                hi ? "नदी किनारा, पारंपरिक बंगाली शैली।" : "Riverine, traditional Bengali style.",
                hi ? "प्रातः–सायं" : "Morning–evening",
                List.of("kali-puja", "navratri"), hi ? "दक्षिणेश्वर" : "Dakshineswar",
                "https://www.google.com/maps/search/?api=1&query=Kalighat+Temple",
                "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"));
        return list;
    }

    private static TempleDto t(String slug, String name, String deity, String location,
                               String history, String importance, String architecture,
                               String timings, List<String> festivals, String nearby,
                               String tour, String image) {
        TempleDto dto = new TempleDto();
        dto.setSlug(slug);
        dto.setName(name);
        dto.setDeitySlug(deity);
        dto.setLocation(location);
        dto.setHistory(history);
        dto.setImportance(importance);
        dto.setArchitecture(architecture);
        dto.setTimings(timings);
        dto.setFestivalSlugs(festivals);
        dto.setNearby(nearby);
        dto.setVirtualTourUrl(tour);
        dto.setImageUrl(image);
        return dto;
    }
}
