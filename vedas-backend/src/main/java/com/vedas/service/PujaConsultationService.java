package com.vedas.service;

import com.vedas.dto.SevaDtos.*;
import com.vedas.model.ConsultationMessage;
import com.vedas.model.ConsultationSession;
import com.vedas.model.PujaBooking;
import com.vedas.repository.ConsultationMessageRepository;
import com.vedas.repository.ConsultationSessionRepository;
import com.vedas.repository.PujaBookingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class PujaConsultationService {

    private static final List<PujaCatalogItem> PUJAS = List.of(
            new PujaCatalogItem("KASHI_RUDRABHISHEK", "Kashi Vishwanath Rudrabhishek", "काशी विश्वनाथ रुद्राभिषेक",
                    "Shri Kashi Vishwanath Temple, Varanasi", "Lord Shiva",
                    "Removes planetary obstacles, brings peace, health & spiritual strength.",
                    "ग्रह बाधा निवारण, उत्तम स्वास्थ्य व मानसिक शांति हेतु।", 51000, "₹510"),
            new PujaCatalogItem("MAHAKAL_CHADHAVA", "Mahakaleshwar Bhasma & Bilva Chadhava", "महाकालेश्वर भस्म व बिल्व चढ़ावा",
                    "Shri Mahakaleshwar Jyotirlinga, Ujjain", "Lord Mahakal",
                    "Protection from Rahu/Saturn dosha and career breakthroughs.",
                    "राहु-शनि दोष शांति एवं कार्य सिद्धि हेतु।", 35100, "₹351"),
            new PujaCatalogItem("AYODHYA_DEEP_SEVA", "Ayodhya Ram Mandir Deep & Prasad Seva", "अयोध्या राम मंदिर दीप व प्रसाद सेवा",
                    "Shri Ram Janmabhoomi, Ayodhya", "Lord Rama",
                    "Harmony in family, dharma, and auspicious beginnings.",
                    "परिवार में सुख-शांति व शुभ आरंभ हेतु।", 25100, "₹251"),
            new PujaCatalogItem("SIDDHIVINAYAK_MODAK", "Siddhivinayak Sankalp & Modak Chadhava", "सिद्धिविनायक संकल्प व मोदक चढ़ावा",
                    "Shree Siddhivinayak Temple, Mumbai", "Lord Ganesha",
                    "Success in new business, exams, and obstacle removal.",
                    "नवीन व्यापार, परीक्षा व विघ्न निवारण हेतु।", 21100, "₹211"),
            new PujaCatalogItem("VAISHNO_CHUNARI", "Mata Vaishno Devi Chunari & Aarti Seva", "माँ वैष्णो देवी चुनरी व आरती सेवा",
                    "Shri Mata Vaishno Devi Bhawan, Katra", "Maa Durga",
                    "Protection, prosperity, and family well-being.",
                    "रक्षा, समृद्धि और पारिवारिक कल्याण हेतु।", 55100, "₹551"),
            new PujaCatalogItem("TIRUPATI_ARCHANA", "Tirupati Balaji Suprabhata & Archana", "तिरुपति बालाजी सुप्रभात व अर्चना",
                    "Tirumala Venkateswara Temple, Tirupati", "Lord Venkateswara",
                    "Financial stability, abundance, and debt relief.",
                    "आर्थिक स्थिरता, समृद्धि और ऋण मुक्ति हेतु।", 75100, "₹751")
    );

    private static final List<TempleAudioItem> TEMPLE_AUDIOS = List.of(
            new TempleAudioItem("temple-bell-shankh", "Morning Temple Bell & Shankh Nada", "प्रातः मंदिर घंटा व शंख नाद",
                    "Kashi Vishwanath Tradition", "Temple Ambience",
                    "https://archive.org/download/GayatriMantra_201706/Gayatri%20Mantra.mp3", "04:12"),
            new TempleAudioItem("ganga-aarti-sound", "Dashashwamedh Ganga Aarti Chants", "दशाश्वमेध गंगा आरती ध्वनि",
                    "Varanasi Ganga Ghat", "Evening Aarti",
                    "https://archive.org/download/OmJaiJagdishHare_201809/Om%20Jai%20Jagdish%20Hare.mp3", "06:45"),
            new TempleAudioItem("rudrashtakam-temple", "Shri Rudrashtakam Temple Recitation", "श्री रुद्राष्टकम मंदिर पाठ",
                    "Ujjain Mahakal Tradition", "Vedic Stotra",
                    "https://archive.org/download/ShriRudrashtakam/Shri%20Rudrashtakam.mp3", "05:30"),
            new TempleAudioItem("hanuman-temple-chalisa", "Sankat Mochan Hanuman Temple Path", "संकट मोचन हनुमान मंदिर पाठ",
                    "Sankat Mochan, Varanasi", "Chalisa Audio",
                    "https://archive.org/download/HanumanChalisaByHariharan/Hanuman%20Chalisa.mp3", "09:42")
    );

    private static final List<AstrologerProfile> ASTROLOGERS = List.of(
            new AstrologerProfile("acharya-vedvyas", "Acharya Vedvyas Shastri",
                    "Vedic Kundli, KP System & Vimshottari Dasha", "वैदिक कुंडली, केपी सिस्टम व विंशोत्तरी दशा",
                    "Hindi, English, Sanskrit", 18, 4.9, 19900, "₹199 / session", true, List.of("CHAT", "AUDIO", "VIDEO")),
            new AstrologerProfile("jyotish-meera", "Dr. Meera Joshi",
                    "Ashtakoot Kundli Milan, Marriage & Child Name", "अष्टकूट कुंडली मिलान, विवाह व नामकरण",
                    "Hindi, English, Marathi", 14, 4.9, 24900, "₹249 / session", true, List.of("CHAT", "AUDIO", "VIDEO")),
            new AstrologerProfile("pandit-raghav", "Pandit Raghavendra Sharma",
                    "Lal Kitab Remedies, Vastu & Career Muhurat", "लाल किताब उपाय, वास्तु व करियर मुहूर्त",
                    "Hindi, English", 12, 4.8, 14900, "₹149 / session", true, List.of("CHAT", "AUDIO", "VIDEO")),
            new AstrologerProfile("numerology-ananya", "Ananya Kulkarni",
                    "Chaldean Numerology, Lo Shu Grid & Business Name", "अंक ज्योतिष, लो शु ग्रिड व व्यापार नाम",
                    "English, Hindi", 10, 4.8, 14900, "₹149 / session", true, List.of("CHAT", "AUDIO", "VIDEO"))
    );

    private final PujaBookingRepository pujaRepo;
    private final ConsultationSessionRepository sessionRepo;
    private final ConsultationMessageRepository messageRepo;

    public PujaConsultationService(
            PujaBookingRepository pujaRepo,
            ConsultationSessionRepository sessionRepo,
            ConsultationMessageRepository messageRepo) {
        this.pujaRepo = pujaRepo;
        this.sessionRepo = sessionRepo;
        this.messageRepo = messageRepo;
    }

    public SevaCatalogResponse getCatalog() {
        return new SevaCatalogResponse(PUJAS, TEMPLE_AUDIOS);
    }

    public PujaBooking bookPuja(BookPujaRequest req) {
        String code = req.getPujaCode().trim().toUpperCase(Locale.ROOT);
        PujaCatalogItem item = PUJAS.stream()
                .filter(p -> p.code().equals(code))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown pujaCode: " + code));

        PujaBooking booking = new PujaBooking();
        booking.setAccountKey(req.getAccountKey().trim().toLowerCase(Locale.ROOT));
        booking.setPujaCode(item.code());
        booking.setPujaTitle(item.titleEn());
        booking.setTempleName(item.templeName());
        booking.setDevoteeName(req.getDevoteeName().trim());
        booking.setGotra(req.getGotra() != null && !req.getGotra().isBlank() ? req.getGotra().trim() : "Kashyap");
        booking.setBookingDate(req.getBookingDate() != null && !req.getBookingDate().isBlank() ? req.getBookingDate().trim() : LocalDate.now().plusDays(1).toString());
        booking.setSankalpNotes(req.getSankalpNotes() != null ? req.getSankalpNotes().trim() : "");
        booking.setAmountPaise(item.amountPaise());
        booking.setStatus("CONFIRMED");
        return pujaRepo.save(booking);
    }

    public List<PujaBooking> myPujas(String accountKey) {
        return pujaRepo.findByAccountKeyIgnoreCaseOrderByCreatedAtDesc(accountKey.trim().toLowerCase(Locale.ROOT));
    }

    public List<AstrologerProfile> getAstrologers() {
        return ASTROLOGERS;
    }

    public ConsultationSessionView bookConsultation(BookConsultationRequest req) {
        AstrologerProfile astro = ASTROLOGERS.stream()
                .filter(a -> a.id().equals(req.getAstrologerId().trim()))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Astrologer not found"));
        String mode = req.getMode().trim().toUpperCase(Locale.ROOT);
        if (!List.of("CHAT", "AUDIO", "VIDEO").contains(mode)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "mode must be CHAT, AUDIO, or VIDEO");
        }

        ConsultationSession session = new ConsultationSession();
        session.setAccountKey(req.getAccountKey().trim().toLowerCase(Locale.ROOT));
        session.setAstrologerId(astro.id());
        session.setAstrologerName(astro.name());
        session.setMode(mode);
        session.setTopic(req.getTopic() != null && !req.getTopic().isBlank() ? req.getTopic().trim() : "Kundli & Life Guidance");
        session.setRoomCode("sg-" + UUID.randomUUID().toString().substring(0, 8));
        session.setStatus("LIVE");
        session.setAmountPaise(astro.feePerSessionPaise());
        ConsultationSession saved = sessionRepo.save(session);

        ConsultationMessage welcome = new ConsultationMessage();
        welcome.setSessionId(saved.getId());
        welcome.setSenderRole("ASTROLOGER");
        welcome.setSenderName(astro.name());
        welcome.setMessage("Namaste! Your " + mode + " consultation for \"" + saved.getTopic() + "\" is now LIVE. Please share your birth date, time & question, or click Join Audio/Video Call.");
        messageRepo.save(welcome);

        return toView(saved);
    }

    public List<ConsultationSessionView> myConsultations(String accountKey) {
        return sessionRepo.findByAccountKeyIgnoreCaseOrderByCreatedAtDesc(accountKey.trim().toLowerCase(Locale.ROOT))
                .stream().map(this::toView).toList();
    }

    public List<ConsultationMessage> getMessages(Long sessionId) {
        return messageRepo.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    public List<ConsultationMessage> sendMessage(Long sessionId, SendMessageRequest req) {
        ConsultationSession session = sessionRepo.findById(sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Consultation session not found"));

        ConsultationMessage userMsg = new ConsultationMessage();
        userMsg.setSessionId(sessionId);
        userMsg.setSenderRole("USER");
        userMsg.setSenderName(req.getSenderName().trim());
        userMsg.setMessage(req.getMessage().trim());
        userMsg.setCreatedAt(Instant.now());
        messageRepo.save(userMsg);

        ConsultationMessage reply = new ConsultationMessage();
        reply.setSessionId(sessionId);
        reply.setSenderRole("ASTROLOGER");
        reply.setSenderName(session.getAstrologerName());
        reply.setMessage("Thank you for sharing. Reviewing your Lagna, D9 Navamsa & current Dasha for \"" + req.getMessage().trim()
                + "\": focus on steady karma, chant your ruling planet mantra daily, and use the Full Kundli / Panchang Muhurat tab for exact timing.");
        reply.setCreatedAt(Instant.now().plusMillis(50));
        messageRepo.save(reply);

        return messageRepo.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    private ConsultationSessionView toView(ConsultationSession s) {
        return new ConsultationSessionView(
                s.getId(),
                s.getAccountKey(),
                s.getAstrologerId(),
                s.getAstrologerName(),
                s.getMode(),
                s.getTopic(),
                s.getRoomCode(),
                "https://meet.jit.si/sanatan-gyan-" + s.getRoomCode(),
                s.getStatus(),
                s.getAmountPaise(),
                s.getCreatedAt().toString()
        );
    }
}
