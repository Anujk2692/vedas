import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {api} from '../api/client';
import type {DailyShlok} from '../api/types';
import {SelectableReadableText} from './SelectableReadableText';
import {SanskritText} from './SanskritText';
import {useCachedFetch} from '../hooks/useCachedFetch';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {getMantraOfDay} from '../utils/mantraOfDay';

export function MantraOfDayCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const fetchShlok = useCallback(() => api.getDailyShlok(language), [language]);
  const {data: remote} = useCachedFetch<DailyShlok>(
    '/sanatan/daily-shlok',
    language,
    fetchShlok,
    [language],
  );
  const fallback = getMantraOfDay();
  const shlok = remote ?? {
    sanskrit: fallback.sanskrit,
    transliteration: fallback.transliteration,
    translation: fallback.translation,
    commentary: '',
    source: fallback.source,
    scriptureSlug: fallback.vedaSlug,
    theme: fallback.theme,
  };

  return (
    <View style={styles.card}>
      <View style={styles.decorCircle} />
      <View style={styles.header}>
        <Text style={styles.label}>आज का श्लोक</Text>
        <View style={styles.themePill}>
          <Text style={styles.theme}>{shlok.theme}</Text>
        </View>
      </View>
      <SanskritText text={shlok.sanskrit} style={styles.sanskrit} size={24} />
      <SelectableReadableText text={shlok.transliteration} style={styles.transliteration} />
      <SelectableReadableText text={shlok.translation} style={styles.translation} />
      <Text style={styles.source}>{shlok.source}</Text>
      {shlok.scriptureSlug ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate('VedaDetail', {
              vedaId: shlok.scriptureSlug,
              title: shlok.source,
            })
          }>
          <Text style={styles.btnText}>ग्रंथ पढ़ें →</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.md,
  },
  decorCircle: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(196, 92, 0, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.primary,
  },
  themePill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  theme: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  sanskrit: {
    ...typography.sanskrit,
    color: colors.primaryDark,
    marginBottom: 8,
  },
  transliteration: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textMuted,
    lineHeight: 20,
  },
  translation: {
    ...typography.body,
    color: colors.text,
    marginTop: spacing.sm,
  },
  source: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  btn: {
    marginTop: spacing.md,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    ...shadows.sm,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
