import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SelectableReadableText} from './SelectableReadableText';
import {SanskritText} from './SanskritText';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {getMantraOfDay} from '../utils/mantraOfDay';

export function MantraOfDayCard() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mantra = getMantraOfDay();

  return (
    <View style={styles.card}>
      <View style={styles.decorCircle} />
      <View style={styles.header}>
        <Text style={styles.label}>Mantra of the Day</Text>
        <View style={styles.themePill}>
          <Text style={styles.theme}>{mantra.theme}</Text>
        </View>
      </View>
      <SanskritText text={mantra.sanskrit} style={styles.sanskrit} size={24} />
      <SelectableReadableText text={mantra.transliteration} style={styles.transliteration} />
      <SelectableReadableText text={mantra.translation} style={styles.translation} />
      <Text style={styles.source}>{mantra.source}</Text>
      <TouchableOpacity
        style={styles.btn}
        onPress={() =>
          navigation.navigate('VedaDetail', {
            vedaId: mantra.vedaSlug,
            title: mantra.vedaTitle,
          })
        }>
        <Text style={styles.btnText}>Explore this Veda →</Text>
      </TouchableOpacity>
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
