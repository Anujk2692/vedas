import {useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {DevotionalItem, DevotionalLine} from '../api/types';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {onSpeechFinish, speakAnswerText, stopSpeech} from '../utils/speech';

export function DevotionalScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Devotional'>>();
  const mode = route.params?.mode ?? 'chalisas';
  const {language} = useLanguage();
  const isHi = language === 'hi' || language === 'sa';

  const [items, setItems] = useState<DevotionalItem[]>([]);
  const [selected, setSelected] = useState<DevotionalItem | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [speakingAll, setSpeakingAll] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        mode === 'chalisas' ? await api.getChalisas(language) : await api.getBhajans(language);
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [mode, language]);

  useEffect(() => {
    setSelected(null);
    loadList();
  }, [loadList]);

  useEffect(() => {
    const unsub = onSpeechFinish(() => {
      setActiveIndex(null);
      setSpeakingAll(false);
    });
    return () => {
      unsub();
      stopSpeech().catch(() => undefined);
    };
  }, []);

  const openDetail = async (slug: string) => {
    setLoading(true);
    try {
      const detail =
        mode === 'chalisas'
          ? await api.getChalisa(slug, language)
          : await api.getBhajan(slug, language);
      setSelected(detail);
    } finally {
      setLoading(false);
    }
  };

  const toggleLine = async (line: DevotionalLine, index: number) => {
    if (activeIndex === index) {
      await stopSpeech();
      setActiveIndex(null);
      return;
    }
    setSpeakingAll(false);
    setActiveIndex(index);
    try {
      await speakAnswerText(line.sanskrit, 'hi');
    } catch {
      setActiveIndex(null);
    }
  };

  const toggleAll = async () => {
    if (!selected?.lines?.length) return;
    if (speakingAll) {
      await stopSpeech();
      setSpeakingAll(false);
      return;
    }
    setActiveIndex(null);
    setSpeakingAll(true);
    try {
      await speakAnswerText(selected.lines.map(l => l.sanskrit).join(' '), 'hi');
    } catch {
      setSpeakingAll(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.deity.toLowerCase().includes(q) ||
        i.sanskritName.toLowerCase().includes(q),
    );
  }, [items, query]);

  if (loading && items.length === 0 && !selected) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (selected) {
    return (
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.content}
        data={selected.lines ?? []}
        keyExtractor={(_, idx) => String(idx)}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <Pressable
              onPress={() => {
                stopSpeech().catch(() => undefined);
                setActiveIndex(null);
                setSpeakingAll(false);
                setSelected(null);
              }}>
              <Text style={styles.backText}>{isHi ? '← सूची पर लौटें' : '← Back to list'}</Text>
            </Pressable>
            <Text style={styles.badge}>{selected.deity}</Text>
            <Text style={styles.title}>{selected.title}</Text>
            <Text style={styles.sanskritTitle}>{selected.sanskritName}</Text>
            <Text style={styles.subtitle}>{selected.description}</Text>
            <Pressable onPress={toggleAll} style={styles.playAllBtn}>
              <Text style={styles.playAllText}>
                {speakingAll
                  ? isHi
                    ? '⏹ पाठ रोकें'
                    : '⏹ Stop Reading'
                  : isHi
                    ? '🔊 पूरा पाठ सुनें'
                    : '🔊 Listen Full'}
              </Text>
            </Pressable>
            <Text style={styles.hint}>
              {isHi ? '💡 किसी भी पद पर टैप कर ऑडियो सुनें' : '💡 Tap any stanza to listen aloud'}
            </Text>
          </View>
        }
        renderItem={({item, index}) => {
          const active = activeIndex === index;
          return (
            <Pressable
              onPress={() => toggleLine(item, index)}
              style={[styles.lineCard, active && styles.lineCardActive]}>
              <View style={styles.lineTop}>
                <View style={styles.numPill}>
                  <Text style={styles.numText}>{index + 1}</Text>
                </View>
                <Text style={[styles.tapLabel, active && styles.tapLabelActive]}>
                  {active
                    ? isHi
                      ? '🔊 सुन रहे हैं…'
                      : '🔊 Playing…'
                    : isHi
                      ? '🔊 सुनने के लिए टैप करें'
                      : '🔊 Tap to listen'}
                </Text>
              </View>
              <Text style={styles.sanskrit}>{item.sanskrit}</Text>
              <Text style={styles.translit}>{item.transliteration}</Text>
              <Text style={styles.meaning}>{item.translation}</Text>
            </Pressable>
          );
        }}
      />
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={filtered}
      keyExtractor={item => item.slug}
      ListHeaderComponent={
        <View>
          <Text style={styles.pageTitle}>
            {mode === 'chalisas'
              ? isHi
                ? '📿 चालीसा संग्रह'
                : '📿 Chalisa Collection'
              : isHi
                ? '🎶 भजन संग्रह'
                : '🎶 Bhajan Collection'}
          </Text>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder={isHi ? 'खोजें…' : 'Search…'}
            placeholderTextColor={colors.textMuted}
          />
        </View>
      }
      renderItem={({item}) => (
        <Pressable onPress={() => openDetail(item.slug)} style={styles.listCard}>
          <Text style={styles.badge}>{item.deity}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.sanskritTitle}>{item.sanskritName}</Text>
          <Text style={styles.subtitle}>{item.description}</Text>
          <Text style={styles.meta}>
            {item.lineCount} {isHi ? 'पद · टैप करें →' : 'stanzas · Tap to read →'}
          </Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background},
  content: {padding: spacing.md, paddingBottom: 48},
  pageTitle: {...typography.h1, color: colors.primaryDark, marginBottom: spacing.sm},
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.md,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  heroCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  backText: {fontSize: 13, fontWeight: '700', color: colors.primary, marginBottom: spacing.sm},
  badge: {fontSize: 11, fontWeight: '800', color: colors.primary, textTransform: 'uppercase'},
  title: {...typography.h1, color: colors.primaryDark, marginTop: 4},
  cardTitle: {...typography.h2, color: colors.primaryDark, marginTop: 4},
  sanskritTitle: {fontSize: 14, fontWeight: '700', color: colors.primary, marginTop: 2},
  subtitle: {...typography.bodySmall, color: colors.textSecondary, marginTop: 4},
  meta: {fontSize: 12, fontWeight: '700', color: colors.textMuted, marginTop: 8},
  playAllBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  playAllText: {color: colors.white, fontWeight: '800', fontSize: 14},
  hint: {fontSize: 12, fontWeight: '700', color: colors.primaryDark, marginTop: spacing.sm},
  lineCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  lineCardActive: {backgroundColor: colors.surfaceElevated, borderColor: colors.primary, borderWidth: 1.5},
  lineTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6},
  numPill: {backgroundColor: colors.tabActive, borderRadius: borderRadius.full, paddingHorizontal: 10, paddingVertical: 3},
  numText: {fontSize: 11, fontWeight: '800', color: colors.primaryDark},
  tapLabel: {fontSize: 11, fontWeight: '700', color: colors.textMuted},
  tapLabelActive: {color: colors.primary},
  sanskrit: {fontSize: 17, fontWeight: '600', color: colors.primaryDark, lineHeight: 28},
  translit: {fontSize: 13, fontStyle: 'italic', color: colors.textMuted, marginTop: 4},
  meaning: {fontSize: 14, color: colors.text, marginTop: 6, lineHeight: 21},
});
