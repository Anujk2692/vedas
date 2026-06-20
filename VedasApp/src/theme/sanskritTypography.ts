import {TextStyle} from 'react-native';
import {sanskritFontFamily} from './fonts';

export function sanskritTextStyle(
  fontSize = 22,
  options?: {bold?: boolean; lineHeightMultiplier?: number},
): TextStyle {
  const bold = options?.bold ?? false;
  const lineHeightMultiplier = options?.lineHeightMultiplier ?? 1.65;

  return {
    fontFamily: sanskritFontFamily(bold),
    fontSize,
    lineHeight: Math.round(fontSize * lineHeightMultiplier),
    letterSpacing: 0.3,
    fontWeight: bold ? '700' : '400',
  };
}
