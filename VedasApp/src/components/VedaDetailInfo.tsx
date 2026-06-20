import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Veda} from '../api/types';
import {SelectableReadableText} from './SelectableReadableText';
import {borderRadius, colors, spacing} from '../theme/colors';

interface Props {
  veda: Veda;
}

function Section({title, children, defaultOpen = false}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setOpen(!open)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      {open && <View style={styles.sectionBody}>{children}</View>}
    </View>
  );
}

function StatRow({label, value}: {label: string; value: string | number}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function BodyText({text}: {text: string}) {
  return <SelectableReadableText text={text} style={styles.bodyText} />;
}

function ChipList({items}: {items: string[]}) {
  return (
    <View style={styles.chipWrap}>
      {items.map(item => (
        <View key={item} style={styles.chip}>
          <Text style={styles.chipText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function HymnList({items}: {items: string[]}) {
  return (
    <View style={styles.hymnList}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.hymnItem}>
          <Text style={styles.hymnBullet}>•</Text>
          <SelectableReadableText text={item} style={styles.hymnText} />
        </View>
      ))}
    </View>
  );
}

export function VedaDetailInfo({veda}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.heroStats}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{veda.divisionCount ?? '—'}</Text>
          <Text style={styles.statBoxLabel}>{veda.divisionName ?? 'Divisions'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{veda.mantraCount?.toLocaleString() ?? '—'}</Text>
          <Text style={styles.statBoxLabel}>Mantras</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{veda.chapterCount}</Text>
          <Text style={styles.statBoxLabel}>Chapters</Text>
        </View>
      </View>

      {veda.period && <StatRow label="Period" value={veda.period} />}
      {veda.compositionType && <StatRow label="Form" value={veda.compositionType} />}

      {veda.overview && (
        <Section title="Overview" defaultOpen>
          <BodyText text={veda.overview} />
        </Section>
      )}

      {veda.significance && (
        <Section title="Significance">
          <BodyText text={veda.significance} />
        </Section>
      )}

      {veda.structure && (
        <Section title="Structure">
          <BodyText text={veda.structure} />
        </Section>
      )}

      {veda.historicalContext && (
        <Section title="Historical Context">
          <BodyText text={veda.historicalContext} />
        </Section>
      )}

      {veda.primaryDeities && veda.primaryDeities.length > 0 && (
        <Section title="Primary Deities">
          <ChipList items={veda.primaryDeities} />
        </Section>
      )}

      {veda.keyThemes && veda.keyThemes.length > 0 && (
        <Section title="Key Themes">
          <ChipList items={veda.keyThemes} />
        </Section>
      )}

      {veda.famousSages && veda.famousSages.length > 0 && (
        <Section title="Famous Sages (Rishis)">
          <ChipList items={veda.famousSages} />
        </Section>
      )}

      {veda.branches && (
        <Section title="Branches (Shakhas)">
          <BodyText text={veda.branches} />
        </Section>
      )}

      {veda.specialFeatures && (
        <Section title="Special Features">
          <BodyText text={veda.specialFeatures} />
        </Section>
      )}

      {veda.philosophy && (
        <Section title="Philosophy & Wisdom">
          <BodyText text={veda.philosophy} />
        </Section>
      )}

      {veda.coreConcepts && veda.coreConcepts.length > 0 && (
        <Section title="Core Concepts">
          <ChipList items={veda.coreConcepts} />
        </Section>
      )}

      {veda.famousHymns && veda.famousHymns.length > 0 && (
        <Section title="Famous Hymns & Mantras">
          <HymnList items={veda.famousHymns} />
        </Section>
      )}

      {veda.ritualsAndPractices && (
        <Section title="Rituals & Practices">
          <BodyText text={veda.ritualsAndPractices} />
        </Section>
      )}

      {veda.learningGuide && (
        <Section title="Learning Guide">
          <BodyText text={veda.learningGuide} />
        </Section>
      )}

      {veda.pronunciationGuide && (
        <Section title="Pronunciation Guide">
          <BodyText text={veda.pronunciationGuide} />
        </Section>
      )}

      {veda.modernRelevance && (
        <Section title="Modern Relevance">
          <BodyText text={veda.modernRelevance} />
        </Section>
      )}

      {veda.relatedTexts && (
        <Section title="Related Texts">
          <BodyText text={veda.relatedTexts} />
        </Section>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  statBoxLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.sm,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceElevated,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  chevron: {
    fontSize: 12,
    color: colors.primary,
  },
  sectionBody: {
    padding: spacing.md,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  hymnList: {
    gap: 8,
  },
  hymnItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hymnBullet: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 8,
    lineHeight: 22,
  },
  hymnText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
