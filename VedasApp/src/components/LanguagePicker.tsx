import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useLanguage} from '../context/LanguageContext';
import {borderRadius, colors, shadows, spacing, typography} from '../theme/colors';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function LanguagePicker({visible, onClose}: Props) {
  const {languages, language, setLanguage} = useLanguage();
  const insets = useSafeAreaInsets();

  const handleSelect = async (code: string) => {
    await setLanguage(code);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, {paddingBottom: Math.max(insets.bottom, spacing.lg)}]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choose Language</Text>
          <Text style={styles.subtitle}>
            Applies to reading translations and media descriptions
          </Text>
          <FlatList
            data={languages}
            keyExtractor={item => item.code}
            style={styles.list}
            renderItem={({item}) => {
              const active = language === item.code;
              return (
                <Pressable
                  style={({pressed}) => [
                    styles.option,
                    active && styles.optionActive,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => handleSelect(item.code)}>
                  <View style={styles.optionContent}>
                    <Text style={[styles.nativeName, active && styles.nativeNameActive]}>
                      {item.nativeName}
                    </Text>
                    <Text style={styles.englishName}>
                      {item.name} · {item.script}
                    </Text>
                  </View>
                  {active && (
                    <View style={styles.checkWrap}>
                      <Text style={styles.check}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            }}
          />
          <Pressable style={({pressed}) => [styles.closeBtn, pressed && styles.pressed]} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    maxHeight: '75%',
    ...shadows.lg,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 22,
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 19,
  },
  list: {
    maxHeight: 340,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionActive: {
    backgroundColor: colors.tabActive,
    borderColor: colors.border,
  },
  optionContent: {flex: 1},
  nativeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  nativeNameActive: {
    color: colors.primaryDark,
  },
  englishName: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '800',
  },
  closeBtn: {
    marginTop: spacing.md,
    padding: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
  },
  closeText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  pressed: {opacity: 0.9},
});
