jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    PanGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    NativeViewGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    ScrollView: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
  };
});

jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(),
    updateOptions: jest.fn(),
    reset: jest.fn(),
    add: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
    skip: jest.fn(),
    skipToNext: jest.fn(),
    skipToPrevious: jest.fn(),
    getActiveTrack: jest.fn(),
    getPosition: jest.fn(),
    setRate: jest.fn(),
    addEventListener: jest.fn(() => ({remove: jest.fn()})),
  },
  Capability: {},
  Event: {
    PlaybackActiveTrackChanged: 'playback-active-track-changed',
    PlaybackQueueEnded: 'playback-queue-ended',
  },
  State: {Playing: 'playing'},
  usePlaybackState: () => ({state: 'none'}),
  useProgress: () => ({position: 0, duration: 0}),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native-orientation-locker', () => ({
  unlockAllOrientations: jest.fn(),
  lockToPortrait: jest.fn(),
  lockToLandscape: jest.fn(),
  addOrientationListener: jest.fn(),
  removeOrientationListener: jest.fn(),
  getOrientation: jest.fn((cb: (o: string) => void) => cb('PORTRAIT')),
}));

jest.mock('react-native-webview', () => {
  const View = require('react-native').View;
  return {WebView: View, default: View};
});

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(() => Promise.resolve()),
  setIgnoreSilentSwitch: jest.fn(),
  requestInstallEngine: jest.fn(),
  setDefaultLanguage: jest.fn(() => Promise.resolve()),
  setDefaultVoice: jest.fn(() => Promise.resolve()),
  setDefaultRate: jest.fn(),
  setDucking: jest.fn(),
  voices: jest.fn(() => Promise.resolve([])),
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
  addEventListener: jest.fn(() => ({remove: jest.fn()})),
}));

jest.mock('@react-native-voice/voice', () => ({
  __esModule: true,
  default: {
    start: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
    cancel: jest.fn(() => Promise.resolve()),
    destroy: jest.fn(() => Promise.resolve()),
    removeAllListeners: jest.fn(),
    onSpeechResults: jest.fn(),
    onSpeechPartialResults: jest.fn(),
    onSpeechError: jest.fn(),
    onSpeechEnd: jest.fn(),
  },
}));
