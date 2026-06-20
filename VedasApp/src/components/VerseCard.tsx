import React from 'react';
import {Pressable, Share, StyleSheet, Text, View} from 'react-native';
import type {Verse} from '../api/types';
import {SelectableReadableText} from './SelectableReadableText';
import {SanskritText} from './SanskritText';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {mediaQualityLabel} from '../utils/mediaLabels';

interface Props {
  verse: Verse;
  showSanskrit?: boolean;
  chapterId?: string;
  chapterTitle?: string;
  vedaTitle?: string;
  sanskritFontSize?: number;
  translationFontSize?: number;
  onAudioPress?: () => void;
  onVideoPress?: () => void;
}

export function VerseCard({
  verse,
  showSanskrit = true,
  chapterId,
  chapterTitle,
  vedaTitle,
  sanskritFontSize = 20,
  translationFontSize = 16,
  onAudioPress,
  onVideoPress,
}: Props) {
  const {isFavorite, toggleFavorite} = useUserPreferences();
  const saved = isFavorite(verse.id);

  const shareVerse = async () => {
    const message = [
      verse.suktaReference ? `[${verse.suktaReference}]` : `Verse ${verse.number}`,
      verse.sanskrit,
      verse.transliteration,
      verse.translation,
      chapterTitle ? `\n— ${chapterTitle}` : '',
      vedaTitle ? ` (${vedaTitle})` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    await Share.share({message, title: 'Sacred Mantra'});
  };

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.verseBadge}>
              <Text style={styles.verseNumber}>
                {verse.suktaReference ? verse.suktaReference : `#${verse.number}`}
              </Text>
            </View>
            {verse.rishi ? <Text style={styles.rishi}>Rishi · {verse.rishi}</Text> : null}
          </View>
          <View style={styles.actions}>
            {chapterId && (
              <Pressable
                style={[styles.iconBtn, saved && styles.iconBtnActive]}
                onPress={() =>
                  toggleFavorite({
                    id: verse.id,
                    type: 'verse',
                    title: verse.suktaReference ?? `Verse ${verse.number}`,
                    sanskrit: verse.sanskrit,
                    subtitle: chapterTitle,
                    chapterId,
                    vedaTitle,
                  })
                }>
                <Text style={styles.iconText}>{saved ? '❤️' : '🤍'}</Text>
              </Pressable>
            )}
            <Pressable style={styles.iconBtn} onPress={shareVerse}>
              <Text style={styles.iconText}>↗️</Text>
            </Pressable>
            {verse.audioUrl && onAudioPress && (
              <Pressable style={styles.mediaBtn} onPress={onAudioPress}>
                <Text style={styles.mediaBtnText}>🎵</Text>
              </Pressable>
            )}
            {verse.videoUrl && onVideoPress && (
              <Pressable style={[styles.mediaBtn, styles.videoBtn]} onPress={onVideoPress}>
                <Text style={styles.mediaBtnText}>🎬</Text>
              </Pressable>
            )}
          </View>
        </View>

        {showSanskrit && (
          <SanskritText
            text={verse.sanskrit}
            size={sanskritFontSize}
            style={styles.sanskrit}
          />
        )}
        <SelectableReadableText
          text={verse.transliteration}
          style={styles.transliteration}
        />
        {mediaQualityLabel(verse.audioUrl) && (
          <View style={styles.qualityPill}>
            <Text style={styles.pronunciation}>{mediaQualityLabel(verse.audioUrl)}</Text>
          </View>
        )}
        <SelectableReadableText
          text={verse.translation}
          style={[
            styles.translation,
            {fontSize: translationFontSize, lineHeight: translationFontSize * 1.55},
          ]}
        />
        {verse.commentary ? (
          <View style={styles.commentaryBox}>
            <Text style={styles.commentaryLabel}>Commentary</Text>
            <SelectableReadableText text={verse.commentary} style={styles.commentary} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  accentBar: {
    height: 4,
    backgroundColor: colors.primary,
  },
  inner: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  verseBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    marginBottom: 4,
  },
  verseNumber: {
    ...typography.caption,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  rishi: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: colors.tabActive,
  },
  iconText: {
    fontSize: 16,
  },
  mediaBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBtn: {
    backgroundColor: colors.primaryDark,
  },
  mediaBtnText: {
    fontSize: 14,
  },
  sanskrit: {
    color: colors.text,
    marginBottom: 10,
  },
  transliteration: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  qualityPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginBottom: 10,
  },
  pronunciation: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  translation: {
    color: colors.text,
  },
  commentaryBox: {
    marginTop: spacing.md,
    backgroundColor: colors.backgroundAlt,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  commentaryLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: 6,
  },
  commentary: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
