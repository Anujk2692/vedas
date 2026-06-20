import React from 'react';
import {StyleSheet, Text, type StyleProp, type TextStyle} from 'react-native';
import {SelectableReadableText} from './SelectableReadableText';
import {sanskritTextStyle} from '../theme/sanskritTypography';

interface Props {
  text: string;
  style?: StyleProp<TextStyle>;
  size?: number;
  bold?: boolean;
  selectable?: boolean;
  numberOfLines?: number;
}

/** Devanagari text with Noto Sans Devanagari and readable line spacing */
export function SanskritText({
  text,
  style,
  size = 22,
  bold = false,
  selectable = true,
  numberOfLines,
}: Props) {
  const baseStyle = sanskritTextStyle(size, {bold});

  if (selectable) {
    return <SelectableReadableText text={text} style={[baseStyle, style]} />;
  }

  return (
    <Text style={[baseStyle, style]} numberOfLines={numberOfLines}>
      {text}
    </Text>
  );
}

/** Static style helper for StyleSheet.create */
export const sanskritStyles = StyleSheet.create({
  hero: sanskritTextStyle(34, {bold: true}),
  title: sanskritTextStyle(22, {bold: true}),
  body: sanskritTextStyle(20),
  caption: sanskritTextStyle(17, {bold: true}),
  list: sanskritTextStyle(15, {bold: true}),
});
