import {useNavigation} from '@react-navigation/native';
import type {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import type {CompositeNavigationProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {DEV_MACHINE_IP, getApiHost, getDefaultApiHost, setApiHost, testApiConnection} from '../api/config';
import {clearAllApiCache} from '../api/cache';
import {LanguagePicker} from '../components/LanguagePicker';
import {SanskritText} from '../components/SanskritText';
import {AppLogo} from '../components/ui/AppLogo';
import {useLanguage} from '../context/LanguageContext';
import {
  useUserPreferences,
  type PlaybackRate,
  type ReadingFontScale,
} from '../context/UserPreferencesContext';
import type {RootStackParamList, TabParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

const FONT_OPTIONS: {key: ReadingFontScale; label: string}[] = [
  {key: 'normal', label: 'Normal'},
  {key: 'large', label: 'Large'},
  {key: 'xlarge', label: 'Extra Large'},
];

const RATE_OPTIONS: {key: PlaybackRate; label: string}[] = [
  {key: 0.75, label: '0.75x'},
  {key: 1, label: '1x'},
  {key: 1.25, label: '1.25x'},
];

function SettingsSection({title, children}: {title: string; children: React.ReactNode}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function SettingsScreen() {
  const navigation = useNavigation<
    CompositeNavigationProp<
      BottomTabNavigationProp<TabParamList, 'Settings'>,
      NativeStackNavigationProp<RootStackParamList>
    >
  >();
  const {language, languages} = useLanguage();
  const {
    favorites,
    removeFavorite,
    readingFontScale,
    setReadingFontScale,
    playbackRate,
    setPlaybackRate,
  } = useUserPreferences();
  const [showPicker, setShowPicker] = useState(false);
  const [apiHost, setApiHostState] = useState(getDefaultApiHost());
  const [saved, setSaved] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);
  const current = languages.find(l => l.code === language);

  useEffect(() => {
    getApiHost().then(setApiHostState);
  }, []);

  const saveApiHost = async () => {
    await setApiHost(apiHost);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const runConnectionTest = async () => {
    setTesting(true);
    setConnectionStatus(null);
    const result = await testApiConnection(apiHost);
    setConnectionStatus(result.ok ? `✓ ${result.message}` : `✗ ${result.message}`);
    setTesting(false);
  };

  const clearCache = async () => {
    await clearAllApiCache();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SettingsSection title="Reading">
        <View style={styles.card}>
          <Text style={styles.label}>Text Size</Text>
          <Text style={styles.hint}>Larger Sanskrit text for comfortable daily reading</Text>
          <View style={styles.optionRow}>
            {FONT_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                style={[styles.optionBtn, readingFontScale === opt.key && styles.optionBtnActive]}
                onPress={() => setReadingFontScale(opt.key)}>
                <Text
                  style={[
                    styles.optionBtnText,
                    readingFontScale === opt.key && styles.optionBtnTextActive,
                  ]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>
            Select any verse, aarti line, or description while reading. Tap Translate & Listen to
            hear it in your chosen app language.
          </Text>
        </View>
      </SettingsSection>

      <SettingsSection title="Audio">
        <View style={styles.card}>
          <Text style={styles.label}>Default Playback Speed</Text>
          <Text style={styles.hint}>Use 0.75x to learn pronunciation syllable by syllable</Text>
          <View style={styles.optionRow}>
            {RATE_OPTIONS.map(opt => (
              <Pressable
                key={opt.key}
                style={[styles.optionBtn, playbackRate === opt.key && styles.optionBtnActive]}
                onPress={() => setPlaybackRate(opt.key)}>
                <Text
                  style={[
                    styles.optionBtnText,
                    playbackRate === opt.key && styles.optionBtnTextActive,
                  ]}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </SettingsSection>

      <SettingsSection title={`Saved Mantras (${favorites.length})`}>
        {favorites.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.emptyFavIcon}>🤍</Text>
            <Text style={styles.hint}>
              Tap the heart on any verse while reading to save your favorite mantras here.
            </Text>
          </View>
        ) : (
          favorites.map(item => (
            <View key={item.id} style={styles.favCard}>
              <Pressable
                style={styles.favMain}
                onPress={() =>
                  navigation.navigate('ChapterReader', {
                    chapterId: item.chapterId,
                    title: item.subtitle ?? item.title,
                    vedaTitle: item.vedaTitle,
                  })
                }>
                <Text style={styles.favTitle}>{item.title}</Text>
                {item.sanskrit ? (
                  <SanskritText
                    text={item.sanskrit}
                    style={styles.favSanskrit}
                    size={16}
                    selectable={false}
                    numberOfLines={2}
                  />
                ) : null}
                {item.vedaTitle && <Text style={styles.favMeta}>{item.vedaTitle}</Text>}
              </Pressable>
              <Pressable onPress={() => removeFavorite(item.id)} style={styles.favRemove}>
                <Text style={styles.favRemoveText}>✕</Text>
              </Pressable>
            </View>
          ))
        )}
      </SettingsSection>

      <SettingsSection title="Preferences">
        <Pressable
          style={({pressed}) => [styles.card, styles.langCard, pressed && styles.pressed]}
          onPress={() => setShowPicker(true)}>
          <View>
            <Text style={styles.label}>Content Language</Text>
            <Text style={styles.hint}>Translations and media descriptions</Text>
          </View>
          <View style={styles.langValueWrap}>
            <Text style={styles.langValue}>{current?.nativeName ?? language}</Text>
            <Text style={styles.langChevron}>›</Text>
          </View>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.label}>Backend Server</Text>
          <Text style={styles.hint}>
            Simulator: use localhost. Physical iPhone: use your Mac's LAN IP (e.g. {DEV_MACHINE_IP})
          </Text>
          <TextInput
            style={styles.input}
            value={apiHost}
            onChangeText={setApiHostState}
            placeholder={getDefaultApiHost()}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            style={({pressed}) => [styles.saveBtn, pressed && styles.pressed]}
            onPress={saveApiHost}>
            <Text style={styles.saveBtnText}>{saved ? 'Saved ✓' : 'Save Server Address'}</Text>
          </Pressable>
          <Pressable
            style={({pressed}) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={runConnectionTest}
            disabled={testing}>
            <Text style={styles.secondaryBtnText}>
              {testing ? 'Testing…' : 'Test Connection'}
            </Text>
          </Pressable>
          {connectionStatus ? (
            <Text
              style={[
                styles.connectionStatus,
                connectionStatus.startsWith('✓') ? styles.connectionOk : styles.connectionFail,
              ]}>
              {connectionStatus}
            </Text>
          ) : null}
          <Text style={styles.hint}>
            Cached scriptures, aartis, and hub data work offline after first load. Clear cache to
            refresh from the server.
          </Text>
          <Pressable
            style={({pressed}) => [styles.secondaryBtn, pressed && styles.pressed]}
            onPress={clearCache}>
            <Text style={styles.secondaryBtnText}>
              {cacheCleared ? 'Cache Cleared ✓' : 'Clear App Cache'}
            </Text>
          </Pressable>
        </View>
      </SettingsSection>

      <View style={styles.aboutCard}>
        <View style={styles.aboutLogoWrap}>
          <AppLogo size={72} showRing={false} />
        </View>
        <Text style={styles.label}>Sanatan Gyan</Text>
        <SanskritText text="सनातन ज्ञान" style={styles.aboutSanskrit} size={18} />
        <Text style={styles.about}>
          Explore Vedas, Gita, Ramayana, Upanishads and more — with study paths, AI Guru,
          aartis, audio patha, and daily shlok. Save favorites and continue reading where you left off.
        </Text>
        <Text style={styles.version}>Version 1.2.0</Text>
      </View>

      <LanguagePicker visible={showPicker} onClose={() => setShowPicker(false)} />
    </ScrollView>
  );
}

const cardShadow = shadows.sm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 160,
  },
  section: {marginBottom: spacing.sm},
  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...cardShadow,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  langValueWrap: {flexDirection: 'row', alignItems: 'center', gap: 4},
  langValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  langChevron: {fontSize: 22, color: colors.textMuted},
  favCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...cardShadow,
  },
  favMain: {
    flex: 1,
    padding: spacing.md,
  },
  favTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  favSanskrit: {
    color: colors.text,
    marginTop: 4,
  },
  favMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  favRemove: {
    padding: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  favRemoveText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyFavIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 6,
    lineHeight: 19,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  optionBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  optionBtnTextActive: {
    color: colors.white,
  },
  input: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  saveBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: '800',
  },
  secondaryBtn: {
    marginTop: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 14,
  },
  connectionStatus: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
  },
  connectionOk: {
    color: colors.primary,
  },
  connectionFail: {
    color: colors.error,
  },
  aboutCard: {
    backgroundColor: colors.tabActive,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  aboutLogoWrap: {
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  aboutSanskrit: {
    color: colors.primaryDark,
    marginTop: 4,
    textAlign: 'center',
  },
  about: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginTop: 8,
  },
  version: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  pressed: {opacity: 0.9},
});
