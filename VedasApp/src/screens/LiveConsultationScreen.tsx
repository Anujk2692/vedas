import React, {useEffect, useState} from 'react';
import {Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {api} from '../api/client';
import type {AstrologerProfile, ConsultationMessage, ConsultationSessionView} from '../api/types';
import {useRequireSubscription, useSubscription} from '../context/SubscriptionContext';
import {useUserPreferences} from '../context/UserPreferencesContext';
import {borderRadius, colors, shadows, spacing} from '../theme/colors';

export function LiveConsultationScreen() {
  useRequireSubscription('Live Astrologer Consultation');
  const {themeColors} = useUserPreferences();
  const {accountKey} = useSubscription();

  const [astrologers, setAstrologers] = useState<AstrologerProfile[]>([]);
  const [topic, setTopic] = useState('Kundli & Career Guidance');
  const [session, setSession] = useState<ConsultationSessionView | null>(null);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    api.getAstrologers().then(setAstrologers).catch(() => undefined);
  }, []);

  const startSession = async (a: AstrologerProfile, mode: string) => {
    const s = await api.bookConsultation({accountKey, astrologerId: a.id, mode, topic});
    setSession(s);
    setMessages(await api.getConsultationMessages(s.id));
  };

  const send = async () => {
    if (!session || !draft.trim()) {
      return;
    }
    const text = draft.trim();
    setDraft('');
    setMessages(await api.sendConsultationMessage(session.id, accountKey, text));
  };

  return (
    <ScrollView style={[styles.root, {backgroundColor: themeColors.background}]} contentContainerStyle={styles.content}>
      <View style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
        <Text style={styles.title}>Consultation Topic</Text>
        <TextInput style={styles.input} value={topic} onChangeText={setTopic} />
      </View>

      {astrologers.map(a => (
        <View key={a.id} style={[styles.card, {backgroundColor: themeColors.surface, borderColor: themeColors.borderLight}]}>
          <Text style={[styles.title, {color: themeColors.text}]}>{a.name} · ● LIVE</Text>
          <Text style={[styles.meta, {color: themeColors.textSecondary}]}>{a.specialtyEn}</Text>
          <Text style={[styles.meta, {color: themeColors.textSecondary}]}>{a.languages} · ⭐ {a.rating} · {a.feeDisplay}</Text>
          <View style={styles.btnRow}>
            {a.modes.map(m => (
              <Pressable key={m} style={styles.modeBtn} onPress={() => startSession(a, m)}>
                <Text style={styles.modeText}>{m}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {session ? (
        <View style={[styles.card, styles.roomCard]}>
          <Text style={styles.title}>Live Room: {session.astrologerName} ({session.mode})</Text>
          <Pressable style={styles.outlineBtn} onPress={() => Linking.openURL(session.joinUrl)}>
            <Text style={styles.outlineText}>📹 Join Audio / Video Call</Text>
          </Pressable>
          {messages.map(m => (
            <View key={m.id} style={[styles.msg, m.senderRole === 'USER' && styles.userMsg]}>
              <Text style={styles.msgText}>{m.senderName}: {m.message}</Text>
            </View>
          ))}
          <View style={styles.sendRow}>
            <TextInput style={[styles.input, {flex: 1}]} value={draft} onChangeText={setDraft} placeholder="Ask question…" />
            <Pressable style={styles.sendBtn} onPress={send}>
              <Text style={styles.modeText}>Send</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  content: {padding: spacing.md, paddingBottom: 80, gap: 10},
  card: {borderRadius: borderRadius.lg, padding: spacing.md, borderWidth: 1, gap: 6, ...shadows.sm},
  roomCard: {backgroundColor: '#fffaf5', borderColor: colors.primary, borderWidth: 2},
  title: {fontSize: 14, fontWeight: '800', color: '#1f2937'},
  meta: {fontSize: 13, color: '#4b5563'},
  input: {borderWidth: 1, borderColor: '#e2d5c8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: '#fff'},
  btnRow: {flexDirection: 'row', gap: 8, marginTop: 4},
  modeBtn: {backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full},
  modeText: {color: colors.white, fontWeight: '800', fontSize: 12},
  outlineBtn: {borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 8, borderRadius: borderRadius.full, alignItems: 'center'},
  outlineText: {color: colors.primaryDark, fontWeight: '800'},
  msg: {backgroundColor: '#f3ece4', padding: 8, borderRadius: 8},
  userMsg: {backgroundColor: '#fde6cc'},
  msgText: {fontSize: 13, color: '#1f2937'},
  sendRow: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  sendBtn: {backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: borderRadius.full},
});
