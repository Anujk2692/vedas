package com.vedas.config;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Authentic Vedic chanting audio & video from Internet Archive (public domain / CC).
 * Traditional patha with clear Sanskrit pronunciation.
 */
public final class VedicMediaLibrary {

    private VedicMediaLibrary() {}

    public static final String RIGVEDA_ARCHIVE = "RigvedaChanting";
    public static final String SAMAVEDA_ARCHIVE = "samaveda_202106";
    public static final String YAJURVEDA_ARCHIVE = "suklayajurveda_202107";
    public static final String YAJURVEDA_ALT_ARCHIVE = "krishnayajurveda_202106";
    public static final String SUKTAS_ARCHIVE = "VedicChantings";
    public static final String SACRED_CHANTS_ARCHIVE = "sacred-vedic-chants-of-india";

    public static final String RECITER_VEDA_PRASARA = "Veda Prasara Samithi";
    public static final String RECITER_CHALLAKERE = "Challakere Brothers (MS Venugopal & Srinivasan)";
    public static final String RECITER_PARASURAMA = "Brahmasri Parasurama Sastri & disciples";

    private static final String[] IGNCA_VIDEOS = {
            "dni.ncaa.IGNCA-IG_08_DV_60_345-MDV/IGNCA-IG_08_DV_60_345-MDV.mp4",
            "dni.ncaa.IGNCA-IG_08_DV_60_347-MDV/IGNCA-IG_08_DV_60_347-MDV.mp4",
            "dni.ncaa.IGNCA-IG_13_DV_60_878-MDV/IGNCA-IG_13_DV_60_878-MDV.mp4",
            "dni.ncaa.IGNCA-IG_13_DV_60_882-MDV/IGNCA-IG_13_DV_60_882-MDV.mp4",
            "dni.ncaa.IGNCA-IG_13_DV_60_883-MDV/IGNCA-IG_13_DV_60_883-MDV.mp4",
            "dni.ncaa.IGNCA-IG_11_DV_60_1275-MDV/IGNCA-IG_11_DV_60_1275-MDV.mp4",
            "dni.ncaa.IGNCA-IG_08_DV_60_741-MDV/IGNCA-IG_08_DV_60_741-MDV.mp4",
            "dni.ncaa.IGNCA-IG_11_DV_60_1309-MDV/IGNCA-IG_11_DV_60_1309-MDV.mp4"
    };

    private static final String[] SUKTAM_FILES = {
            "Aa No Bhadra Suktam.mp3",
            "Balittha Suktam.mp3",
            "Bhagya Suktam.mp3",
            "Bhoo Suktam.mp3",
            "Dashashanti Mantrah.mp3",
            "Devi Suktam.mp3",
            "Doorva Suktam.mp3",
            "Durga Suktam.mp3",
            "Ganeshatharvasheersham.mp3",
            "Go Suktam.mp3",
            "Mantrapushpam.mp3",
            "Medha Suktam.mp3",
            "Narayana Suktam.mp3",
            "Neela Suktam.mp3",
            "Purusha Suktam.mp3",
            "Ratri Suktam.mp3",
            "Saraswati Suktam.mp3",
            "Shantimantrah.mp3",
            "Shraddha Suktam.mp3",
            "Sivopasana.mp3",
            "Sri Suktam.mp3",
            "Swasti No Mimeetam Suktam.mp3",
            "Vishnu Suktam.mp3"
    };

    public static boolean isPlaceholderUrl(String url) {
        if (url == null || url.isBlank()) {
            return true;
        }
        String lower = url.toLowerCase();
        return lower.contains("soundhelix")
                || lower.contains("bigbuckbunny")
                || lower.contains("placeholder");
    }

    public static String chapterAudioUrl(String vedaSlug, int chapterNumber) {
        return switch (vedaSlug) {
            case "rigveda" -> archiveDownload(RIGVEDA_ARCHIVE,
                    String.format("Rigveda Part %03d.mp3", Math.min(chapterNumber, 54)));
            case "samaveda" -> archiveDownload(SAMAVEDA_ARCHIVE,
                    chapterNumber == 1 ? "Sama Veda 001.mp3" : "Sama Veda 002.mp3");
            case "yajurveda" -> archiveDownload(YAJURVEDA_ARCHIVE,
                    String.format("Suklayajurveda Part %03d.mp3", Math.min(chapterNumber, 54)));
            case "atharvaveda" -> archiveDownload(SUKTAS_ARCHIVE,
                    SUKTAM_FILES[(chapterNumber - 1) % SUKTAM_FILES.length]);
            default -> archiveDownload(SACRED_CHANTS_ARCHIVE,
                    "Sacred Vedic Chants of India/01-Asvamedha.mp3");
        };
    }

