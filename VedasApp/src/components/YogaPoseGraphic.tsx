import React from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';

interface Segment {
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: string;
  color?: string;
}

interface PoseLayout {
  head: {x: number; y: number};
  segments: Segment[];
}

const DARK = '#7a3200';
const ACCENT = '#c45c00';

const POSES: Record<string, PoseLayout> = {
  'stand-namaste': {
    head: {x: 45, y: 15},
    segments: [
      {x: 47, y: 24, w: 6, h: 26, color: DARK},
      {x: 43, y: 49, w: 5.5, h: 26, color: DARK},
      {x: 51, y: 49, w: 5.5, h: 26, color: DARK},
      {x: 41, y: 29, w: 4.5, h: 14, rot: '-25deg', color: ACCENT},
      {x: 54, y: 29, w: 4.5, h: 14, rot: '25deg', color: ACCENT},
    ],
  },
  'arms-overhead': {
    head: {x: 45, y: 17},
    segments: [
      {x: 47, y: 26, w: 6, h: 25, color: DARK},
      {x: 43, y: 50, w: 5.5, h: 26, color: DARK},
      {x: 51, y: 50, w: 5.5, h: 26, color: DARK},
      {x: 42, y: 6, w: 4.5, h: 22, rot: '-8deg', color: ACCENT},
      {x: 53, y: 6, w: 4.5, h: 22, rot: '8deg', color: ACCENT},
    ],
  },
  'forward-fold': {
    head: {x: 64, y: 46},
    segments: [
      {x: 40, y: 44, w: 6, h: 32, color: DARK},
      {x: 42, y: 40, w: 26, h: 6, rot: '18deg', color: DARK},
      {x: 58, y: 48, w: 4.5, h: 26, rot: '10deg', color: ACCENT},
    ],
  },
  'lunge-pose': {
    head: {x: 56, y: 20},
    segments: [
      {x: 50, y: 28, w: 6, h: 25, rot: '16deg', color: DARK},
      {x: 34, y: 48, w: 5.5, h: 28, rot: '42deg', color: DARK},
      {x: 62, y: 49, w: 5.5, h: 26, rot: '-12deg', color: DARK},
      {x: 56, y: 34, w: 4.5, h: 22, rot: '-22deg', color: ACCENT},
    ],
  },
  'plank-lower': {
    head: {x: 70, y: 42},
    segments: [
      {x: 24, y: 55, w: 48, h: 6, rot: '-22deg', color: DARK},
      {x: 64, y: 48, w: 5, h: 26, color: ACCENT},
    ],
  },
  'sit-dandasana': {
    head: {x: 30, y: 24},
    segments: [
      {x: 32, y: 34, w: 6.5, h: 32, color: DARK},
      {x: 34, y: 65, w: 46, h: 6.5, color: DARK},
      {x: 36, y: 44, w: 4.5, h: 24, rot: '-8deg', color: ACCENT},
    ],
  },
  'sit-cross': {
    head: {x: 45, y: 24},
    segments: [
      {x: 47, y: 34, w: 7, h: 25, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 36, y: 40, w: 4.5, h: 20, rot: '28deg', color: ACCENT},
      {x: 59, y: 40, w: 4.5, h: 20, rot: '-28deg', color: ACCENT},
    ],
  },
  'kneel-sit': {
    head: {x: 44, y: 20},
    segments: [
      {x: 46, y: 30, w: 6.5, h: 28, color: DARK},
      {x: 34, y: 62, w: 32, h: 7, color: DARK},
      {x: 52, y: 38, w: 4.5, h: 22, rot: '-18deg', color: ACCENT},
    ],
  },
  'lie-prone': {
    head: {x: 74, y: 60},
    segments: [
      {x: 20, y: 65, w: 54, h: 6.5, color: DARK},
      {x: 62, y: 60, w: 14, h: 4.5, rot: '-20deg', color: ACCENT},
    ],
  },
  'lie-supine': {
    head: {x: 16, y: 60},
    segments: [
      {x: 27, y: 64, w: 56, h: 6.5, color: DARK},
      {x: 36, y: 68, w: 20, h: 4.5, rot: '16deg', color: ACCENT},
    ],
  },
  'legs-90': {
    head: {x: 20, y: 60},
    segments: [
      {x: 30, y: 64, w: 34, h: 6.5, color: DARK},
      {x: 59, y: 18, w: 6.5, h: 48, color: DARK},
      {x: 36, y: 66, w: 18, h: 4.5, color: ACCENT},
    ],
  },
  'mudra-breath': {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 35, y: 40, w: 4.5, h: 21, rot: '30deg', color: ACCENT},
      {x: 60, y: 40, w: 4.5, h: 21, rot: '-30deg', color: ACCENT},
    ],
  },
  'surya-namaskar': {
    head: {x: 45, y: 18},
    segments: [
      {x: 47, y: 27, w: 6, h: 24, color: DARK},
      {x: 42, y: 49, w: 5.5, h: 26, rot: '10deg', color: DARK},
      {x: 52, y: 49, w: 5.5, h: 26, rot: '-10deg', color: DARK},
      {x: 38, y: 12, w: 4.5, h: 20, rot: '-25deg', color: ACCENT},
      {x: 57, y: 12, w: 4.5, h: 20, rot: '25deg', color: ACCENT},
    ],
  },
  tadasana: {
    head: {x: 45, y: 16},
    segments: [
      {x: 47, y: 25, w: 6, h: 26, color: DARK},
      {x: 43, y: 50, w: 5.5, h: 26, color: DARK},
      {x: 51, y: 50, w: 5.5, h: 26, color: DARK},
      {x: 42, y: 6, w: 4.5, h: 22, rot: '-8deg', color: ACCENT},
      {x: 53, y: 6, w: 4.5, h: 22, rot: '8deg', color: ACCENT},
    ],
  },
  vrikshasana: {
    head: {x: 45, y: 16},
    segments: [
      {x: 47, y: 25, w: 6, h: 26, color: DARK},
      {x: 46, y: 50, w: 6, h: 27, color: DARK},
      {x: 52, y: 50, w: 5, h: 16, rot: '-42deg', color: DARK},
      {x: 52, y: 60, w: 5, h: 14, rot: '38deg', color: DARK},
      {x: 40, y: 10, w: 4.5, h: 18, rot: '-20deg', color: ACCENT},
      {x: 55, y: 10, w: 4.5, h: 18, rot: '20deg', color: ACCENT},
    ],
  },
  trikonasana: {
    head: {x: 62, y: 30},
    segments: [
      {x: 34, y: 49, w: 5.5, h: 28, rot: '28deg', color: DARK},
      {x: 58, y: 49, w: 5.5, h: 28, rot: '-28deg', color: DARK},
      {x: 48, y: 38, w: 6, h: 22, rot: '58deg', color: DARK},
      {x: 63, y: 44, w: 4.5, h: 30, rot: '-12deg', color: ACCENT},
      {x: 59, y: 14, w: 4.5, h: 24, color: ACCENT},
    ],
  },
  virabhadrasana: {
    head: {x: 45, y: 18},
    segments: [
      {x: 47, y: 27, w: 6, h: 24, color: DARK},
      {x: 34, y: 48, w: 5.5, h: 29, rot: '32deg', color: DARK},
      {x: 62, y: 52, w: 5.5, h: 24, color: DARK},
      {x: 24, y: 31, w: 52, h: 4.5, color: ACCENT},
    ],
  },
  'adho-mukha-svanasana': {
    head: {x: 58, y: 44},
    segments: [
      {x: 34, y: 34, w: 6, h: 40, rot: '34deg', color: DARK},
      {x: 60, y: 34, w: 6, h: 40, rot: '-34deg', color: ACCENT},
    ],
  },
  padmasana: {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 24, y: 59, w: 52, h: 8, color: DARK},
      {x: 34, y: 38, w: 5, h: 22, rot: '35deg', color: ACCENT},
      {x: 61, y: 38, w: 5, h: 22, rot: '-35deg', color: ACCENT},
    ],
  },
  sukhasana: {
    head: {x: 45, y: 24},
    segments: [
      {x: 47, y: 34, w: 7, h: 25, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 36, y: 40, w: 4.5, h: 20, rot: '28deg', color: ACCENT},
      {x: 59, y: 40, w: 4.5, h: 20, rot: '-28deg', color: ACCENT},
    ],
  },
  vajrasana: {
    head: {x: 44, y: 20},
    segments: [
      {x: 46, y: 30, w: 6.5, h: 28, color: DARK},
      {x: 34, y: 62, w: 32, h: 7, color: DARK},
      {x: 52, y: 38, w: 4.5, h: 22, rot: '-18deg', color: ACCENT},
    ],
  },
  gomukhasana: {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 52, y: 16, w: 4.5, h: 22, rot: '22deg', color: ACCENT},
      {x: 38, y: 42, w: 4.5, h: 20, rot: '40deg', color: ACCENT},
    ],
  },
  'ardha-matsyendrasana': {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 28, y: 62, w: 38, h: 6.5, color: DARK},
      {x: 54, y: 44, w: 6, h: 22, rot: '-18deg', color: DARK},
      {x: 48, y: 40, w: 18, h: 4.5, rot: '24deg', color: ACCENT},
    ],
  },
  bhujangasana: {
    head: {x: 68, y: 30},
    segments: [
      {x: 20, y: 66, w: 42, h: 6.5, color: DARK},
      {x: 58, y: 42, w: 6.5, h: 28, rot: '28deg', color: DARK},
      {x: 62, y: 46, w: 4.5, h: 24, color: ACCENT},
    ],
  },
  dhanurasana: {
    head: {x: 68, y: 28},
    segments: [
      {x: 28, y: 60, w: 42, h: 7, color: DARK},
      {x: 24, y: 36, w: 6, h: 28, rot: '-22deg', color: DARK},
      {x: 64, y: 38, w: 6, h: 26, rot: '24deg', color: DARK},
      {x: 34, y: 36, w: 32, h: 4.5, rot: '-8deg', color: ACCENT},
    ],
  },
  'setu-bandhasana': {
    head: {x: 20, y: 60},
    segments: [
      {x: 28, y: 48, w: 38, h: 6.5, rot: '-24deg', color: DARK},
      {x: 64, y: 44, w: 6, h: 26, color: DARK},
      {x: 36, y: 66, w: 28, h: 4.5, color: ACCENT},
    ],
  },
  ustrasana: {
    head: {x: 30, y: 24},
    segments: [
      {x: 42, y: 34, w: 6.5, h: 26, rot: '-22deg', color: DARK},
      {x: 46, y: 64, w: 28, h: 6.5, color: DARK},
      {x: 52, y: 38, w: 4.5, h: 28, rot: '-30deg', color: ACCENT},
    ],
  },
  chakrasana: {
    head: {x: 34, y: 48},
    segments: [
      {x: 28, y: 42, w: 5.5, h: 30, rot: '10deg', color: DARK},
      {x: 66, y: 42, w: 5.5, h: 30, rot: '-10deg', color: DARK},
      {x: 34, y: 32, w: 34, h: 6.5, color: ACCENT},
    ],
  },
  paschimottanasana: {
    head: {x: 64, y: 46},
    segments: [
      {x: 24, y: 66, w: 52, h: 6.5, color: DARK},
      {x: 32, y: 54, w: 34, h: 6.5, rot: '18deg', color: DARK},
      {x: 52, y: 54, w: 24, h: 4.5, rot: '24deg', color: ACCENT},
    ],
  },
  halasana: {
    head: {x: 62, y: 62},
    segments: [
      {x: 50, y: 38, w: 6.5, h: 32, rot: '-35deg', color: DARK},
      {x: 24, y: 46, w: 36, h: 6, rot: '-42deg', color: DARK},
      {x: 60, y: 68, w: 22, h: 5, color: ACCENT},
    ],
  },
  sarvangasana: {
    head: {x: 58, y: 62},
    segments: [
      {x: 46, y: 12, w: 6.5, h: 54, color: DARK},
      {x: 52, y: 44, w: 4.5, h: 24, rot: '-25deg', color: ACCENT},
    ],
  },
  sirsasana: {
    head: {x: 45, y: 62},
    segments: [
      {x: 47, y: 12, w: 6.5, h: 52, color: DARK},
      {x: 36, y: 56, w: 4.5, h: 16, rot: '28deg', color: ACCENT},
      {x: 59, y: 56, w: 4.5, h: 16, rot: '-28deg', color: ACCENT},
    ],
  },
  balasana: {
    head: {x: 66, y: 56},
    segments: [
      {x: 26, y: 62, w: 24, h: 7, color: DARK},
      {x: 36, y: 50, w: 30, h: 6.5, rot: '18deg', color: DARK},
      {x: 58, y: 60, w: 22, h: 4.5, rot: '16deg', color: ACCENT},
    ],
  },
  shavasana: {
    head: {x: 16, y: 60},
    segments: [
      {x: 27, y: 64, w: 56, h: 6.5, color: DARK},
      {x: 36, y: 68, w: 20, h: 4.5, rot: '16deg', color: ACCENT},
    ],
  },
  'anulom-vilom': {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 35, y: 40, w: 4.5, h: 21, rot: '30deg', color: ACCENT},
      {x: 56, y: 30, w: 4.5, h: 20, rot: '-35deg', color: ACCENT},
    ],
  },
  kapalbhati: {
    head: {x: 45, y: 22},
    segments: [
      {x: 47, y: 32, w: 7, h: 26, color: DARK},
      {x: 26, y: 60, w: 48, h: 7.5, color: DARK},
      {x: 35, y: 40, w: 4.5, h: 21, rot: '30deg', color: ACCENT},
      {x: 60, y: 40, w: 4.5, h: 21, rot: '-30deg', color: ACCENT},
    ],
  },
};

