package com.vedas.config;

import com.vedas.dto.QuizDto;
import com.vedas.dto.QuizQuestionDto;

import java.util.ArrayList;
import java.util.List;

/** Starter quizzes for Gyan topics and Gita (no certificates yet). */
public final class QuizCatalog {

    private QuizCatalog() {}

    public static List<QuizDto> all() {
        List<QuizDto> quizzes = new ArrayList<>();
        quizzes.add(dharmaBasics());
        quizzes.add(karmaBasics());
        quizzes.add(gitaHighlights());
        quizzes.add(mokshaBasics());
        quizzes.add(deityBasics());
        return quizzes;
    }

    private static QuizDto dharmaBasics() {
        QuizDto q = new QuizDto();
        q.setId("dharma-basics");
        q.setTitle("Dharma Basics");
        q.setDescription("Core ideas of Sanatan Dharma for beginners.");
        q.setTopicSlug("sanatan-dharma");
        q.setLevel("BEGINNER");
        q.setQuestions(List.of(
                question("q1", "What does Dharma primarily mean in the Gita context?",
                        List.of("Blind ritual", "Duty, truth, and righteousness", "Only temple worship", "Caste alone"),
                        1, "Dharma guides right action and cosmic order.", "Bhagavad Gita"),
                question("q2", "Sanatan Dharma literally points to:",
                        List.of("A single book", "An eternal way of living and knowing", "Only medieval customs", "A political party"),
                        1, "Sanatan means eternal — the living tradition of dharma.", "Sanatan Dharma"),
                question("q3", "Which of these is a core aim of human life in classical teaching?",
                        List.of("Moksha", "Endless wealth only", "Fame", "Avoiding all action"),
                        0, "Purusharthas include dharma, artha, kama, and moksha.", "Moksha")
        ));
        return q;
    }

    private static QuizDto karmaBasics() {
        QuizDto q = new QuizDto();
        q.setId("karma-yoga");
        q.setTitle("Karma Yoga");
        q.setDescription("Action without attachment — Gita chapter 2–3 themes.");
        q.setTopicSlug("karma");
        q.setLevel("BEGINNER");
        q.setQuestions(List.of(
                question("q1", "Gita 2.47 teaches that you have a right to:",
                        List.of("Results only", "Action, not the fruits", "Inaction always", "Others' duties"),
                        1, "Karmanyevaadhikaraste — duty without clinging to outcomes.", "Gita 2.47"),
                question("q2", "Karma Yoga means:",
                        List.of("Avoiding all work", "Selfish ambition", "Skillful action as offering", "Only physical exercise"),
                        2, "Perform duty as worship, without egoistic craving.", "Gita 3"),
                question("q3", "Attachment to results tends to produce:",
                        List.of("Equanimity", "Anxiety and bondage", "Instant moksha", "No karma at all"),
                        1, "Clinging binds the mind; dedicated action frees it.", "Gita 2")
        ));
        return q;
    }

    private static QuizDto gitaHighlights() {
        QuizDto q = new QuizDto();
        q.setId("gita-highlights");
        q.setTitle("Gita Highlights");
        q.setDescription("Famous verses and themes from the Bhagavad Gita.");
        q.setTopicSlug("gita-intro");
        q.setLevel("BEGINNER");
        q.setQuestions(List.of(
                question("q1", "Who is the charioteer advising Arjuna?",
                        List.of("Bhishma", "Krishna", "Drona", "Vyasa"),
                        1, "Krishna teaches Arjuna on the battlefield of Kurukshetra.", "Gita 1–2"),
                question("q2", "Gita 4.7 says the Divine manifests when:",
                        List.of("Dharma declines", "Only during festivals", "Never", "Only for kings"),
                        0, "Yada yada hi dharmasya — when dharma wanes, the Lord appears.", "Gita 4.7"),
                question("q3", "Gita 18.66 emphasizes:",
                        List.of("Only ritual purity", "Surrender to the Divine", "Rejecting all teachers", "War for its own sake"),
                        1, "Sarva-dharman parityajya — take refuge in Me alone.", "Gita 18.66"),
                question("q4", "How many chapters are in the Bhagavad Gita?",
                        List.of("10", "12", "18", "24"),
                        2, "Eighteen chapters spanning karma, bhakti, and jnana.", "Bhagavad Gita")
        ));
        return q;
    }

    private static QuizDto mokshaBasics() {
        QuizDto q = new QuizDto();
        q.setId("moksha-basics");
        q.setTitle("Moksha & Rebirth");
        q.setDescription("Liberation and the journey of the soul.");
        q.setTopicSlug("moksha");
        q.setLevel("BEGINNER");
        q.setQuestions(List.of(
                question("q1", "Moksha primarily means:",
                        List.of("Worldly success", "Freedom from the cycle of birth and death", "Temple donation only", "Political power"),
                        1, "Moksha is liberation from samsara.", "Upanishads / Gita"),
                question("q2", "Gita 2.22 compares the soul changing bodies to:",
                        List.of("Changing clothes", "Changing kingdoms", "Changing seasons only", "Changing languages"),
                        0, "Like worn-out clothes, the embodied soul takes new ones.", "Gita 2.22"),
                question("q3", "Which path is NOT one of the classical yogas in the Gita?",
                        List.of("Karma Yoga", "Bhakti Yoga", "Jnana Yoga", "Shopping Yoga"),
                        3, "Karma, bhakti, and jnana are the classic triad.", "Gita")
        ));
        return q;
    }

    private static QuizDto deityBasics() {
        QuizDto q = new QuizDto();
        q.setId("deity-basics");
        q.setTitle("Deities & Festivals");
        q.setDescription("Quick checks on major deities and celebrations.");
        q.setTopicSlug("sanatan-dharma");
        q.setLevel("BEGINNER");
        q.setQuestions(List.of(
                question("q1", "Who is called Vighnaharta?",
                        List.of("Surya", "Ganesha", "Indra", "Varuna"),
                        1, "Ganesha removes obstacles at beginnings.", "Ganesha"),
                question("q2", "Janmashtami celebrates the birth of:",
                        List.of("Rama", "Krishna", "Hanuman", "Buddha"),
                        1, "Janmashtami marks Krishna’s birth.", "Janmashtami"),
                question("q3", "Maha Shivaratri is primarily dedicated to:",
                        List.of("Lakshmi", "Shiva", "Saraswati", "Kartikeya"),
                        1, "The great night of Shiva.", "Maha Shivaratri")
        ));
        return q;
    }

    private static QuizQuestionDto question(String id, String prompt, List<String> options,
                                            int correctIndex, String explanation, String scriptureRef) {
        QuizQuestionDto q = new QuizQuestionDto();
        q.setId(id);
        q.setPrompt(prompt);
        q.setOptions(options);
        q.setCorrectIndex(correctIndex);
        q.setExplanation(explanation);
        q.setScriptureRef(scriptureRef);
        return q;
    }
}
