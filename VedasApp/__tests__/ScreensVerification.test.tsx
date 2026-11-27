import {YOGA_ASANAS} from '../src/data/yogaAsanas';
import {THEMES} from '../src/theme/colors';
import {speakDevotionalText, speakAnswerText, stopSpeech} from '../src/utils/speech';

import {HomeScreen} from '../src/screens/HomeScreen';
import {GyanScreen} from '../src/screens/GyanScreen';
import {AartiListScreen} from '../src/screens/AartiListScreen';
import {AartiDetailScreen} from '../src/screens/AartiDetailScreen';
import {DevotionalScreen} from '../src/screens/DevotionalScreen';
import {MeditationTimerScreen} from '../src/screens/MeditationTimerScreen';
import {AiGuruScreen} from '../src/screens/AiGuruScreen';
import {ChildNameScreen} from '../src/screens/ChildNameScreen';
import {SettingsScreen} from '../src/screens/SettingsScreen';
import {VedaDetailScreen} from '../src/screens/VedaDetailScreen';
import {ChapterReaderScreen} from '../src/screens/ChapterReaderScreen';
import {TopicDetailScreen} from '../src/screens/TopicDetailScreen';
import {AudioScreen} from '../src/screens/AudioScreen';
import {VideoScreen} from '../src/screens/VideoScreen';
import {SearchScreen} from '../src/screens/SearchScreen';
import {CultureHubScreen} from '../src/screens/CultureHubScreen';
import {QuizListScreen} from '../src/screens/QuizListScreen';

describe('VedasApp cross-platform screen & module verification', () => {
  it('exports all primary screens cleanly for iOS and Android', () => {
    const screens = [
      HomeScreen,
      GyanScreen,
      AartiListScreen,
      AartiDetailScreen,
      DevotionalScreen,
      MeditationTimerScreen,
      AiGuruScreen,
      ChildNameScreen,
      SettingsScreen,
      VedaDetailScreen,
      ChapterReaderScreen,
      TopicDetailScreen,
      AudioScreen,
      VideoScreen,
      SearchScreen,
      CultureHubScreen,
      QuizListScreen,
    ];
    for (const Screen of screens) {
      expect(typeof Screen).toBe('function');
    }
  });

  it('includes all 24 Yoga asanas with matching step graphics, benefits, and video IDs', () => {
    expect(YOGA_ASANAS).toHaveLength(24);
    for (const asana of YOGA_ASANAS) {
      expect(asana.id.length).toBeGreaterThan(2);
      expect(asana.videoId.length).toBe(11);
      expect(asana.stepsEn.length).toBeGreaterThanOrEqual(3);
      expect(asana.stepsHi.length).toBe(asana.stepsEn.length);
      expect(asana.stepGraphics.length).toBe(asana.stepsEn.length);
      expect(asana.benefitsEn.length).toBeGreaterThanOrEqual(2);
      expect(asana.benefitsHi.length).toBe(asana.benefitsEn.length);
    }
  });

  it('defines complete Light, Sepia, and Dark theme palettes and speech helpers', () => {
    expect(THEMES.light.background).toBeTruthy();
    expect(THEMES.sepia.background).toBeTruthy();
    expect(THEMES.dark.background).toBe('#121212');
    expect(typeof speakDevotionalText).toBe('function');
    expect(typeof speakAnswerText).toBe('function');
    expect(typeof stopSpeech).toBe('function');
  });
});