export function YogaPoseGraphic({poseId, size = 100}: {poseId: string; size?: number}) {
  const layout = POSES[poseId] ?? POSES['anulom-vilom'];
  const scale = size / 100;

  return (
    <View style={[styles.canvas, {width: size, height: size * 0.85, borderRadius: 14 * scale}]}>
      <View
        style={[
          styles.halo,
          {
            width: 72 * scale,
            height: 72 * scale,
            borderRadius: 36 * scale,
            left: 14 * scale,
            top: 4 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.mat,
          {
            width: 78 * scale,
            height: 5 * scale,
            borderRadius: 2.5 * scale,
            left: 11 * scale,
            top: 72 * scale,
          },
        ]}
      />
      <View
        style={[
          styles.head,
          {
            width: 11 * scale,
            height: 11 * scale,
            borderRadius: 5.5 * scale,
            left: layout.head.x * scale,
            top: layout.head.y * scale,
          },
        ]}
      />
      {layout.segments.map((seg, idx) => (
        <View
          key={idx}
          style={[
            styles.seg,
            {
              left: seg.x * scale,
              top: seg.y * scale,
              width: seg.w * scale,
              height: seg.h * scale,
              borderRadius: (Math.min(seg.w, seg.h) / 2) * scale,
              backgroundColor: seg.color ?? DARK,
              transform: seg.rot ? [{rotate: seg.rot}] : undefined,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: '#fff5ea',
    borderWidth: 1,
    borderColor: 'rgba(196,92,0,0.18)',
    overflow: 'hidden',
    position: 'relative',
  },
  halo: {
    position: 'absolute',
    backgroundColor: 'rgba(232,146,42,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(232,146,42,0.28)',
  },
  mat: {
    position: 'absolute',
    backgroundColor: 'rgba(196,92,0,0.32)',
  },
  head: {
    position: 'absolute',
    backgroundColor: colors.primaryDark,
  },
  seg: {
    position: 'absolute',
  },
});
