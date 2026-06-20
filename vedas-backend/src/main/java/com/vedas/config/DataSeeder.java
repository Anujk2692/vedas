package com.vedas.config;

import com.vedas.model.*;
import com.vedas.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataSeeder {

    @Value("${vedas.seed.force:false}")
    private boolean forceSeed;

    @Bean
    CommandLineRunner seedData(
            LanguageRepository languageRepository,
            VedaRepository vedaRepository,
            ChapterRepository chapterRepository,
            VerseRepository verseRepository,
            MediaRepository mediaRepository,
            ChapterCatalogSync chapterCatalogSync,
            AartiCatalogSync aartiCatalogSync) {
        return args -> {
            if (languageRepository.count() == 0) {
                seedLanguages(languageRepository);
            }

            if (vedaRepository.count() > 0 && !forceSeed) {
                upsertVedaDetails(vedaRepository, chapterRepository, verseRepository);
                chapterCatalogSync.syncAll();
                aartiCatalogSync.syncAll();
                updateAllVedaCounts(vedaRepository, chapterRepository, verseRepository);
                seedMissingContent(vedaRepository, chapterRepository, verseRepository, mediaRepository);
                return;
            }

            if (forceSeed) {
                mediaRepository.deleteAll();
                verseRepository.deleteAll();
                chapterRepository.deleteAll();
                vedaRepository.deleteAll();
                if (languageRepository.count() == 0) {
                    seedLanguages(languageRepository);
                }
            }

            Veda rigveda = seedRigveda(vedaRepository);
            Veda samaveda = seedSamaveda(vedaRepository);
            Veda yajurveda = seedYajurveda(vedaRepository);
            Veda atharvaveda = seedAtharvaveda(vedaRepository);

            Chapter rigChapter = seedRigvedaChapter(chapterRepository, rigveda.getId());
            seedRigvedaVerses(verseRepository, rigveda.getId(), rigChapter.getId());
            seedRigvedaMedia(mediaRepository, rigveda.getId(), rigChapter.getId());

            Chapter samChapter = seedSamavedaChapter(chapterRepository, samaveda.getId());
            seedSamavedaVerses(verseRepository, samaveda.getId(), samChapter.getId());
            seedSamavedaMedia(mediaRepository, samaveda.getId(), samChapter.getId());

            Chapter yajChapter = seedYajurvedaChapter(chapterRepository, yajurveda.getId());
            seedYajurvedaVerses(verseRepository, yajurveda.getId(), yajChapter.getId());
            seedYajurvedaMedia(mediaRepository, yajurveda.getId(), yajChapter.getId());

            Chapter athChapter = seedAtharvavedaChapter(chapterRepository, atharvaveda.getId());
            seedAtharvavedaVerses(verseRepository, atharvaveda.getId(), athChapter.getId());
            seedAtharvavedaMedia(mediaRepository, atharvaveda.getId(), athChapter.getId());

            chapterCatalogSync.syncAll();
            aartiCatalogSync.syncAll();
            updateAllVedaCounts(vedaRepository, chapterRepository, verseRepository);
        };
    }

    private void updateAllVedaCounts(VedaRepository vedaRepo, ChapterRepository chapterRepo,
                                       VerseRepository verseRepo) {
        vedaRepo.findAll().forEach(v -> updateVedaCounts(v, chapterRepo, verseRepo, vedaRepo));
    }

    private void upsertVedaDetails(VedaRepository repo, ChapterRepository chapterRepo,
                                   VerseRepository verseRepo) {
        saveOrUpdate(repo, buildRigveda());
        saveOrUpdate(repo, buildSamaveda());
        saveOrUpdate(repo, buildYajurveda());
        saveOrUpdate(repo, buildAtharvaveda());
        repo.findAll().forEach(v -> updateVedaCounts(v, chapterRepo, verseRepo, repo));
    }

    private void seedMissingContent(VedaRepository vedaRepo, ChapterRepository chapterRepo,
                                    VerseRepository verseRepo, MediaRepository mediaRepo) {
        vedaRepo.findBySlug("rigveda").ifPresent(v -> seedIfEmpty(v, chapterRepo, verseRepo, mediaRepo, vedaRepo,
                () -> seedRigvedaChapter(chapterRepo, v.getId()),
                (c) -> seedRigvedaVerses(verseRepo, v.getId(), c.getId()),
                (c) -> seedRigvedaMedia(mediaRepo, v.getId(), c.getId())));
        vedaRepo.findBySlug("samaveda").ifPresent(v -> seedIfEmpty(v, chapterRepo, verseRepo, mediaRepo, vedaRepo,
                () -> seedSamavedaChapter(chapterRepo, v.getId()),
                (c) -> seedSamavedaVerses(verseRepo, v.getId(), c.getId()),
                (c) -> seedSamavedaMedia(mediaRepo, v.getId(), c.getId())));
        vedaRepo.findBySlug("yajurveda").ifPresent(v -> seedIfEmpty(v, chapterRepo, verseRepo, mediaRepo, vedaRepo,
                () -> seedYajurvedaChapter(chapterRepo, v.getId()),
                (c) -> seedYajurvedaVerses(verseRepo, v.getId(), c.getId()),
                (c) -> seedYajurvedaMedia(mediaRepo, v.getId(), c.getId())));
        vedaRepo.findBySlug("atharvaveda").ifPresent(v -> seedIfEmpty(v, chapterRepo, verseRepo, mediaRepo, vedaRepo,
                () -> seedAtharvavedaChapter(chapterRepo, v.getId()),
                (c) -> seedAtharvavedaVerses(verseRepo, v.getId(), c.getId()),
                (c) -> seedAtharvavedaMedia(mediaRepo, v.getId(), c.getId())));
    }

    private void seedIfEmpty(Veda veda, ChapterRepository chapterRepo, VerseRepository verseRepo,
                             MediaRepository mediaRepo, VedaRepository vedaRepo,
                             java.util.function.Supplier<Chapter> chapterSeeder,
                             java.util.function.Consumer<Chapter> verseSeeder,
                             java.util.function.Consumer<Chapter> mediaSeeder) {
        if (!chapterRepo.findByVedaIdOrderByNumberAsc(veda.getId()).isEmpty()) {
            return;
        }
        Chapter chapter = chapterSeeder.get();
        verseSeeder.accept(chapter);
        if (mediaRepo.findByVedaIdAndType(veda.getId(), MediaAsset.MediaType.AUDIO).isEmpty()) {
            mediaSeeder.accept(chapter);
        }
        updateVedaCounts(veda, chapterRepo, verseRepo, vedaRepo);
    }

    private void updateVedaCounts(Veda veda, ChapterRepository chapterRepo,
                                  VerseRepository verseRepo, VedaRepository vedaRepo) {
        var chapters = chapterRepo.findByVedaIdOrderByNumberAsc(veda.getId());
        veda.setChapterCount(chapters.size());
        int verses = chapters.stream()
                .mapToInt(c -> verseRepo.findByChapterIdOrderByNumberAsc(c.getId()).size())
                .sum();
        veda.setVerseCount(verses);
        vedaRepo.save(veda);
    }

    private void saveOrUpdate(VedaRepository repo, Veda veda) {
        repo.findBySlug(veda.getSlug()).ifPresentOrElse(existing -> {
            veda.setId(existing.getId());
            repo.save(veda);
        }, () -> repo.save(veda));
    }

    private void seedLanguages(LanguageRepository repo) {
        repo.saveAll(List.of(
                new Language("sa", "Sanskrit", "संस्कृतम्", "Devanagari", false),
                new Language("hi", "Hindi", "हिन्दी", "Devanagari", false),
                new Language("en", "English", "English", "Latin", false),
                new Language("ta", "Tamil", "தமிழ்", "Tamil", false),
                new Language("te", "Telugu", "తెలుగు", "Telugu", false),
                new Language("kn", "Kannada", "ಕನ್ನಡ", "Kannada", false),
                new Language("ml", "Malayalam", "മലയാളം", "Malayalam", false),
                new Language("bn", "Bengali", "বাংলা", "Bengali", false),
                new Language("gu", "Gujarati", "ગુજરાતી", "Gujarati", false),
                new Language("mr", "Marathi", "मराठी", "Devanagari", false)
        ));
    }

    // ─── Rigveda ───────────────────────────────────────────────

    private Veda seedRigveda(VedaRepository repo) { return repo.save(buildRigveda()); }

    private Veda buildRigveda() {
        Veda v = baseVeda("rigveda", 1, "ऋग्वेद", "Rigveda",
                "The oldest of the four Vedas — a collection of hymns to the deities.",
                "चार वेदों में सबसे प्राचीन — देवताओं को समर्पित मंत्रों का संग्रह।",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800");
        v.setOverviews(List.of(
                lt("en", "The Rigveda is the oldest and most sacred of the four Vedas, composed in Vedic Sanskrit. It contains 1,028 hymns (suktas) organized into 10 books called Mandalas, with approximately 10,552 mantras. It forms the foundation of Hindu philosophy, ritual, and spiritual thought."),
                lt("hi", "ऋग्वेद चारों वेदों में सबसे प्राचीन और पवित्र है, जो वैदिक संस्कृत में रचित है। इसमें 10 मंडलों में व्यवस्थित 1,028 सूक्त और लगभग 10,552 मंत्र हैं। यह हिंदू दर्शन, यज्ञ और आध्यात्मिक चिंतन की आधारशिला है।"),
                lt("sa", "ऋग्वेदः चतुर्णां वेदानां प्राचीनतमः पवित्रतमश्च। दशसु मण्डलेषु १०२८ सूक्तानि, १०५५२ मन्त्राः च सन्ति।")
        ));
        v.setSignificances(List.of(
                lt("en", "Revered as Shruti (divine revelation heard by sages). The Rigveda establishes the concepts of Rita (cosmic order), Agni as mediator between humans and gods, and the pursuit of truth (Satya). It is recited in all major Vedic ceremonies."),
                lt("hi", "श्रुति के रूप में पूज्य। ऋग्वेद ऋत, अग्नि को मध्यस्थ के रूप में, और सत्य की खोज की अवधारणाओं को स्थापित करता है। सभी प्रमुख वैदिक अनुष्ठानों में इसका पाठ होता है।")
        ));
        v.setStructures(List.of(
                lt("en", "10 Mandalas (books). Mandalas 2-7 are family books (Grhya Mandalas) attributed to specific rishi families. Mandala 1 and 10 are later additions. Mandala 9 is dedicated entirely to Soma."),
                lt("hi", "10 मंडल। मंडल 2-7 कुल-पुस्तक हैं जो विशिष्ट ऋषि परिवारों से जुड़े हैं। मंडल 1 और 10 बाद में जुड़े। मंडल 9 पूर्णतः सोम को समर्पित है।")
        ));
        v.setHistoricalContexts(List.of(
                lt("en", "Composed over centuries along the Sarasvati and Indus river regions. Reflects the early Vedic civilization — pastoral life, fire worship, and reverence for natural forces personified as deities."),
                lt("hi", "सरस्वती और सिंधु नदी क्षेत्रों में सदियों में रचित। प्रारंभिक वैदिक सभ्यता — पशुपालन, अग्नि पूजा, और प्राकृतिक शक्तियों की देवता के रूप में पूजा को दर्शाता है।")
        ));
        v.setPeriods(lt("en", "c. 1500–1200 BCE (Vedic Period)", "hi", "लगभग 1500–1200 ईसा पूर्व (वैदिक काल)"));
        v.setDivisionNames(lt("en", "Mandala", "hi", "मंडल", "sa", "मण्डल"));
        v.setDivisionCount(10);
        v.setMantraCount(10552);
        v.setCompositionTypes(lt("en", "Poetic hymns (richas) in Vedic Sanskrit", "hi", "वैदिक संस्कृत में पद्य मंत्र (ऋचाएँ)"));
        v.setBranches(lt("en", "Shakalya (most prevalent), Bhashkala, Shankhayana, Ashvalayana, Mandukeya, and others — 21 recension branches traditionally recognized.", "hi", "शाकल्य (प्रमुख), भाष्कल, शंखायन, आश्वलायन, माण्डुक — 21 शाखाएँ परंपरागत रूप से मान्य।"));
        v.setPrimaryDeities(List.of("Agni", "Indra", "Varuna", "Soma", "Surya", "Ushas", "Vayu", "Ashvins", "Maruts", "Rudra"));
        v.setKeyThemes(lt("en", "Cosmic order (Rita)|Fire sacrifice (Yajna)|Praise of deities|Truth and righteousness (Satya-Dharma)|Creation hymns (Nasadiya Sukta)|Prayer for prosperity|Nature worship", "hi", "ऋत (कॉस्मिक व्यवस्था)|यज्ञ|देव स्तुति|सत्य-धर्म|सृष्टि सूक्त (नासदीय)|समृद्धि की प्रार्थना|प्रकृति पूजा"));
        v.setFamousSages(lt("en", "Vishvamitra|Vasishtha|Atri|Bharadvaja|Gritsamada|Vamadeva|Kanva|Angiras", "hi", "विश्वामित्र|वसिष्ठ|अत्रि|भरद्वाज|गृत्समद|वामदेव|कण्व|अंगिरस"));
        v.setSpecialFeatures(List.of(
                lt("en", "Contains the famous Nasadiya Sukta (Hymn of Creation) and Purusha Sukta. The Gayatri Mantra originates from Rigveda 3.62.10."),
                lt("hi", "प्रसिद्ध नासदीय सूक्त और पुरुष सूक्त इसमें हैं। गायत्री मंत्र ऋग्वेद 3.62.10 से उत्पन्न हुआ।")
        ));
        v.setChapterCount(1);
        v.setVerseCount(3);
        VedaDeepContent.apply(v);
        return v;
    }

    // ─── Samaveda ──────────────────────────────────────────────

    private Veda seedSamaveda(VedaRepository repo) { return repo.save(buildSamaveda()); }

    private Veda buildSamaveda() {
        Veda v = baseVeda("samaveda", 2, "सामवेद", "Samaveda",
                "The Veda of melodies — hymns set to music for ritual chanting.",
                "स्वर और गान का वेद — यज्ञ में गायन के लिए रचित मंत्र।");
        v.setCoverImageUrl("https://images.unsplash.com/photo-1516280440620-268afb30883e?w=800");
        v.setOverviews(List.of(
                lt("en", "The Samaveda is the Veda of chants and melodies (Saman). Most of its verses are derived from the Rigveda but arranged for musical recitation during Soma sacrifices. It has 1,549 verses (excluding repetitions) in two parts: Purvarchika and Uttararchika."),
                lt("hi", "सामवेद गान और स्वरों का वेद है। अधिकांश मंत्र ऋग्वेद से लिए गए हैं परंतु सोम यज्ञ में संगीतमय पाठ के लिए व्यवस्थित हैं। इसके दो भाग हैं: पूर्वार्चिक और उत्तरार्चिक।"),
                lt("sa", "सामवेदः गानस्वरवेदः। अधिकांश मन्त्राः ऋग्वेदात्, सोमयज्ञे गायनार्थं व्यवस्थिताः।")
        ));
        v.setSignificances(List.of(
                lt("en", "Known as the foundation of Indian classical music. Gandharva Veda (performing arts) draws from Samaveda. The Udgatri priests chant Samans during yajnas. Without proper melody, the ritual is considered incomplete."),
                lt("hi", "भारतीय शास्त्रीय संगीत की आधारशिला। गंधर्व वेद इससे प्रभावित। उद्गाता पुजारी यज्ञ में साम गाते हैं। सही स्वर के बिना अनुष्ठान अपूर्ण माना जाता है।")
        ));
        v.setStructures(List.of(
                lt("en", "Two Archikas (books): Purvarchika (650 verses) and Uttararchika (1,225 verses). Organized by deities and ritual contexts. Gramageya and Aranyageya sections for village and forest chants."),
                lt("hi", "दो आर्चिक: पूर्वार्चिक (650) और उत्तरार्चिक (1,225)। देवताओं और अनुष्ठान के अनुसार व्यवस्थित। ग्रामगेय और अरण्यगेय खंड।")
        ));
        v.setHistoricalContexts(List.of(
                lt("en", "Developed as the musical liturgy of the Rigvedic tradition. The science of Svara (musical notes) and Chhandas (meter) evolved through Samavedic chanting traditions."),
                lt("hi", "ऋग्वैदिक परंपरा के संगीतमय धर्मग्रंथ के रूप में विकसित। स्वर और छंद की विज्ञान इसी परंपरा से विकसित हुई।")
        ));
        v.setPeriods(lt("en", "c. 1200–1000 BCE", "hi", "लगभग 1200–1000 ईसा पूर्व"));
        v.setDivisionNames(lt("en", "Archika", "hi", "आर्चिक"));
        v.setDivisionCount(2);
        v.setMantraCount(1875);
        v.setCompositionTypes(lt("en", "Musical chants (Samans) derived from Rigvedic richas", "hi", "ऋग्वैदिक ऋचाओं से व्युत्पन्न संगीतमय साम"));
        v.setBranches(lt("en", "Kauthuma (most common), Ranayaniya, Jaiminiya, and Shatyamuni shakhas.", "hi", "कौथुम (प्रमुख), राणायनीय, जैमिनीय, शाट्यायनि शाखाएँ।"));
        v.setPrimaryDeities(List.of("Soma", "Agni", "Indra", "Surya", "Ushas"));
        v.setKeyThemes(lt("en", "Musical rendering of hymns|Soma sacrifice chants|Melodic worship|Ritual singing (Stotra)|Connection of sound and cosmos", "hi", "मंत्रों का संगीतमय पाठ|सोम यज्ञ के गीत|स्वर पूजा|स्तोत्र गायन|ध्वनि और ब्रह्मांड का संबंध"));
        v.setFamousSages(lt("en", "Jaimini|Kauthuma|Ranayana|Bharadvaja", "hi", "जैमिनी|कौथुम|राणायण|भरद्वाज"));
        v.setSpecialFeatures(List.of(
                lt("en", "Only Veda focused on musical notation. The seven Svaras (Sa, Ri, Ga, Ma, Pa, Dha, Ni) of Indian music trace their origin to Samavedic chanting."),
                lt("hi", "केवल संगीत पर केंद्रित वेद। भारतीय संगीत के सात स्वरों की उत्पत्ति सामवेद से जुड़ी है।")
        ));
        v.setChapterCount(1);
        v.setVerseCount(2);
        VedaDeepContent.apply(v);
        return v;
    }

    // ─── Yajurveda ─────────────────────────────────────────────

    private Veda seedYajurveda(VedaRepository repo) { return repo.save(buildYajurveda()); }

    private Veda buildYajurveda() {
        Veda v = baseVeda("yajurveda", 3, "यजुर्वेद", "Yajurveda",
                "The Veda of sacrificial formulas and ritual procedures.",
                "यज्ञ के मंत्र और कर्मकांड का वेद।");
        v.setCoverImageUrl("https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800");
        v.setOverviews(List.of(
                lt("en", "The Yajurveda provides the prose and verse formulas (yajus) recited by the Adhvaryu priest during Vedic sacrifices. Unlike the Rigveda, it focuses on how rituals are performed. It exists in two major recensions: Shukla (White) and Krishna (Black) Yajurveda."),
                lt("hi", "यजुर्वेद यज्ञ के दौरान अध्वर्यु पुजारी द्वारा पढ़े जाने वाले मंत्र प्रदान करता है। यह बताता है कि अनुष्ठान कैसे किया जाए। दो प्रमुख शाखाएँ: शुक्ल और कृष्ण यजुर्वेद।"),
                lt("sa", "यजुर्वेदः यज्ञकर्मप्रधानः। अध्वर्युणा पठनीयाः यजूंषि। शुक्लकृष्णाभ्यां शाखाभ्यां विख्यातः।")
        ));
        v.setSignificances(List.of(
                lt("en", "The practical guidebook of Vedic ritual. Contains detailed instructions for yajnas including Agnihotra, Ashvamedha, and Rajasuya. Forms the basis of Shrauta and Smarta traditions of worship."),
                lt("hi", "वैदिक अनुष्ठान की व्यावहारिक गाइड। अग्निहोत्र, अश्वमेध, राजसूय सहित यज्ञ के निर्देश। श्रौत और स्मार्त परंपराओं की आधारशिला।")
        ));
        v.setStructures(List.of(
                lt("en", "Shukla Yajurveda: 40 Adhyayas in Vajasaneyi Samhita (Madhyandina shakha). Krishna Yajurveda: mixed prose-verse in Taittiriya, Maitrayani, and Kathaka samhitas. Includes Brahmanas with ritual commentary."),
                lt("hi", "शुक्ल: 40 अध्याय, वाजसनेयी संहिता। कृष्ण: तैत्तिरीय, मैत्रायणी, काठक संहिताओं में मिश्रित गद्य-पद्य। ब्राह्मण ग्रंथ शामिल।")
        ));
        v.setHistoricalContexts(List.of(
                lt("en", "Emerged as rituals grew more complex, requiring precise procedural knowledge. Reflects the transition from simple fire offerings to elaborate multi-day ceremonies involving multiple priests."),
                lt("hi", "जटिल अनुष्ठानों के साथ विकसित, सटीक प्रक्रियात्मक ज्ञान की आवश्यकता। सरल अग्नि यज्ञ से विस्तृत बहु-दिवसीय समारोहों की ओर संक्रमण।")
        ));
        v.setPeriods(lt("en", "c. 1200–900 BCE", "hi", "लगभग 1200–900 ईसा पूर्व"));
        v.setDivisionNames(lt("en", "Adhyaya", "hi", "अध्याय"));
        v.setDivisionCount(40);
        v.setMantraCount(1975);
        v.setCompositionTypes(lt("en", "Prose and verse ritual formulas (Yajus)", "hi", "गद्य और पद्य यजुर्मंत्र"));
        v.setBranches(lt("en", "Shukla: Madhyandina, Kanva. Krishna: Taittiriya, Maitrayani, Kathaka, Kapisthala.", "hi", "शुक्ल: माध्यन्दिन, काण्व। कृष्ण: तैत्तिरीय, मैत्रायणी, काठक, कपिष्ठल।"));
        v.setPrimaryDeities(List.of("Agni", "Indra", "Soma", "Prajapati", "Vishnu", "Rudra"));
        v.setKeyThemes(lt("en", "Ritual procedures (Kalpa)|Sacrificial formulas|Fire altar construction|Priestly duties|Cosmic symbolism of yajna|Mantras for each ritual step", "hi", "अनुष्ठान विधि (कल्प)|यजुर्मंत्र|यज्ञ वेदी निर्माण|पुजारी कर्तव्य|यज्ञ का प्रतीकात्मक अर्थ|प्रत्येक चरण के मंत्र"));
        v.setFamousSages(lt("en", "Yajnavalkya|Uddalaka Aruni|Katyayana|Taittiri|Vajasaneya", "hi", "याज्ञवल्क्य|उद्दालक आरुणि|कात्यायन|तैत्तिरि|वाजसनेय"));
        v.setSpecialFeatures(List.of(
                lt("en", "Contains the Shatarudriya (Sri Rudram) — one of the most powerful Vedic hymns to Lord Shiva, chanted daily in temples across India."),
                lt("hi", "शतरुद्रीय (श्री रुद्रम्) इसमें है — भगवान शिव को समर्पित सबसे शक्तिशाली वैदिक स्तोत्रों में से एक।")
        ));
        v.setChapterCount(1);
        v.setVerseCount(2);
        VedaDeepContent.apply(v);
        return v;
    }

    // ─── Atharvaveda ───────────────────────────────────────────

    private Veda seedAtharvaveda(VedaRepository repo) { return repo.save(buildAtharvaveda()); }

    private Veda buildAtharvaveda() {
        Veda v = baseVeda("atharvaveda", 4, "अथर्ववेद", "Atharvaveda",
                "The Veda of spells, healing, and practical life wisdom.",
                "मंत्र, औषधि और जीवन ज्ञान का वेद।");
        v.setCoverImageUrl("https://images.unsplash.com/photo-1604608672513-3a5d0f6227b1?w=800");
        v.setOverviews(List.of(
                lt("en", "The Atharvaveda is the fourth Veda, distinct in its focus on everyday life. It contains 730 hymns with about 6,000 mantras covering healing, protection, marriage, kingship, and philosophical inquiry. It bridges Vedic ritual and later Upanishadic thought."),
                lt("hi", "अथर्ववेद चौथा वेद है, दैनिक जीवन पर केंद्रित। 730 सूक्त, लगभग 6,000 मंत्र — चिकित्सा, रक्षा, विवाह, राजत्व, दर्शन। यह वैदिक अनुष्ठान और उपनिषदों को जोड़ता है।"),
                lt("sa", "अथर्ववेदः चतुर्थः वेदः। ७३० सूक्तानि, ६००० मन्त्राः — चिकित्सा, रक्षा, विवाह, राज्य, दर्शनम्।")
        ));
        v.setSignificances(List.of(
                lt("en", "Called the Brahma Veda as the Brahma priest oversees its rituals. Addresses practical concerns — disease, misfortune, love, prosperity — alongside spiritual wisdom. Source of many popular mantras and Ayurvedic concepts."),
                lt("hi", "ब्रह्मवेद कहलाता है। व्यावहारिक चिंताएँ — रोग, दुर्भाग्य, प्रेम, समृद्धि — और आध्यात्मिक ज्ञान। आयुर्वेद और लोकप्रिय मंत्रों का स्रोत।")
        ));
        v.setStructures(List.of(
                lt("en", "20 Kandas (books). Kandas 1-7 are the oldest. Contains charms (Atharvangirasa), healing hymns, philosophical dialogues, and royal consecration rituals (Rajasuya)."),
                lt("hi", "20 कांड। कांड 1-7 सबसे प्राचीन। अथर्वांगिरस मंत्र, औषधि सूक्त, दार्शनिक संवाद, राजसूय विधि।")
        ));
        v.setHistoricalContexts(List.of(
                lt("en", "Represents the folk and popular traditions absorbed into the Vedic corpus. Reflects the lives of common people — farmers, healers, householders — not just the priestly elite."),
                lt("hi", "लोक परंपराओं का वैदिक संग्रह में समावेश। सामान्य लोगों — किसान, वैद, गृहस्थ — का जीवन, केवल पुजारी वर्ग नहीं।")
        ));
        v.setPeriods(lt("en", "c. 1200–900 BCE", "hi", "लगभग 1200–900 ईसा पूर्व"));
        v.setDivisionNames(lt("en", "Kanda", "hi", "कांड"));
        v.setDivisionCount(20);
        v.setMantraCount(6000);
        v.setCompositionTypes(lt("en", "Hymns, charms, spells, and prose formulas", "hi", "सूक्त, मंत्र, टोने-टोटके, गद्य सूत्र"));
        v.setBranches(lt("en", "Shaunakiya (most recited) and Paippalada shakhas.", "hi", "शौनकीय (सर्वाधिक पाठ) और पैप्पलाद शाखा।"));
        v.setPrimaryDeities(List.of("Agni", "Indra", "Soma", "Rudra", "Yama", "Matarishvan", "Bhumi", "Prithvi"));
        v.setKeyThemes(lt("en", "Healing and medicine (Ayurveda origins)|Protection mantras|Marriage and family rituals|Royal consecration|Philosophical inquiry (Prithvi Sukta)|Daily household rites|Liberation (Moksha) concepts", "hi", "चिकित्सा (आयुर्वेद की उत्पत्ति)|रक्षा मंत्र|विवाह संस्कार|राजाभिषेक|दार्शनिक सूक्त (पृथ्वी सूक्त)|गृह्य कर्म|मोक्ष की अवधारणा"));
        v.setFamousSages(lt("en", "Atharvan|Angiras|Bhrigu|Kashyapa|Dadhyang Atharvana", "hi", "अथर्वा|अंगिरस|भृगु|कश्यप|दध्यङ् अथर्वण"));
        v.setSpecialFeatures(List.of(
                lt("en", "Contains the Prithvi Sukta (Hymn to Earth) — an ancient environmental hymn. Many Ayurvedic healing mantras originate here. The Mundaka Upanishad belongs to this tradition."),
                lt("hi", "पृथ्वी सूक्त (पृथ्वी की स्तुति) — प्राचीन पर्यावरण सूक्त। अनेक आयुर्वेदिक मंत्र यहाँ से। मुण्डक उपनिषद् इसी परंपरा की है।")
        ));
        v.setChapterCount(1);
        v.setVerseCount(2);
        VedaDeepContent.apply(v);
        return v;
    }

    // ─── Helpers ───────────────────────────────────────────────

    private Veda baseVeda(String slug, int order, String sanskrit, String transliteration,
                          String enDesc, String hiDesc) {
        return baseVeda(slug, order, sanskrit, transliteration, enDesc, hiDesc,
                "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800");
    }

    private Veda baseVeda(String slug, int order, String sanskrit, String transliteration,
                          String enDesc, String hiDesc, String coverUrl) {
        Veda v = new Veda();
        v.setSlug(slug);
        v.setOrder(order);
        v.setSanskritName(sanskrit);
        v.setTransliteration(transliteration);
        v.setTitles(List.of(
                lt("en", transliteration), lt("hi", sanskrit), lt("sa", sanskrit)));
        v.setDescriptions(List.of(lt("en", enDesc), lt("hi", hiDesc)));
        v.setCoverImageUrl(coverUrl);
        v.setActive(true);
        return v;
    }

    private LocalizedText lt(String code, String text) { return new LocalizedText(code, text); }

    private List<LocalizedText> lt(String en, String enText, String hi, String hiText) {
        return List.of(lt(en, enText), lt(hi, hiText));
    }

    private List<LocalizedText> lt(String en, String enText, String hi, String hiText, String sa, String saText) {
        return List.of(lt(en, enText), lt(hi, hiText), lt(sa, saText));
    }

    // ─── Chapters & Verses (sample per Veda) ───────────────────

    private Chapter seedRigvedaChapter(ChapterRepository repo, String vedaId) {
        return repo.save(buildChapter(vedaId, 1, "अग्नि सूक्त", "Agni Sukta",
                "Hymn to Agni", "अग्नि सूक्त", "The opening hymn of the Rigveda, invoking Agni.",
                "ऋग्वेद का प्रारंभिक सूक्त, अग्नि का आह्वान।", 3, 1));
    }

    private Chapter seedSamavedaChapter(ChapterRepository repo, String vedaId) {
        return repo.save(buildChapter(vedaId, 1, "पवमान सोम", "Pavamana Soma",
                "Purification Hymn to Soma", "पवमान सोम", "Chant for the purification of Soma during sacrifice.",
                "यज्ञ में सोम के पवित्रीकरण का गान।", 2, 2));
    }

    private Chapter seedYajurvedaChapter(ChapterRepository repo, String vedaId) {
        return repo.save(buildChapter(vedaId, 1, "अग्न्याधान", "Agniyadhana",
                "Establishing the Sacred Fire", "अग्न्याधान", "Ritual formulas for establishing the sacrificial fire.",
                "यज्ञ अग्नि स्थापना के मंत्र।", 2, 3));
    }

    private Chapter seedAtharvavedaChapter(ChapterRepository repo, String vedaId) {
        return repo.save(buildChapter(vedaId, 1, "प्रथमा कांड", "Prathama Kanda",
                "First Book — Hymn to Vach", "प्रथमा कांड", "Opening hymns on speech, breath, and life force.",
                "वाक्, प्राण और जीवन शक्ति के प्रारंभिक सूक्त।", 2, 4));
    }

    private Chapter buildChapter(String vedaId, int num, String sanskrit, String transliteration,
                                 String enTitle, String hiTitle, String enSummary, String hiSummary,
                                 int verseCount, int mediaOffset) {
        Chapter c = new Chapter();
        c.setVedaId(vedaId);
        c.setNumber(num);
        c.setSanskritName(sanskrit);
        c.setTransliteration(transliteration);
        c.setTitles(List.of(lt("en", enTitle), lt("hi", hiTitle), lt("sa", sanskrit)));
        c.setSummaries(List.of(lt("en", enSummary), lt("hi", hiSummary)));
        c.setVerseCount(verseCount);
        c.setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + mediaOffset + ".mp3");
        c.setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
        c.setDurationSeconds(180);
        return c;
    }

    private void seedRigvedaVerses(VerseRepository repo, String vedaId, String chapterId) {
        repo.saveAll(List.of(
                verse(vedaId, chapterId, 1, "अग्निमीळे पुरोहितं यज्ञस्य देवं ऋत्विजम् ।", "Agnim īḷe purohitaṃ yajñasya devaṃ ṛtvijam",
                        "I praise Agni, the chosen priest, god, minister of sacrifice.", "मैं अग्नि की स्तुति करता हूँ, यज्ञ के देव।",
                        "Establishes Agni as divine mediator between humans and gods."),
                verse(vedaId, chapterId, 2, "होतारं रत्नधातमम् ।", "Hotāraṃ ratnadhātamam",
                        "The invoker, bestower of jewels.", "होता, रत्नों के दाता।",
                        "Agni as the hotar who invokes the gods and grants treasures."),
                verse(vedaId, chapterId, 3, "अग्निः पूर्वेभिर्ऋषिभिरीड्यो नूतनैरुत ।", "Agniḥ pūrvebhir ṛṣibhir īḍyo nūtanair uta",
                        "Agni, worthy of praise by ancient and modern sages alike.", "अग्नि, प्राचीन और नवीन ऋषियों द्वारा स्तुत्य।",
                        "The timeless reverence for Agni across generations of rishis.")
        ));
    }

    private void seedSamavedaVerses(VerseRepository repo, String vedaId, String chapterId) {
        repo.saveAll(List.of(
                verse(vedaId, chapterId, 1, "इन्द्रः सोमं पिबतु शुचिः ।", "Indraḥ somaṃ pibatu śuciḥ",
                        "May Indra drink the purified Soma.", "इन्द्र शुद्ध सोम का पान करें।",
                        "Musical invocation during Soma pressing ceremony."),
                verse(vedaId, chapterId, 2, "पवमानः सोमो अद्रिभिः ।", "Pavamānaḥ somo adribhiḥ",
                        "Soma flows purified over the stones.", "सोम पत्थरों पर पवित्र होकर बहता है।",
                        "The flowing Soma represents divine inspiration and bliss.")
        ));
    }

    private void seedYajurvedaVerses(VerseRepository repo, String vedaId, String chapterId) {
        repo.saveAll(List.of(
                verse(vedaId, chapterId, 1, "अग्ने नय सुपथा राये अस्मान् ।", "Agne naya supathā rāye asmān",
                        "O Agni, lead us on the good path to prosperity.", "हे अग्नि, हमें समृद्धि के शुभ मार्ग पर ले चलो।",
                        "Opening formula for establishing the sacred fire altar."),
                verse(vedaId, chapterId, 2, "विश्वानि देव सवितर्दुरितानि परा सुव ।", "Viśvāni deva savitar duritāni parā suva",
                        "O divine Savitar, drive away all evil.", "हे देव सविता, समस्त बुराइयों को दूर करो।",
                        "Purification mantra before beginning the yajna ritual.")
        ));
    }

    private void seedAtharvavedaVerses(VerseRepository repo, String vedaId, String chapterId) {
        repo.saveAll(List.of(
                verse(vedaId, chapterId, 1, "वाचं कीर्तय पुनः ।", "Vācaṃ kīrtaya punaḥ",
                        "Praise speech again and again.", "वाक् की बार-बार स्तुति करो।",
                        "Celebrates Vak (speech) as a divine creative force."),
                verse(vedaId, chapterId, 2, "शतमानं भवति सहस्रधारा ।", "Śatamānaṃ bhavati sahasradhārā",
                        "A hundred-fold stream becomes a thousand-fold.", "शतधा धारा सहस्रधा हो जाती है।",
                        "Metaphor for the multiplying power of sacred speech and mantra.")
        ));
    }

    private Verse verse(String vedaId, String chapterId, int num, String sanskrit,
                        String transliteration, String enTrans, String hiTrans, String enCommentary) {
        Verse v = new Verse();
        v.setVedaId(vedaId);
        v.setChapterId(chapterId);
        v.setNumber(num);
        v.setSanskrit(sanskrit);
        v.setTransliteration(transliteration);
        v.setTranslations(List.of(lt("en", enTrans), lt("hi", hiTrans), lt("sa", sanskrit)));
        v.setCommentaries(List.of(lt("en", enCommentary), lt("hi", enCommentary)));
        v.setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-" + num + ".mp3");
        v.setAudioDurationSeconds(30 + num * 10);
        return v;
    }

    private void seedRigvedaMedia(MediaRepository repo, String vedaId, String chapterId) {
        seedMedia(repo, vedaId, chapterId, "Rigveda - Agni Sukta Chanting", "Pandit Sharma", "Traditional Vedic chanting of the Agni Sukta.");
    }

    private void seedSamavedaMedia(MediaRepository repo, String vedaId, String chapterId) {
        seedMedia(repo, vedaId, chapterId, "Samaveda - Pavamana Soma Chant", "Guru Ravishankar", "Melodic Sama chanting of the Pavamana Soma hymn.");
    }

    private void seedYajurvedaMedia(MediaRepository repo, String vedaId, String chapterId) {
        seedMedia(repo, vedaId, chapterId, "Yajurveda - Agniyadhana Recitation", "Acharya Vidyasagar", "Ritual formula recitation for fire establishment.");
    }

    private void seedAtharvavedaMedia(MediaRepository repo, String vedaId, String chapterId) {
        seedMedia(repo, vedaId, chapterId, "Atharvaveda - Vach Sukta", "Dr. Pushpa Dixit", "Healing and speech hymns from the first Kanda.");
    }

    private void seedMedia(MediaRepository repo, String vedaId, String chapterId,
                           String title, String reciter, String enDesc) {
        MediaAsset audio = new MediaAsset();
        audio.setTitle(title);
        audio.setType(MediaAsset.MediaType.AUDIO);
        audio.setVedaId(vedaId);
        audio.setChapterId(chapterId);
        audio.setUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
        audio.setThumbnailUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400");
        audio.setDurationSeconds(180);
        audio.setLanguageCode("sa");
        audio.setReciter(reciter);
        audio.setDescriptions(List.of(lt("en", enDesc), lt("hi", enDesc)));
        audio.setFeatured(true);
        repo.save(audio);

        MediaAsset video = new MediaAsset();
        video.setTitle(title + " — Video");
        video.setType(MediaAsset.MediaType.VIDEO);
        video.setVedaId(vedaId);
        video.setChapterId(chapterId);
        video.setUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
        video.setThumbnailUrl("https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400");
        video.setDurationSeconds(596);
        video.setLanguageCode("hi");
        video.setReciter(reciter);
        video.setDescriptions(List.of(lt("en", "Visual recitation with Sanskrit text."), lt("hi", "संस्कृत पाठ के साथ दृश्य पाठ।")));
        video.setFeatured(true);
        repo.save(video);
    }
}
