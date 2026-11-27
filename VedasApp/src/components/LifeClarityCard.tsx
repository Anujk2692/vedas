import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLanguage} from '../context/LanguageContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

interface ClarityTopic {
  id: string;
  icon: string;
  titleHi: string;
  titleEn: string;
  doubtHi: string;
  doubtEn: string;
  clarityHi: string;
  clarityEn: string;
  source: string;
}

const DAILY_CONTEMPLATIONS = [
  {
    quoteHi: 'जो बाहर खोजा जा रहा है, वह भीतर की स्पष्टता के बिना कभी नहीं मिलता।',
    quoteEn: 'What you seek outside cannot be found without clarity within.',
    takeawayHi: 'आज के निर्णय भय या तुलना से नहीं, शांत विवेक से लें।',
    takeawayEn: 'Make today’s choices from calm understanding, not fear or comparison.',
    source: 'Bhagavad Gita 2.48 · Samatva',
  },
  {
    quoteHi: 'मन को दबाना नहीं, मन को समझना ही सच्चा ध्यान है।',
    quoteEn: 'True meditation is not suppressing the mind—it is understanding it.',
    takeawayHi: 'अपने विचारों को बिना जज किए 5 मिनट केवल देखें।',
    takeawayEn: 'Observe your thoughts for 5 minutes today without judging them.',
    source: 'Katha Upanishad · Self-Observation',
  },
  {
    quoteHi: 'असली शक्ति किसी और को बदलने में नहीं, अपने अज्ञान को देखने में है।',
    quoteEn: 'Real strength lies not in controlling others, but in seeing through your own illusions.',
    takeawayHi: 'जहाँ क्रोध आए, वहाँ एक पल रुककर अपने भीतर के कारण को देखें।',
    takeawayEn: 'When anger rises, pause for one breath and look at the expectation behind it.',
    source: 'Bhagavad Gita 6.5 · Atma-Uddhar',
  },
];

const CLARITY_TOPICS: ClarityTopic[] = [
  {
    id: 'fear',
    icon: '🌊',
    titleHi: 'भय और चिंता',
    titleEn: 'Fear & Anxiety',
    doubtHi: 'भविष्य की चिंता और असफलता का डर मन को क्यों घेरे रहता है?',
    doubtEn: 'Why does fear of the future and failure keep disturbing the mind?',
    clarityHi:
      'भय हमेशा "मैं क्या खो दूँगा" की कल्पना से जन्म लेता है। गीता कहती है—आपका अधिकार केवल आज के ईमानदार कर्म पर है, परिणाम की कल्पना पर नहीं। जब ध्यान कर्म की गुणवत्ता पर आता है, चिंता स्वतः शांत हो जाती है।',
    clarityEn:
      'Fear is born when the mind clings to imagined outcomes. The Gita reminds us: you only own the clarity and honesty of today’s action—never the anxiety of tomorrow’s result.',
    source: 'Gita 2.47 · Nishkama Karma',
  },
  {
    id: 'relationships',
    icon: '🤝',
    titleHi: 'संबंध और मोह',
    titleEn: 'Relationships',
    doubtHi: 'प्रेम और मोह में क्या अंतर है? रिश्ते दुख क्यों देते हैं?',
    doubtEn: 'What is the difference between love and attachment? Why do relationships hurt?',
    clarityHi:
      'मोह कहता है—"तुम मेरे अनुसार चलो ताकि मुझे सुरक्षा मिले।" प्रेम कहता है—"तुम स्वतंत्र और सत्य में बढ़ो।" जब हम दूसरे से अपनी खालीपन भरने की अपेक्षा रखते हैं, तभी संबंध बोझ बनते हैं।',
    clarityEn:
      'Attachment demands control to feel secure; true love respects freedom and growth. Relationships hurt when we expect another person to cure our inner emptiness.',
    source: 'Brihadaranyaka Upanishad · Maitreyi Samvad',
  },
  {
    id: 'purpose',
    icon: '🧭',
    titleHi: 'करियर व उद्देश्य',
    titleEn: 'Purpose & Career',
    doubtHi: 'तुलना और भीड़ के दबाव से हटकर सही जीवन दिशा कैसे चुनें?',
    doubtEn: 'How do I find true purpose beyond social comparison and peer pressure?',
    clarityHi:
      'स्वधर्म का अर्थ है—आपकी अपनी प्रकृति और सत्य के अनुरूप कर्म। दूसरों की नकल से मिली सफलता भी भीतर खालीपन छोड़ती है। वह काम चुनें जो आपके विवेक को ऊँचा करे, केवल अहंकार को नहीं।',
    clarityEn:
      'Swadharma means acting from your own authentic understanding rather than borrowed ambitions. Borrowed success still leaves you restless; choose work that deepens clarity, not just ego.',
    source: 'Gita 3.35 & 18.47 · Swadharma',
  },
  {
    id: 'overthinking',
    icon: '🧠',
    titleHi: 'अति-चिंतन व क्रोध',
    titleEn: 'Overthinking & Ego',
    doubtHi: 'मन बार-बार एक ही बात क्यों दोहराता है और क्रोध क्यों आता है?',
    doubtEn: 'Why does the mind loop on the same thoughts and react in anger?',
    clarityHi:
      'अति-चिंतन और क्रोध दोनों "मैं सही हूँ / मेरी इच्छा पूरी हो" के अहंकार से चलते हैं। जब आप विचारों के साथ बहने के बजाय उनके साक्षी (Observer) बनते हैं, तो मन की पकड़ ढीली पड़ती है।',
    clarityEn:
      'Overthinking and anger are fueled by the ego’s demand for control. The moment you become the quiet observer of a thought instead of its servant, its grip dissolves.',
    source: 'Gita 6.26 & Vivekachudamani · Sakshi Bhava',
  },
];

