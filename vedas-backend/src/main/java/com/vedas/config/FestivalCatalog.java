package com.vedas.config;

import com.vedas.dto.FestivalGuideDto;

import java.util.ArrayList;
import java.util.List;

/** Full festival guides — why, story, rituals, regional notes. */
public final class FestivalCatalog {

    private FestivalCatalog() {}

    public static List<FestivalGuideDto> all(String lang) {
        boolean hi = "hi".equalsIgnoreCase(lang);
        List<FestivalGuideDto> list = new ArrayList<>();
        list.add(f("makar-sankranti", hi ? "मकर संक्रांति" : "Makar Sankranti",
                hi ? "मकर में सूर्य संक्रमण (जनवरी)" : "Sun enters Capricorn (January)",
                hi ? "फसल कृतज्ञता और उष्णता की ओर प्रस्थान।" : "Harvest gratitude and turn toward longer days.",
                hi ? "सूर्य की उत्तरायण यात्रा का उत्सव।" : "Celebration of the sun’s northward course.",
                hi ? "तिल-गुड़, स्नान, दान।" : "Til-gud, holy bath, charity.",
                hi ? "सूर्य अर्घ्य, घर की सफाई, मिष्ठान वितरण।" : "Surya arghya, clean home, share sweets.",
                hi ? "ॐ सूर्याय नमः" : "Om Suryaya Namah",
                hi ? "तिल laddoo, खिचड़ी" : "Til laddoo, khichdi",
                hi ? "पंजाब में लोहड़ी, तमिलनाडु में पोंगल, असम में बिहू।"
                        : "Lohri (Punjab), Pongal (Tamil Nadu), Bihu (Assam).",
                List.of("surya")));
        list.add(f("maha-shivaratri", hi ? "महाशिवरात्रि" : "Maha Shivaratri",
                hi ? "फाल्गुन कृष्ण चतुर्दशी (लगभग)" : "Phalguna Krishna Chaturdashi (approx)",
                hi ? "शिव के तप और जागरण की रात्रि।" : "Night of Shiva’s austerity and awakening.",
                hi ? "शिव-पार्वती विवाह और नीलकंठ कथाएँ जुड़ी हैं।" : "Linked to Shiva-Parvati marriage and Neelakantha lore.",
                hi ? "उपवास, बिल्व पत्र, जप, जागरण।" : "Fast, bilva leaves, japa, night vigil.",
                hi ? "शिवलिंग अभिषेक: जल, दूध, बिल्व; ॐ नमः शिवाय।" : "Abhisheka with water, milk, bilva; chant Om Namah Shivaya.",
                "ॐ नमः शिवाय / महामृत्युंजय",
                hi ? "फल, दूध, बिल्व" : "Fruit, milk, bilva",
                hi ? "काशी, केदारनाथ और सभी शिव मंदिरों में विशेष आरती।"
                        : "Special aartis at Kashi, Kedarnath, and Shiva temples.",
                List.of("shiva")));
        list.add(f("holi", hi ? "होली" : "Holi",
                hi ? "फाल्गुन पूर्णिमा" : "Phalguna Purnima",
                hi ? "रंगों से प्रेम और द्वेष-मुक्ति।" : "Colors of love and letting go of grudges.",
                hi ? "होलिका दहन और प्रह्लाद की भक्ति की विजय।" : "Holika Dahan and Prahlada’s devotion triumph.",
                hi ? "होलाका दहन, रंग खेल, मिठाई।" : "Bonfire, colors, sweets.",
                hi ? "पहले रात अग्नि, अगले दिन रंग; क्षमा भाव।" : "Fire night before; colors next day; forgive.",
                hi ? "हरे कृष्ण" : "Hare Krishna",
                hi ? "गुजिया, ठंडाई" : "Gujiya, thandai",
                hi ? "मथुरा-वृंदावन में लठ्मार/फूलों की होली प्रसिद्ध।"
                        : "Mathura-Vrindavan famous for unique Holi traditions.",
                List.of("krishna", "vishnu")));
        list.add(f("ram-navami", hi ? "राम नवमी" : "Ram Navami",
                hi ? "चैत्र शुक्ल नवमी" : "Chaitra Shukla Navami",
                hi ? "श्री राम जन्म उत्सव।" : "Birth celebration of Sri Rama.",
                hi ? "अयोध्या में दशरथ-पुत्र राम का अवतार।" : "Rama’s avatara in Ayodhya.",
                hi ? "पाठ, कथा, भजन, मंदिर दर्शन।" : "Path, katha, bhajans, temple visit.",
                hi ? "रामचरितमानस/रामायण पाठ; प्रसाद वितरण।" : "Read Ramayana/Manas; share prasad.",
                "श्री राम जय राम जय जय राम",
                hi ? "पानक, फल" : "Panak, fruit",
                hi ? "अयोध्या में भव्य उत्सव; दक्षिण में भी राम नवमी।"
                        : "Grand in Ayodhya; widely observed in the South too.",
                List.of("rama", "hanuman")));
        list.add(f("janmashtami", hi ? "जन्माष्टमी" : "Janmashtami",
                hi ? "भाद्र कृष्ण अष्टमी" : "Bhadra Krishna Ashtami",
                hi ? "श्रीकृष्ण जन्म — धर्म स्थापना।" : "Krishna’s birth — restoration of dharma.",
                hi ? "मथुरा में कंस-भय में जन्मे कृष्ण की कथा।" : "Birth story in Mathura under Kamsa’s threat.",
                hi ? "उपवास, झूलन, मध्यरात्रि आरती।" : "Fast, jhulan, midnight aarti.",
                hi ? "भागवत कथा; दही-हांडी/उकडी (क्षेत्रीय)।" : "Bhagavata katha; dahi-handi (regional).",
                "हरे कृष्ण / ॐ नमो भगवते वासुदेवाय",
                hi ? "पंचामृत, मक्खन-मिश्री" : "Panchamrit, butter-mishri",
                hi ? "वृंदावन, द्वारका, महाराष्ट्र में विशेष।"
                        : "Special in Vrindavan, Dwarka, Maharashtra.",
                List.of("krishna")));
        list.add(f("ganesh-chaturthi", hi ? "गणेश चतुर्थी" : "Ganesh Chaturthi",
                hi ? "भाद्र शुक्ल चतुर्थी" : "Bhadra Shukla Chaturthi",
                hi ? "गणेश आगमन — विघ्न हरने का उत्सव।" : "Arrival of Ganesha — remover of obstacles.",
                hi ? "पार्वती द्वारा गणेश रचना और लोक उत्सव।" : "Parvati’s creation of Ganesha and public festival.",
                hi ? "मूर्ति स्थापना, आरती, विसर्जन।" : "Install murti, aarti, visarjan.",
                hi ? "मोदक भोग; गणपति अथर्वशीर्ष।" : "Offer modak; recite Ganapati Atharvashirsha.",
                "ॐ गं गणपतये नमः",
                hi ? "मोदक, लड्डू" : "Modak, laddu",
                hi ? "महाराष्ट्र में सार्वजनिक पंडाल; अन्यत्र घरेलू पूजा।"
                        : "Public pandals in Maharashtra; home puja elsewhere.",
                List.of("ganesha")));
        list.add(f("navratri", hi ? "नवरात्रि" : "Navratri",
                hi ? "आश्विन शुक्ल प्रतिपदा से नवमी" : "Ashwin Shukla 1–9",
                hi ? "देवी की नौ रात्रियाँ — शक्ति साधना।" : "Nine nights of Devi — Shakti sadhana.",
                hi ? "महिषासुर वध और नवदुर्गा उपासना।" : "Mahishasura victory and Navadurga worship.",
                hi ? "व्रत, गरबा/डांडिया, पाठ।" : "Vrat, garba/dandiya, recitation.",
                hi ? "कलश स्थापना; दुर्गा सप्तशती/देवी स्तोत्र।" : "Kalash sthapana; Durga Saptashati/Devi stotra.",
                "या देवी सर्वभूतेषु",
                hi ? "सात्विक भोग, फल" : "Sattvic bhog, fruit",
                hi ? "गुजरात गरबा, बंगाल दुर्गा पूजा, दक्षिण में गोलु।"
                        : "Garba (Gujarat), Durga Puja (Bengal), Golu (South).",
                List.of("durga", "kali", "lakshmi", "saraswati")));
        list.add(f("dussehra", hi ? "दशहरा / विजयदशमी" : "Dussehra / Vijayadashami",
                hi ? "आश्विन शुक्ल दशमी" : "Ashwin Shukla Dashami",
                hi ? "धर्म की विजय — राम द्वारा रावण-वध।" : "Victory of dharma — Rama over Ravana.",
                hi ? "लंका विजय और शस्त्र पूजा परंपराएँ।" : "Lanka victory and Shastra Puja traditions.",
                hi ? "रावण दहन, रामलीला, शमी/शस्त्र पूजन।" : "Ravana effigy, Ramlila, shami/weapon worship.",
                hi ? "रामायण विजय प्रसंग पढ़ें; विद्यारंभ शुभ दिन।" : "Read victory chapters; auspicious for learning starts.",
                "श्री राम जय राम",
                hi ? "प्रसाद मिष्ठान" : "Sweet prasad",
                hi ? "उत्तर में रामलीला; मैसूर दशहरा प्रसिद्ध।"
                        : "Ramlila in the North; Mysore Dasara is famous.",
                List.of("rama", "durga")));
        list.add(f("diwali", hi ? "दीपावली" : "Diwali",
                hi ? "कार्तिक अमावस्या" : "Kartika Amavasya",
                hi ? "प्रकाश का पर्व — राम की अयोध्या वापसी और लक्ष्मी पूजा।"
                        : "Festival of lights — Rama’s return and Lakshmi puja.",
                hi ? "अयोध्या दीपोत्सव और कुबेर/लक्ष्मी कथाएँ।" : "Ayodhya lamps and Lakshmi-Kubera lore.",
                hi ? "सफाई, दीप, लक्ष्मी-गणेश पूजा।" : "Cleaning, diyas, Lakshmi-Ganesha puja.",
                hi ? "संध्या पूजा; पटाखे संयम से; दान।" : "Evening puja; fireworks mindfully; charity.",
                "ॐ श्रीं महालक्ष्म्यै नमः",
                hi ? "मिठाई, कही-पूरी" : "Sweets, savory snacks",
                hi ? "उत्तर में राम; बंगाल में काली पूजा निकट; जैन-सिख परंपराएँ भी।"
                        : "Rama in North; Kali Puja near in Bengal; Jain/Sikh observances too.",
                List.of("rama", "lakshmi", "ganesha", "kali")));
        list.add(f("vasant-panchami", hi ? "वसंत पंचमी" : "Vasant Panchami",
                hi ? "माघ शुक्ल पंचमी" : "Magha Shukla Panchami",
                hi ? "सरस्वती और विद्या का उत्सव।" : "Festival of Saraswati and learning.",
                hi ? "वसंत आगमन और ज्ञान देवी की पूजा।" : "Arrival of spring and goddess of knowledge.",
                hi ? "पुस्तक पूजा, पीला वस्त्र, विद्यारंभ।" : "Book worship, yellow attire, start of learning.",
                hi ? "सरस्वती प्रतिमा/पुस्तक पर पुष्प; मंत्र जप।" : "Offer flowers to Saraswati/books; chant.",
                "ॐ ऐं सरस्वत्यै नमः",
                hi ? "केसर दूध, मीठा भात" : "Saffron milk, sweet rice",
                hi ? "बंगाल-पूर्व में विशेष; पंजाब में बसंत।"
                        : "Special in Bengal/East; Basant in Punjab.",
                List.of("saraswati")));
        list.add(f("hanuman-jayanti", hi ? "हनुमान जयंती" : "Hanuman Jayanti",
                hi ? "चैत्र पूर्णिमा (क्षेत्रीय भेद)" : "Chaitra Purnima (regional variants)",
                hi ? "हनुमान जन्म — बल और भक्ति।" : "Birth of Hanuman — strength and devotion.",
                hi ? "अंजनी पुत्र पवनपुत्र की कथा।" : "Story of Anjani’s son, Pavana-putra.",
                hi ? "चालीसा पाठ, सुंदरकांड, मंदिर दर्शन।" : "Chalisa, Sundarkand, temple visit.",
                hi ? "सिंदूर-तेल अर्पण (परंपरा अनुसार)।" : "Sindoor-oil offering (as per tradition).",
                "ॐ हनुमते नमः / हनुमान चालीसा",
                hi ? "लड्डू, बोरा" : "Laddu",
                hi ? "उत्तर-दक्षिण में तिथि भेद; सर्वत्र चालीसा।"
                        : "Date varies North/South; Chalisa everywhere.",
                List.of("hanuman", "rama")));
        list.add(f("kali-puja", hi ? "काली पूजा" : "Kali Puja",
                hi ? "कार्तिक अमावस्या (बंगाल)" : "Kartika Amavasya (Bengal)",
                hi ? "काली माता की रात्रि पूजा — अज्ञान नाश।" : "Night worship of Kali — destroy ignorance.",
                hi ? "शक्ति पीठ परंपरा और दीपावली काल।" : "Shakti peeth tradition in Diwali season.",
                hi ? "रात्रि पूजा, दीप, भजन।" : "Night puja, lamps, bhajans.",
                hi ? "कालीघाट/दक्षिणेश्वर शैली अनुसरण या घरेलू दीप।" : "Follow Kalighat/Dakshineswar style or home lamps.",
                "ॐ कालिकायै नमः",
                hi ? "मिष्टान्न" : "Sweets",
                hi ? "बंगाल-असम में मुख्य; अन्यत्र दीपावली संग।"
                        : "Main in Bengal-Assam; elsewhere with Diwali.",
                List.of("kali")));
        return list;
    }

    private static FestivalGuideDto f(String slug, String name, String when, String why, String story,
                                      String rituals, String puja, String mantras, String bhog,
                                      String regional, List<String> deities) {
        FestivalGuideDto dto = new FestivalGuideDto();
        dto.setSlug(slug);
        dto.setName(name);
        dto.setWhenLabel(when);
        dto.setWhy(why);
        dto.setStory(story);
        dto.setRituals(rituals);
        dto.setPujaMethod(puja);
        dto.setMantras(mantras);
        dto.setBhog(bhog);
        dto.setRegionalTraditions(regional);
        dto.setDeitySlugs(deities);
        return dto;
    }
}
