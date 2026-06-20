import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {api} from '../api/client';
import type {SearchResult} from '../api/types';
import {ErrorBanner} from '../components/ErrorBanner';
import {EmptyState} from '../components/ui/EmptyState';
import {SectionHeader} from '../components/ui/SectionHeader';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useLanguage} from '../context/LanguageContext';
import type {RootStackParamList} from '../navigation/types';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';
import {LIST_BOTTOM_INSET} from '../utils/layout';

type SearchRow =
  | {type: 'veda'; id: string; item: SearchResult['vedas'][0]}
  | {type: 'chapter'; id: string; item: SearchResult['chapters'][0]}
  | {type: 'verse'; id: string; item: SearchResult['verses'][0]}
  | {type: 'media'; id: string; item: SearchResult['media'][0]}
  | {type: 'aarti'; id: string; item: NonNullable<SearchResult['aartis']>[0]};

type SearchSection = {
  title: string;
  data: SearchRow[];
};

const TYPE_LABELS: Record<SearchRow['type'], string> = {
  veda: 'Vedas',
  chapter: 'Chapters',
  verse: 'Verses',
  media: 'Media',
  aarti: 'Aartis',
};

const TYPE_ICONS: Record<SearchRow['type'], string> = {
  veda: '📿',
  chapter: '📖',
  verse: '🕉',
  media: '🎵',
  aarti: '🪔',
};

const SECTION_ORDER: SearchRow['type'][] = ['veda', 'chapter', 'verse', 'aarti', 'media'];

function rowsFromResult(data: SearchResult): SearchRow[] {
  return [
    ...data.vedas.map(v => ({type: 'veda' as const, id: v.id, item: v})),
    ...data.chapters.map(c => ({type: 'chapter' as const, id: c.id, item: c})),
    ...data.verses.map(v => ({type: 'verse' as const, id: v.id, item: v})),
    ...(data.aartis ?? []).map(a => ({type: 'aarti' as const, id: a.id, item: a})),
    ...data.media.map(m => ({type: 'media' as const, id: m.id, item: m})),
  ];
}