interface Props {
  onAskGuru: () => void;
}

export function LifeClarityCard({onAskGuru}: Props) {
  const {language} = useLanguage();
  const {themeColors} = useUserPreferences();
  const isHi = language === 'hi' || language === 'sa';
  const [selectedId, setSelectedId] = useState<string>(CLARITY_TOPICS[0].id);

  const contemplation = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / 86_400_000) % DAILY_CONTEMPLATIONS.length;
    return DAILY_CONTEMPLATIONS[dayIndex];
  }, []);

  const activeTopic = useMemo(
    () => CLARITY_TOPICS.find(t => t.id === selectedId) ?? CLARITY_TOPICS[0],
    [selectedId],
  );

  return (
    <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.border}]}>
      <View style={styles.topBadgeRow}>
        <View style={[styles.badge, {backgroundColor: themeColors.tabActive}]}>
          <Text style={[styles.badgeText, {color: themeColors.primaryDark}]}>
            {isHi ? '✨ जीवन बोध · आज का चिंतन' : '✨ LIFE CLARITY · DAILY CONTEMPLATION'}
          </Text>
        </View>
      </View>

      <Text style={[styles.quote, {color: themeColors.text}]}>
        “{isHi ? contemplation.quoteHi : contemplation.quoteEn}”
      </Text>
      <Text style={[styles.takeaway, {color: themeColors.textSecondary}]}>
        {isHi ? contemplation.takeawayHi : contemplation.takeawayEn}
      </Text>
      <Text style={[styles.source, {color: themeColors.textMuted}]}>{contemplation.source}</Text>

      <View style={[styles.divider, {backgroundColor: themeColors.borderLight}]} />

      <Text style={[styles.sectionLabel, {color: themeColors.primaryDark}]}>
        {isHi ? 'जीवन के प्रश्न चुनें (तुरंत स्पष्टता):' : 'Choose a life question for instant clarity:'}
      </Text>

      <View style={styles.chipRow}>
        {CLARITY_TOPICS.map(topic => {
          const active = topic.id === activeTopic.id;
          return (
            <TouchableOpacity
              key={topic.id}
              activeOpacity={0.8}
              onPress={() => setSelectedId(topic.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? themeColors.primary : themeColors.surfaceElevated,
                  borderColor: active ? themeColors.primary : themeColors.border,
                },
              ]}>
              <Text
                style={[
                  styles.chipText,
                  {color: active ? colors.white : themeColors.textSecondary},
                ]}>
                {topic.icon} {isHi ? topic.titleHi : topic.titleEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.clarityBox, {backgroundColor: themeColors.surfaceElevated, borderColor: themeColors.borderLight}]}>
        <Text style={[styles.doubtText, {color: themeColors.primaryDark}]}>
          {isHi ? activeTopic.doubtHi : activeTopic.doubtEn}
        </Text>
        <Text style={[styles.clarityText, {color: themeColors.text}]}>
          {isHi ? activeTopic.clarityHi : activeTopic.clarityEn}
        </Text>
        <View style={styles.clarityFooter}>
          <Text style={[styles.topicSource, {color: themeColors.textMuted}]}>{activeTopic.source}</Text>
          <TouchableOpacity activeOpacity={0.85} onPress={onAskGuru} style={[styles.guruBtn, {backgroundColor: themeColors.primary}]}>
            <Text style={styles.guruBtnText}>
              {isHi ? 'AI गुरु से और पूछें →' : 'Ask AI Guru Deeper →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(196, 92, 0, 0.22)',
    ...shadows.md,
  },
  topBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.6,
  },
  quote: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 25,
    marginBottom: 6,
  },
  takeaway: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  source: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  clarityBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  doubtText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
    marginBottom: 6,
    lineHeight: 20,
  },
  clarityText: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 21,
    marginBottom: spacing.sm,
  },
  clarityFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  topicSource: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  guruBtn: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: borderRadius.full,
  },
  guruBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
