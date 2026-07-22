import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AppLogo} from './AppLogo';
import {borderRadius, colors, shadows, spacing, typography} from '../../theme/colors';

interface Props {
  languageLabel: string;
  onLanguagePress: () => void;
}

export function HomeHero({languageLabel, onLanguagePress}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.hero}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />
      <View style={[styles.content, {paddingTop: insets.top + spacing.md}]}>
        <View style={styles.topRow}>
          <View style={styles.brandWrap}>
            <AppLogo size={40} />
            <View style={styles.brandText}>
              <Text style={styles.brandLabel}>सनातन ज्ञान</Text>
              <Text style={styles.brandTag} numberOfLines={1}>
                Vedas · Gita · Itihasa · Upanishads
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.langBtn} onPress={onLanguagePress} activeOpacity={0.85}>
            <Text style={styles.langLabel}>Language</Text>
            <Text style={styles.langValue}>{languageLabel}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.greeting}>Namaste</Text>
        <Text style={styles.title}>Sacred Scriptures</Text>
        <Text style={styles.subtitle}>
          Read · Listen · Watch · Study — Vedas, Gita, Ramayana and more in Hindi
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.primaryDark,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    marginHorizontal: -spacing.md,
    overflow: 'hidden',
    ...shadows.lg,
  },
  glowTop: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(232, 146, 42, 0.25)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -50,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212, 160, 23, 0.15)',
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  brandText: {
    flex: 1,
    minWidth: 0,
  },
  brandLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
  brandTag: {
    fontSize: 11,
    color: 'rgba(255,248,240,0.65)',
    marginTop: 1,
    fontWeight: '600',
  },
  langBtn: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'flex-end',
  },
  langLabel: {
    fontSize: 10,
    color: 'rgba(255,248,240,0.65)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  langValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
    marginTop: 1,
  },
  greeting: {
    ...typography.caption,
    color: colors.primaryLight,
    marginBottom: 6,
  },
  title: {
    ...typography.hero,
    color: colors.playerText,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,248,240,0.82)',
    marginTop: spacing.sm,
    maxWidth: '92%',
  },
});