export function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {language} = useLanguage();
  const {playTrack} = useAudioPlayer();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchedQuery, setSearchedQuery] = useState('');
  const requestId = useRef(0);

  const runSearch = useCallback(
    async (rawQuery: string) => {
      const trimmed = rawQuery.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setSearchedQuery('');
        setError(null);
        return;
      }

      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const data = await api.search(trimmed, language);
        if (id !== requestId.current) {
          return;
        }
        setResults(rowsFromResult(data));
        setSearchedQuery(trimmed);
      } catch (e) {
        if (id !== requestId.current) {
          return;
        }
        setResults([]);
        setSearchedQuery(trimmed);
        setError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        if (id === requestId.current) {
          setLoading(false);
        }
      }
    },
    [language],
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setSearchedQuery('');
      setError(null);
      return;
    }
    const timer = setTimeout(() => runSearch(trimmed), 450);
    return () => clearTimeout(timer);
  }, [query, runSearch]);

  const sections = useMemo<SearchSection[]>(() => {
    const grouped: Record<SearchRow['type'], SearchRow[]> = {
      veda: [],
      chapter: [],
      verse: [],
      media: [],
      aarti: [],
    };
    results.forEach(row => grouped[row.type].push(row));
    return SECTION_ORDER.filter(type => grouped[type].length > 0).map(type => ({
      title: TYPE_LABELS[type],
      data: grouped[type],
    }));
  }, [results]);

  const playSearchAudio = async (item: SearchResult['media'][0]) => {
    if (!item.url?.trim()) {
      return;
    }
    await playTrack({
      id: item.id,
      title: item.title,
      artist: item.reciter,
      url: item.url,
      artwork: item.thumbnailUrl,
      duration: item.durationSeconds,
    });
    navigation.navigate('AudioPlayer');
  };

  const navigateResult = (row: SearchRow) => {
    if (row.type === 'aarti') {
      navigation.navigate('AartiDetail', {
        slug: row.item.slug,
        title: row.item.title,
      });
      return;
    }
    if (row.type === 'veda') {
      navigation.navigate('VedaDetail', {
        vedaId: row.item.id,
        title: row.item.title,
      });
      return;
    }
    if (row.type === 'chapter') {
      navigation.navigate('ChapterReader', {
        chapterId: row.item.id,
        title: row.item.title,
      });
      return;
    }
    if (row.type === 'verse') {
      navigation.navigate('ChapterReader', {
        chapterId: row.item.chapterId,
        title: `Verse ${row.item.number}`,
      });
      return;
    }
    if (row.item.type === 'VIDEO') {
      if (!row.item.url?.trim()) {
        return;
      }
      navigation.navigate('VideoPlayer', {
        url: row.item.url,
        title: row.item.title,
        subtitle: row.item.reciter,
      });
    } else {
      playSearchAudio(row.item);
    }
  };

  const getTitle = (row: SearchRow) => {
    if (row.type === 'verse') return row.item.translation;
    if (row.type === 'media') return row.item.title;
    if (row.type === 'aarti') return row.item.title;
    return row.item.title;
  };

  const getSubtitle = (row: SearchRow) => {
    if (row.type === 'veda') return row.item.sanskritName;
    if (row.type === 'verse') return row.item.sanskrit;
    if (row.type === 'media') return row.item.reciter;
    if (row.type === 'aarti') return row.item.sanskritName;
    return undefined;
  };

  const showHint = !loading && searchedQuery.length === 0 && !error && query.trim().length < 2;
  const showResults = searchedQuery.length > 0 || loading;

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Search vedas, aartis, mantras..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => runSearch(query)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
        </View>
        {loading && (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        )}
      </View>

      {error && <ErrorBanner message={error} onRetry={() => runSearch(query)} />}

      {showHint && (
        <EmptyState
          icon="✨"
          title="Discover sacred knowledge"
          message="Search by veda name, deity aarti, mantra text, or reciter"
        />
      )}

      {showResults && !loading && searchedQuery.length > 0 && (
        <SectionList
          sections={sections}
          keyExtractor={row => `${row.type}-${row.id}`}
          contentContainerStyle={styles.list}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <SectionHeader
              title={`${results.length} result${results.length !== 1 ? 's' : ''}`}
              subtitle={`For "${searchedQuery}"`}
            />
          }
          ListEmptyComponent={
            !error ? (
              <EmptyState
                icon="🔎"
                title="No results found"
                message="Try different keywords — deity name, mantra, or reciter."
              />
            ) : null
          }
          renderSectionHeader={({section}) => (
            <Text style={styles.sectionLabel}>{section.title}</Text>
          )}
          renderItem={({item: row}) => (
            <Pressable
              style={({pressed}) => [styles.resultItem, pressed && styles.pressed]}
              onPress={() => navigateResult(row)}>
              <View style={styles.resultIconWrap}>
                <Text style={styles.resultIcon}>{TYPE_ICONS[row.type]}</Text>
              </View>
              <View style={styles.resultBody}>
                <Text style={styles.resultType}>
                  {row.type === 'media'
                    ? (row.item as SearchResult['media'][0]).type
                    : TYPE_LABELS[row.type].slice(0, -1).toUpperCase()}
                </Text>
                <Text style={styles.resultTitle} numberOfLines={2}>
                  {getTitle(row)}
                </Text>
                {getSubtitle(row) ? (
                  <Text style={styles.resultSub} numberOfLines={2}>
                    {getSubtitle(row)}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  searchSection: {
    padding: spacing.md,
    backgroundColor: colors.backgroundAlt,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {fontSize: 16, marginRight: 8},
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  clearBtn: {padding: 4},
  clearText: {fontSize: 14, color: colors.textMuted, fontWeight: '700'},
  loader: {marginTop: spacing.sm},
  pressed: {opacity: 0.9},
  list: {padding: spacing.md, paddingBottom: LIST_BOTTOM_INSET},
  sectionLabel: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  resultIconWrap: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.tabActive,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  resultIcon: {fontSize: 20},
  resultBody: {flex: 1, minWidth: 0},
  resultType: {
    ...typography.caption,
    color: colors.primary,
    marginBottom: 2,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  resultSub: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 3,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    color: colors.textMuted,
    marginLeft: spacing.sm,
    fontWeight: '300',
  },
});
