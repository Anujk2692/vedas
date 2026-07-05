export interface Language {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  script: string;
  rtl: boolean;
}

export interface Veda {
  id: string;
  slug: string;
  order: number;
  scriptureType?: string;
  sanskritName: string;
  transliteration: string;
  title: string;
  description: string;
  coverImageUrl: string;
  chapterCount: number;
  verseCount: number;
  overview?: string;
  significance?: string;
  structure?: string;
  historicalContext?: string;
  period?: string;
  divisionName?: string;
  divisionCount?: number;
  mantraCount?: number;
  compositionType?: string;
  branches?: string;
  primaryDeities?: string[];
  keyThemes?: string[];
  famousSages?: string[];
  specialFeatures?: string;
  philosophy?: string;
  ritualsAndPractices?: string;
  famousHymns?: string[];
  learningGuide?: string;
  coreConcepts?: string[];
  modernRelevance?: string;
  relatedTexts?: string;
  pronunciationGuide?: string;
}

export interface Chapter {
  id: string;
  vedaId: string;
  number: number;
  sanskritName: string;
  transliteration: string;
  title: string;
  summary: string;
  verseCount: number;
  audioUrl: string;
  videoUrl: string;
  durationSeconds: number;
  overview?: string;
  divisionLabel?: string;
  suktaCount?: number;
  mantraCount?: number;
  attributedSages?: string[];
  keyThemes?: string[];
  notableSuktas?: string[];
}

export interface Verse {
  id: string;
  vedaId: string;
  chapterId: string;
  number: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary: string;
  audioUrl: string;
  videoUrl: string;
  audioDurationSeconds: number;
  suktaReference?: string;
  rishi?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'AUDIO' | 'VIDEO';
  vedaId: string;
  chapterId: string;
  verseId: string;
  url: string;
  thumbnailUrl: string;
  durationSeconds: number;
  languageCode: string;
  reciter: string;
  description: string;
  featured: boolean;
}

export interface SearchResult {
  vedas: Veda[];
  chapters: Chapter[];
  verses: Verse[];
  media: MediaItem[];
  aartis?: AartiSummary[];
}

export interface AartiSummary {
  id: string;
  slug: string;
  order: number;
  deityType: 'DEVI' | 'DEVTA';
  sanskritName: string;
  transliteration: string;
  title: string;
  description: string;
  coverImageUrl: string;
  hasPdf: boolean;
  hasAudio: boolean;
  hasVideo: boolean;
}

export interface AartiLine {
  sanskrit: string;
  transliteration: string;
  translation: string;
}

export interface AartiRecording {
  id: string;
  type: 'AUDIO' | 'VIDEO';
  title: string;
  singer: string;
  style: string;
  url: string;
  durationSeconds: number;
}

export interface AartiDetail extends AartiSummary {
  pdfUrl: string;
  audioUrl: string;
  videoUrl: string;
  audioDurationSeconds: number;
  videoDurationSeconds: number;
  reciter: string;
  lines: AartiLine[];
  recordings?: AartiRecording[];
}

export interface TranslateResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork?: string;
  duration: number;
}

export interface Topic {
  id: string;
  slug: string;
  order: number;
  icon: string;
  title: string;
  description: string;
  summary: string;
  relatedScriptureSlugs?: string[];
}

export interface StudyPathStep {
  order: number;
  title: string;
  description: string;
  durationHint?: string;
  scriptureSlug?: string;
  actionType?: string;
}

export interface StudyPath {
  id: string;
  slug: string;
  order: number;
  level: string;
  durationLabel: string;
  icon: string;
  title: string;
  description: string;
  steps: StudyPathStep[];
}

export interface ExternalResource {
  id: string;
  slug: string;
  order: number;
  type: string;
  url: string;
  sourceName: string;
  title: string;
  description: string;
  scriptureSlug?: string;
  topicSlug?: string;
}

export interface SanatanHub {
  topics: Topic[];
  studyPaths: StudyPath[];
  resources: ExternalResource[];
  scripturesByType: Veda[];
}

export interface DailyShlok {
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary: string;
  source: string;
  scriptureSlug: string;
  theme: string;
}

export interface Panchang {
  dateLabel: string;
  weekday: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  festival: string;
  note: string;
}

export interface AskRequest {
  question: string;
  lang?: string;
}

export interface AskResponse {
  answer: string;
  relatedScriptures: Veda[];
  relatedChapters: Chapter[];
  relatedVerses: Verse[];
  relatedTopics: Topic[];
}
