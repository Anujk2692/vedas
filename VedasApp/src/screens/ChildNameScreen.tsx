import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {ChildNameResponse, ChildNameSuggestion} from '../api/types';
import {useLanguage} from '../context/LanguageContext';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

const SHORTLIST_KEY = '@vedas_child_name_shortlist_v1';
const DEITIES = ['Any', 'Shiva', 'Krishna', 'Rama', 'Ganesha', 'Durga', 'Lakshmi', 'Saraswati', 'Hanuman'];
const GENDERS = ['ANY', 'BOY', 'GIRL'];
const RELIGIONS = ['Hinduism', 'Sikhism', 'Jainism', 'Buddhism', 'Islam', 'Christianity', 'Universal'];
const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Nepal', 'Global'];
const LANGUAGES = [
  {code: 'en', label: 'English'},
  {code: 'hi', label: 'हिन्दी'},
  {code: 'sa', label: 'संस्कृतम्'},
];

export function ChildNameScreen() {
  const {language: appLang} = useLanguage();
  const isHi = appLang === 'hi' || appLang === 'sa';
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [deity, setDeity] = useState('Any');
  const [startingLetter, setStartingLetter] = useState('');
  const [gender, setGender] = useState('ANY');
  const [religion, setReligion] = useState('Hinduism');
  const [country, setCountry] = useState('India');
  const [lang, setLang] = useState(appLang === 'hi' || appLang === 'sa' ? appLang : 'en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ChildNameResponse | null>(null);
  const [resultFilter, setResultFilter] = useState<'ALL' | 'BOY' | 'GIRL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [showShortlistOnly, setShowShortlistOnly] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(SHORTLIST_KEY)
      .then(raw => {
        if (raw) {
          setShortlist(JSON.parse(raw) as string[]);
        }
      })
      .catch(() => {});
  }, []);

  const visibleSuggestions = useMemo(() => {
    if (!result) return [];
    const q = searchQuery.trim().toLowerCase();
    return result.suggestions.filter(s => {
      const genderOk = resultFilter === 'ALL' || s.gender === resultFilter || s.gender === 'UNISEX';
      const shortlistOk = !showShortlistOnly || shortlist.includes(s.name);
      const searchOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.rashi.toLowerCase().includes(q) ||
        s.nakshatra.toLowerCase().includes(q);
      return genderOk && shortlistOk && searchOk;
    });
  }, [result, resultFilter, searchQuery, showShortlistOnly, shortlist]);

  const toggleShortlist = (name: string) => {
    const next = shortlist.includes(name)
      ? shortlist.filter(n => n !== name)
      : [...shortlist, name];
    setShortlist(next);
    AsyncStorage.setItem(SHORTLIST_KEY, JSON.stringify(next)).catch(() => {});
  };

  const handleGenerate = async () => {
    if (fatherName.trim().length < 2 || motherName.trim().length < 2) {
      setError('Please enter both Father and Mother names (at least 2 letters).');
      return;
    }
    setError('');
    setLoading(true);
    setResultFilter('ALL');
    setShowShortlistOnly(false);
    try {
      const res = await api.suggestChildNames({
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        deity: deity === 'Any' ? '' : deity,
        gender,
        religion,
        country,
        language: lang,
        startingLetter: startingLetter.trim(),
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not fetch name suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (item: ChildNameSuggestion) => {
    try {
      await Share.share({
        message: `${item.name} (${item.scriptText}) — ${item.meaning}\nRashi: ${item.rashi} · Nakshatra: ${item.nakshatra}\nNumerology #${item.numerologyNumber}: ${item.numerologyTrait}`,
      });
    } catch {
      // ignore cancelled share
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <Text style={styles.badge}>{isHi ? '✨ नामकरण · शिशु नाम स्टूडियो' : '✨ नामकरण · CHILD NAME STUDIO'}</Text>
        <Text style={styles.title}>{isHi ? 'पवित्र शिशु नाम सुझाव' : 'Sacred Child Name Suggestions'}</Text>
        <Text style={styles.subtitle}>
          {isHi
            ? 'माता-पिता के नाम, इष्ट देव/देवी के पर्यायवाची, राशि अक्षर, नक्षत्र और अंकशास्त्र के साथ अर्थपूर्ण नाम खोजें।'
            : 'Combine Father & Mother names with God/Goddess synonyms, Rashi Akshar, Nakshatra, Numerology, and meaning in your language.'}
        </Text>

        <Text style={styles.label}>{isHi ? 'पिता का नाम *' : 'Father’s Name *'}</Text>
        <TextInput
          style={styles.input}
          value={fatherName}
          onChangeText={setFatherName}
          placeholder={isHi ? 'जैसे: अनुज' : 'e.g. Anuj'}
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>{isHi ? 'माता का नाम *' : 'Mother’s Name *'}</Text>
        <TextInput
          style={styles.input}
          value={motherName}
          onChangeText={setMotherName}
          placeholder={isHi ? 'जैसे: प्रिया' : 'e.g. Priya'}
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>{isHi ? 'प्रथम अक्षर / राशि अक्षर (वैकल्पिक)' : 'Starting Letter / Rashi Akshar (Optional)'}</Text>
        <TextInput
          style={styles.input}
          value={startingLetter}
          onChangeText={t => setStartingLetter(t.slice(0, 1))}
          maxLength={1}
          placeholder="e.g. A, R, S"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>God / Goddess (Optional)</Text>
        <View style={styles.chipRow}>
          {DEITIES.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setDeity(item)}
              style={[styles.chip, deity === item && styles.chipActive]}>
              <Text style={[styles.chipText, deity === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setGender(item)}
              style={[styles.chip, gender === item && styles.chipActive]}>
              <Text style={[styles.chipText, gender === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Religion</Text>
        <View style={styles.chipRow}>
          {RELIGIONS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setReligion(item)}
              style={[styles.chip, religion === item && styles.chipActive]}>
              <Text style={[styles.chipText, religion === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Country</Text>
        <View style={styles.chipRow}>
          {COUNTRIES.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => setCountry(item)}
              style={[styles.chip, country === item && styles.chipActive]}>
              <Text style={[styles.chipText, country === item && styles.chipTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Meaning Language</Text>
        <View style={styles.chipRow}>
          {LANGUAGES.map(item => (
            <TouchableOpacity
              key={item.code}
              onPress={() => setLang(item.code)}
              style={[styles.chip, lang === item.code && styles.chipActive]}>
              <Text style={[styles.chipText, lang === item.code && styles.chipTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleGenerate}
          disabled={loading}
          style={styles.submitBtn}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Suggest Names ✨</Text>
          )}
        </TouchableOpacity>
      </View>

      {shortlist.length > 0 && (
        <View style={styles.shortlistCard}>
          <View style={styles.shortlistTop}>
            <Text style={styles.shortlistTitle}>❤️ Shortlisted ({shortlist.length})</Text>
            <TouchableOpacity
              onPress={() => setShowShortlistOnly(prev => !prev)}
              style={[styles.chip, showShortlistOnly && styles.chipActive]}>
              <Text style={[styles.chipText, showShortlistOnly && styles.chipTextActive]}>
                {showShortlistOnly ? 'Show All' : 'Filter Shortlisted'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.synRow}>
            {shortlist.map(name => (
              <View key={name} style={styles.synChip}>
                <Text style={styles.synText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {result && (
        <View style={styles.resultsWrap}>
          <Text style={styles.resultsTitle}>
            {visibleSuggestions.length} Suggestions for {result.fatherName} & {result.motherName}
          </Text>
          <Text style={styles.resultsMeta}>
            {result.deity} · {result.religion} · {result.country} · {result.language.toUpperCase()}
          </Text>

          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search name, meaning, Rashi…"
            placeholderTextColor={colors.textMuted}
          />

          <View style={styles.filterRow}>
            {(['ALL', 'BOY', 'GIRL'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setResultFilter(f)}
                style={[styles.chip, resultFilter === f && styles.chipActive]}>
                <Text style={[styles.chipText, resultFilter === f && styles.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {visibleSuggestions.map(item => {
            const saved = shortlist.includes(item.name);
            return (
              <View key={item.name} style={styles.resultCard}>
                <View style={styles.resultTop}>
                  <View style={styles.resultTitleBlock}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <Text style={styles.scriptSub}>
                      {item.scriptText} · /{item.pronunciation}/
                    </Text>
                  </View>
                  <View style={styles.topActions}>
                    <TouchableOpacity onPress={() => toggleShortlist(item.name)} style={styles.favBtn}>
                      <Text style={styles.favIcon}>{saved ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                    <View style={styles.genderPill}>
                      <Text style={styles.genderPillText}>{item.gender}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.meaning}>{item.meaning}</Text>
                <Text style={styles.significance}>{item.spiritualSignificance}</Text>

                <View style={styles.astroBox}>
                  <Text style={styles.astroLine}>
                    ✨ Rashi: {item.rashi} · Nakshatra: {item.nakshatra}
                  </Text>
                  <Text style={styles.astroLine}>
                    🔢 Numerology #{item.numerologyNumber}: {item.numerologyTrait}
                  </Text>
                  <Text style={styles.astroLine}>
                    🎨 Lucky: {item.luckyDay} · {item.luckyColor}
                  </Text>
                </View>

                <Text style={styles.detail}>Blend: {item.combinationSource}</Text>
                <Text style={styles.detail}>
                  Deity / Origin: {item.deityConnection} · {item.origin}
                </Text>

                <View style={styles.footerRow}>
                  <View style={styles.synRow}>
                    {item.synonyms.map(syn => (
                      <View key={syn} style={styles.synChip}>
                        <Text style={styles.synText}>{syn}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity onPress={() => handleShare(item)} style={styles.shareBtn}>
                    <Text style={styles.shareBtnText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.md, paddingBottom: 48},
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(196, 92, 0, 0.2)',
    ...shadows.md,
  },
  badge: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.7,
    marginBottom: 4,
  },
  title: {...typography.h1, color: colors.primaryDark, marginBottom: 4},
  subtitle: {...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.md},
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
    marginTop: spacing.sm,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.text,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {backgroundColor: colors.primary, borderColor: colors.primary},
  chipText: {fontSize: 12, fontWeight: '700', color: colors.textSecondary},
  chipTextActive: {color: colors.white},
  errorText: {color: colors.error, fontWeight: '700', marginTop: spacing.sm},
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  submitBtnText: {color: colors.white, fontSize: 15, fontWeight: '800'},
  shortlistCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shortlistTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shortlistTitle: {fontSize: 14, fontWeight: '800', color: colors.primaryDark},
  resultsWrap: {marginTop: spacing.lg},
  resultsTitle: {...typography.h2, color: colors.primaryDark},
  resultsMeta: {fontSize: 12, color: colors.textMuted, marginBottom: spacing.sm},
  filterRow: {flexDirection: 'row', gap: 8, marginBottom: spacing.md},
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  resultTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  resultTitleBlock: {flex: 1},
  topActions: {flexDirection: 'row', alignItems: 'center', gap: 8},
  favBtn: {padding: 2},
  favIcon: {fontSize: 18},
  resultName: {fontSize: 21, fontWeight: '800', color: colors.primaryDark},
  scriptSub: {fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 2},
  genderPill: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  genderPillText: {fontSize: 11, fontWeight: '800', color: colors.primary},
  meaning: {fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 8, marginBottom: 4},
  significance: {fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 8},
  astroBox: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.sm,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: 3,
  },
  astroLine: {fontSize: 12, fontWeight: '600', color: colors.primaryDark},
  detail: {fontSize: 12, color: colors.textSecondary, marginTop: 2},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  synRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, flex: 1},
  synChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  synText: {fontSize: 11, fontWeight: '700', color: colors.primaryDark},
  shareBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shareBtnText: {fontSize: 11, fontWeight: '800', color: colors.white},
});
