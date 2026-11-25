import React, {useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {api} from '../api/client';
import type {ChildNameResponse} from '../api/types';
import {useLanguage} from '../context/LanguageContext';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

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
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [deity, setDeity] = useState('Any');
  const [gender, setGender] = useState('ANY');
  const [religion, setReligion] = useState('Hinduism');
  const [country, setCountry] = useState('India');
  const [lang, setLang] = useState(appLang === 'hi' || appLang === 'sa' ? appLang : 'en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ChildNameResponse | null>(null);

  const handleGenerate = async () => {
    if (fatherName.trim().length < 2 || motherName.trim().length < 2) {
      setError('Please enter both Father and Mother names (at least 2 letters).');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.suggestChildNames({
        fatherName: fatherName.trim(),
        motherName: motherName.trim(),
        deity: deity === 'Any' ? '' : deity,
        gender,
        religion,
        country,
        language: lang,
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not fetch name suggestions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.formCard}>
        <Text style={styles.badge}>✨ नामकरण · CHILD NAME STUDIO</Text>
        <Text style={styles.title}>Sacred Child Name Suggestions</Text>
        <Text style={styles.subtitle}>
          Combine Father & Mother names with optional God/Goddess synonyms, religion, country, and meaning language.
        </Text>

        <Text style={styles.label}>Father’s Name *</Text>
        <TextInput
          style={styles.input}
          value={fatherName}
          onChangeText={setFatherName}
          placeholder="e.g. Anuj"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Mother’s Name *</Text>
        <TextInput
          style={styles.input}
          value={motherName}
          onChangeText={setMotherName}
          placeholder="e.g. Priya"
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

      {result && (
        <View style={styles.resultsWrap}>
          <Text style={styles.resultsTitle}>
            {result.totalSuggestions} Suggestions for {result.fatherName} & {result.motherName}
          </Text>
          <Text style={styles.resultsMeta}>
            {result.deity} · {result.religion} · {result.country} · {result.language.toUpperCase()}
          </Text>

          {result.suggestions.map(item => (
            <View key={item.name} style={styles.resultCard}>
              <View style={styles.resultTop}>
                <Text style={styles.resultName}>{item.name}</Text>
                <View style={styles.genderPill}>
                  <Text style={styles.genderPillText}>{item.gender}</Text>
                </View>
              </View>
              <Text style={styles.meaning}>{item.meaning}</Text>
              <Text style={styles.detail}>Combination: {item.combinationSource}</Text>
              <Text style={styles.detail}>
                Deity / Origin: {item.deityConnection} · {item.origin}
              </Text>
              {item.synonyms.length > 0 && (
                <View style={styles.synRow}>
                  {item.synonyms.map(syn => (
                    <View key={syn} style={styles.synChip}>
                      <Text style={styles.synText}>{syn}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  resultsWrap: {marginTop: spacing.lg},
  resultsTitle: {...typography.h2, color: colors.primaryDark},
  resultsMeta: {fontSize: 12, color: colors.textMuted, marginBottom: spacing.md},
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  resultTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  resultName: {fontSize: 20, fontWeight: '800', color: colors.primaryDark},
  genderPill: {
    backgroundColor: colors.tabActive,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  genderPillText: {fontSize: 11, fontWeight: '800', color: colors.primary},
  meaning: {fontSize: 14, fontWeight: '600', color: colors.text, marginTop: 6, marginBottom: 4},
  detail: {fontSize: 12, color: colors.textSecondary, marginTop: 2},
  synRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8},
  synChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.full,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  synText: {fontSize: 11, fontWeight: '700', color: colors.primaryDark},
});
