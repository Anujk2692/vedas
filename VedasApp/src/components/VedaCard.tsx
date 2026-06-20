import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Veda} from '../api/types';
import {RemoteImage} from './ui/RemoteImage';
import {SanskritText} from './SanskritText';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

interface Props {
  veda: Veda;
  onPress: () => void;
}

const VEDA_ACCENTS = ['#C45C00', '#8B4513', '#6B4226', '#A0522D'];

export function VedaCard({veda, onPress}: Props) {
  const accent = VEDA_ACCENTS[(veda.order - 1) % VEDA_ACCENTS.length];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageWrap}>
        <RemoteImage uri={veda.coverImageUrl} style={styles.image} placeholderIcon="📿" />
        <View style={styles.imageOverlay} />
        <View style={[styles.orderBadge, {backgroundColor: accent}]}>
          <Text style={styles.orderText}>{veda.order}</Text>
        </View>
        <SanskritText
          text={veda.sanskritName}
          style={styles.imageSanskrit}
          size={26}
          bold
          selectable={false}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{veda.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {veda.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{veda.chapterCount} chapters</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>{veda.verseCount}+ mantras</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
    ...shadows.md,
  },
  imageWrap: {
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surfaceMuted,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(44, 24, 16, 0.35)',
  },
  orderBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  orderText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  imageSanskrit: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.md,
    right: spacing.md,
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaPill: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
