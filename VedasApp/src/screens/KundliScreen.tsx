import React, {useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {api} from '../api/client';
import type {KundliRequest, KundliResponse, MilanResponse} from '../api/types';
import {useRequireSubscription} from '../context/SubscriptionContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function KundliScreen() {
  useRequireSubscription('Full Astronomical Kundli & Milan');
  const {themeColors} = useUserPreferences();
  const [tab, setTab] = useState<'kundli' | 'milan'>('kundli');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('Anuj');
  const [birthDate, setBirthDate] = useState('1992-06-26');
  const [birthTime, setBirthTime] = useState('09:15');
  const [kundli, setKundli] = useState<KundliResponse | null>(null);

  const [boyDate, setBoyDate] = useState('1992-06-26');
  const [boyTime, setBoyTime] = useState('09:15');
  const [girlDate, setGirlDate] = useState('1994-08-15');
  const [girlTime, setGirlTime] = useState('14:30');
  const [milan, setMilan] = useState<MilanResponse | null>(null);

  const runKundli = async () => {
    setLoading(true);
    try {
      const req: KundliRequest = {name, birthDate, birthTime, latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5};
      setKundli(await api.computeKundli(req));
    } finally {
      setLoading(false);
    }
  };

  const runMilan = async () => {
    setLoading(true);
    try {
      setMilan(
        await api.computeMilan(
          {name: 'Boy', birthDate: boyDate, birthTime: boyTime, latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5},
          {name: 'Girl', birthDate: girlDate, birthTime: girlTime, latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5},
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.root, {backgroundColor: themeColors.background}]} contentContainerStyle={styles.content}>
      <View style={styles.tabRow}>
        <Pressable style={[styles.tabBtn, tab === 'kundli' && styles.tabBtnOn]} onPress={() => setTab('kundli')}>
          <Text style={[styles.tabText, tab === 'kundli' && styles.tabTextOn]}>🪐 Full Kundli + KP</Text>
        </Pressable>
        <Pressable style={[styles.tabBtn, tab === 'milan' && styles.tabBtnOn]} onPress={() => setTab('milan')}>
          <Text style={[styles.tabText, tab === 'milan' && styles.tabTextOn]}>💍 36-Guna Milan</Text>
        </Pressable>
      </View>

      {tab === 'kundli' ? (
        <>
          <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
            <Text style={[styles.label, {color: themeColors.primaryDark}]}>Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />
            <Text style={[styles.label, {color: themeColors.primaryDark}]}>Birth Date (YYYY-MM-DD)</Text>
            <TextInput style={styles.input} value={birthDate} onChangeText={setBirthDate} />
            <Text style={[styles.label, {color: themeColors.primaryDark}]}>Birth Time (HH:mm)</Text>
            <TextInput style={styles.input} value={birthTime} onChangeText={setBirthTime} />
            <Pressable style={styles.primaryBtn} onPress={runKundli} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? 'Calculating…' : 'Generate Astronomical Kundli'}</Text>
            </Pressable>
          </View>

          {loading ? <ActivityIndicator color={colors.primary} /> : null}

          {kundli ? (
            <>
              <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
                <Text style={styles.sectionTitle}>Lagna: {kundli.lagnaSign}</Text>
                <Text style={styles.meta}>Moon: {kundli.moonSign} · {kundli.nakshatra} (Pada {kundli.pada})</Text>
                <Text style={styles.meta}>Lahiri Ayanamsa: {kundli.ayanamsaFormatted}</Text>
                <Text style={[styles.meta, kundli.manglik && {color: '#b42318', fontWeight: '700'}]}>{kundli.manglikReason}</Text>
              </View>

              <Text style={styles.heading}>Planets (D1 · D9 Navamsa · KP Sub-Lord)</Text>
              {kundli.planets.map(p => (
                <View key={p.planet} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
                  <Text style={styles.sectionTitle}>{p.planet} {p.retrograde ? '(R)' : ''} — {p.sign}</Text>
                  <Text style={styles.meta}>Deg: {p.degreeFormatted} · House {p.house} · {p.nakshatra} (P{p.pada})</Text>
                  <Text style={styles.meta}>KP Star/Sub: {p.starLord} / {p.subLord} · D9: {p.navamsaSign}</Text>
                </View>
              ))}

              <Text style={styles.heading}>Vimshottari Mahadasha</Text>
              {kundli.mahadashas.map(d => (
                <View key={d.planet} style={[styles.card, d.current && styles.currentCard, {borderColor: themeColors.borderLight}]}>
                  <Text style={styles.sectionTitle}>{d.planet} {d.current ? '● ACTIVE' : ''}</Text>
                  <Text style={styles.meta}>{d.startDate} → {d.endDate} ({d.years} yrs)</Text>
                </View>
              ))}

              <Text style={styles.heading}>Lal Kitab Remedies</Text>
              {kundli.lalKitab.map(lk => (
                <View key={lk.planet} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
                  <Text style={styles.sectionTitle}>{lk.planet} (House {lk.house}) · {lk.status}</Text>
                  <Text style={styles.meta}>{lk.remedyEn}</Text>
                  <Text style={styles.meta}>{lk.remedyHi}</Text>
                </View>
              ))}
            </>
          ) : null}
        </>
      ) : (
        <>
          <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
            <Text style={styles.sectionTitle}>Boy Birth Details</Text>
            <TextInput style={styles.input} value={boyDate} onChangeText={setBoyDate} placeholder="YYYY-MM-DD" />
            <TextInput style={styles.input} value={boyTime} onChangeText={setBoyTime} placeholder="HH:mm" />
            <Text style={styles.sectionTitle}>Girl Birth Details</Text>
            <TextInput style={styles.input} value={girlDate} onChangeText={setGirlDate} placeholder="YYYY-MM-DD" />
            <TextInput style={styles.input} value={girlTime} onChangeText={setGirlTime} placeholder="HH:mm" />
            <Pressable style={styles.primaryBtn} onPress={runMilan} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? 'Matching…' : 'Check 36-Guna Ashtakoot Milan'}</Text>
            </Pressable>
          </View>

          {milan ? (
            <>
              <View style={[styles.card, styles.currentCard]}>
                <Text style={styles.sectionTitle}>Score: {milan.totalScore} / {milan.maxScore}</Text>
                <Text style={styles.meta}>{milan.verdict}</Text>
                <Text style={styles.meta}>Boy: {milan.boyRashi} ({milan.boyNakshatra})</Text>
                <Text style={styles.meta}>Girl: {milan.girlRashi} ({milan.girlNakshatra})</Text>
              </View>
              {milan.kootas.map(k => (
                <View key={k.name} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
                  <Text style={styles.sectionTitle}>{k.name}: {k.obtained} / {k.max}</Text>
                  <Text style={styles.meta}>{k.detail}</Text>
                </View>
              ))}
            </>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: spacing.md, paddingBottom: 80, gap: 10},
  tabRow: {flexDirection: 'row', gap: 8},
  tabBtn: {flex: 1, paddingVertical: 10, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.primary, alignItems: 'center'},
  tabBtnOn: {backgroundColor: colors.primary},
  tabText: {fontWeight: '800', color: colors.primaryDark, fontSize: 13},
  tabTextOn: {color: colors.white},
  card: {borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, gap: 4, ...shadows.sm},
  currentCard: {backgroundColor: '#fff8f0', borderColor: colors.primary, borderWidth: 2},
  label: {fontSize: 12, fontWeight: '700'},
  input: {borderWidth: 1, borderColor: '#e2d5c8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fff'},
  primaryBtn: {backgroundColor: colors.primary, paddingVertical: 12, borderRadius: borderRadius.full, alignItems: 'center', marginTop: 6},
  primaryBtnText: {color: colors.white, fontWeight: '800'},
  heading: {fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginTop: 6},
  sectionTitle: {fontSize: 14, fontWeight: '800', color: '#1f2937'},
  meta: {fontSize: 13, color: '#4b5563'},
});
