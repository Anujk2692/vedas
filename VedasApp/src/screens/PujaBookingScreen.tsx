import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {api} from '../api/client';
import type {PujaBooking, PujaCatalogItem, TempleAudioItem} from '../api/types';
import {useAudioPlayer} from '../context/AudioPlayerContext';
import {useRequireSubscription, useSubscription} from '../context/SubscriptionContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function PujaBookingScreen() {
  useRequireSubscription('Temple Puja & Audio');
  const {themeColors} = useUserPreferences();
  const {accountKey} = useSubscription();
  const {playTrack} = useAudioPlayer();

  const [pujas, setPujas] = useState<PujaCatalogItem[]>([]);
  const [audios, setAudios] = useState<TempleAudioItem[]>([]);
  const [bookings, setBookings] = useState<PujaBooking[]>([]);
  const [devoteeName, setDevoteeName] = useState('');
  const [gotra, setGotra] = useState('Kashyap');
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [statusMsg, setStatusMsg] = useState('');

  const loadBookings = useCallback(() => {
    api.myPujas(accountKey).then(setBookings).catch(() => undefined);
  }, [accountKey]);

  useEffect(() => {
    api.getSevaCatalog().then(res => {
      setPujas(res.pujas);
      setAudios(res.templeAudios);
    }).catch(() => undefined);
    loadBookings();
  }, [loadBookings]);

  const handleBook = async (p: PujaCatalogItem) => {
    const booked = await api.bookPuja({
      accountKey,
      pujaCode: p.code,
      devoteeName: devoteeName.trim() || 'Devotee',
      gotra,
      bookingDate,
    });
    setStatusMsg(`Confirmed: ${booked.pujaTitle} (${booked.bookingDate})`);
    loadBookings();
  };

  return (
    <ScrollView style={[styles.root, {backgroundColor: themeColors.background}]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, {color: themeColors.primaryDark}]}>🔔 Temple Audio Collection</Text>
      {audios.map(a => (
        <View key={a.id} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
          <Text style={[styles.title, {color: themeColors.text}]}>{a.titleEn}</Text>
          <Text style={[styles.meta, {color: themeColors.textSecondary}]}>{a.templeName} · {a.durationLabel}</Text>
          <Pressable
            style={styles.outlineBtn}
            onPress={() =>
              playTrack({
                id: a.id,
                title: a.titleEn,
                artist: a.templeName,
                url: a.streamUrl,
                duration: 240,
              })
            }>
            <Text style={styles.outlineText}>▶ Play Temple Audio</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.heading}>🛕 Book Temple Chadhava & Puja</Text>
      <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
        <TextInput style={styles.input} value={devoteeName} onChangeText={setDevoteeName} placeholder="Devotee Full Name" />
        <TextInput style={styles.input} value={gotra} onChangeText={setGotra} placeholder="Gotra (e.g. Kashyap)" />
        <TextInput style={styles.input} value={bookingDate} onChangeText={setBookingDate} placeholder="YYYY-MM-DD" />
      </View>

      {statusMsg ? <Text style={styles.ok}>{statusMsg}</Text> : null}

      {pujas.map(p => (
        <View key={p.code} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
          <Text style={styles.title}>{p.titleEn} · {p.priceDisplay}</Text>
          <Text style={styles.meta}>{p.templeName}</Text>
          <Text style={styles.meta}>{p.benefitsEn}</Text>
          <Pressable style={styles.primaryBtn} onPress={() => handleBook(p)}>
            <Text style={styles.primaryBtnText}>Book Seva ({p.priceDisplay})</Text>
          </Pressable>
        </View>
      ))}

      {bookings.length ? <Text style={styles.heading}>📜 My Bookings</Text> : null}
      {bookings.map(b => (
        <View key={b.id} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
          <Text style={styles.title}>{b.pujaTitle} · {b.status}</Text>
          <Text style={styles.meta}>{b.templeName} · {b.bookingDate}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: spacing.md, paddingBottom: 80, gap: 10},
  heading: {fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginTop: 6},
  card: {borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, gap: 6, ...shadows.sm},
  title: {fontSize: 14, fontWeight: '800', color: '#1f2937'},
  meta: {fontSize: 13, color: '#4b5563'},
  input: {borderWidth: 1, borderColor: '#e2d5c8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fff'},
  primaryBtn: {backgroundColor: colors.primary, paddingVertical: 10, borderRadius: borderRadius.full, alignItems: 'center'},
  primaryBtnText: {color: colors.white, fontWeight: '800'},
  outlineBtn: {borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 8, borderRadius: borderRadius.full, alignItems: 'center'},
  outlineText: {color: colors.primaryDark, fontWeight: '800'},
  ok: {backgroundColor: '#dcfce7', color: '#166534', padding: 10, borderRadius: 10, fontWeight: '700'},
});