    public static String chapterVideoUrl(String vedaSlug, int chapterNumber) {
        int idx = switch (vedaSlug) {
            case "rigveda" -> chapterNumber - 1;
            case "samaveda" -> 1 + chapterNumber;
            case "yajurveda" -> 3 + chapterNumber;
            case "atharvaveda" -> 5 + chapterNumber;
            default -> 0;
        };
        String path = IGNCA_VIDEOS[Math.floorMod(idx, IGNCA_VIDEOS.length)];
        return archiveDownload(path.substring(0, path.indexOf('/')), path.substring(path.indexOf('/') + 1));
    }

    public static String verseAudioUrl(String vedaSlug, int chapterNumber, int verseNumber, String suktaRef) {
        if (suktaRef != null) {
            String ref = suktaRef.toLowerCase();
            if (ref.contains("3.62") || ref.contains("gayatri")) {
                return archiveDownload(SUKTAS_ARCHIVE, "Purusha Suktam.mp3");
            }
            if (ref.contains("10.90") || ref.contains("purusha")) {
                return archiveDownload(SUKTAS_ARCHIVE, "Purusha Suktam.mp3");
            }
            if (ref.contains("rudra") || ref.contains("16.")) {
                return archiveDownload(SUKTAS_ARCHIVE, "Sivopasana.mp3");
            }
            if (ref.contains("durga") || ref.contains("av ")) {
                return archiveDownload(SUKTAS_ARCHIVE, "Durga Suktam.mp3");
            }
        }
        if ("atharvaveda".equals(vedaSlug)) {
            return archiveDownload(SUKTAS_ARCHIVE,
                    SUKTAM_FILES[(verseNumber + chapterNumber - 2) % SUKTAM_FILES.length]);
        }
        return chapterAudioUrl(vedaSlug, chapterNumber);
    }

    public static String verseVideoUrl(String vedaSlug, int chapterNumber) {
        return chapterVideoUrl(vedaSlug, chapterNumber);
    }

    public static int chapterAudioDuration(String vedaSlug, int chapterNumber) {
        return switch (vedaSlug) {
            case "rigveda" -> 2700;
            case "samaveda" -> chapterNumber == 1 ? 3600 : 4200;
            case "yajurveda" -> 2400;
            case "atharvaveda" -> 600;
            default -> 1800;
        };
    }

    public static int chapterVideoDuration(int chapterNumber) {
        return 1900 + (chapterNumber * 30);
    }

    public static int verseAudioDuration(String vedaSlug) {
        return "atharvaveda".equals(vedaSlug) ? 480 : 900;
    }

    public static String chapterReciter(String vedaSlug) {
        return switch (vedaSlug) {
            case "rigveda", "samaveda", "yajurveda" -> RECITER_VEDA_PRASARA;
            case "atharvaveda" -> RECITER_CHALLAKERE;
            default -> RECITER_PARASURAMA;
        };
    }

    public static String pronunciationDescription(String vedaSlug) {
        return switch (vedaSlug) {
            case "rigveda" -> "Traditional Rigveda Samhita patha — clear Sanskrit pronunciation, Veda Prasara Samithi.";
            case "samaveda" -> "Authentic Sama Veda chanting with proper svara (musical notes).";
            case "yajurveda" -> "Shukla Yajurveda ritual patha — precise adhvaryu pronunciation.";
            case "atharvaveda" -> "Classical sukta chanting — pure pronunciation by master chanters.";
            default -> "Traditional Vedic patha with clear Sanskrit recitation.";
        };
    }

    public static String videoDescription(String vedaSlug) {
        return "Documentary Vedic chanting video — watch traditional brahmin patha with clear pronunciation. "
                + pronunciationDescription(vedaSlug);
    }

    public static String archiveDownload(String identifier, String filename) {
        try {
            return "https://archive.org/download/" + identifier + "/"
                    + URLEncoder.encode(filename, StandardCharsets.UTF_8).replace("+", "%20");
        } catch (Exception e) {
            return "https://archive.org/download/" + identifier + "/" + filename.replace(" ", "%20");
        }
    }

    public static List<String> allFeaturedAudioUrls() {
        return List.of(
                chapterAudioUrl("rigveda", 1),
                chapterAudioUrl("rigveda", 3),
                chapterAudioUrl("samaveda", 1),
                chapterAudioUrl("yajurveda", 1),
                chapterAudioUrl("yajurveda", 10),
                chapterAudioUrl("atharvaveda", 1),
                archiveDownload(SUKTAS_ARCHIVE, "Purusha Suktam.mp3"),
                archiveDownload(SUKTAS_ARCHIVE, "Sivopasana.mp3")
        );
    }
}
