export type RootStackParamList = {
  MainTabs: undefined;
  VedaDetail: {vedaId: string; title: string};
  ChapterReader: {chapterId: string; title: string; vedaTitle?: string};
  AudioPlayer: undefined;
  VideoPlayer: {
    url: string;
    title: string;
    subtitle?: string;
    playlist?: {url: string; title: string; subtitle?: string}[];
    startIndex?: number;
  };
  AartiDetail: {slug: string; title: string};
  PdfViewer: {url: string; title: string};
  StudyPathDetail: {slug: string; title: string};
  TopicDetail: {slug: string; title: string};
  AiGuru: undefined;
  MeditationTimer: undefined;
  QuizList: undefined;
  QuizPlay: {quizId: string; title: string};
  CultureHub: undefined;
  DeityDetail: {slug: string; title: string};
  TempleDetail: {slug: string; title: string};
  FestivalDetail: {slug: string; title: string};
};

export type TabParamList = {
  Home: undefined;
  Gyan: undefined;
  Aarti: undefined;
  Audio: undefined;
  Video: undefined;
  Search: undefined;
  Settings: undefined;
};
