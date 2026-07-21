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
  philosophy?: string;
  learningGuide?: string;
  pdfUrl?: string;
  pdfTitle?: string;
  pdfSourceName?: string;
  hasPdf?: boolean;
  pdfEditions?: ScripturePdfEdition[];
}

export interface ScripturePdfEdition {
  title: string;
  url: string;
  sourceName: string;
  language: string;
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
}

export interface SearchResult {
  vedas: Veda[];
  chapters: Chapter[];
  verses: Verse[];
  media: unknown[];
  aartis?: AartiSummary[];
}

export interface AartiSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  deityType: 'DEVI' | 'DEVTA';
  sanskritName: string;
}

export interface AartiLine {
  sanskrit: string;
  transliteration: string;
  translation: string;
}

export interface AartiDetail extends AartiSummary {
  lines: AartiLine[];
  pdfUrl: string;
  audioUrl: string;
}

export interface Topic {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  summary: string;
  simpleExplanation?: string;
  detailedExplanation?: string;
  relatedScriptureSlugs?: string[];
}

export interface StudyPathStep {
  order: number;
  title: string;
  description: string;
  scriptureSlug?: string;
}

export interface StudyPath {
  slug: string;
  icon: string;
  title: string;
  description: string;
  durationLabel: string;
  level: string;
  steps: StudyPathStep[];
}

export interface ExternalResource {
  slug: string;
  type: string;
  url: string;
  sourceName: string;
  title: string;
  description: string;
}

export interface SanatanHub {
  topics: Topic[];
  studyPaths: StudyPath[];
  resources: ExternalResource[];
}

export interface DailyShlok {
  sanskrit: string;
  transliteration: string;
  translation: string;
  source: string;
  theme: string;
  scriptureSlug: string;
}

export interface Panchang {
  dateLabel: string;
  weekday: string;
  tithi: string;
  nakshatra?: string;
  yoga?: string;
  festival: string;
  festivalWhy?: string;
  festivalRitual?: string;
  note: string;
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  topicSlug: string;
  questionCount: number;
  level: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scriptureRef?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  topicSlug: string;
  level: string;
  questions: QuizQuestion[];
}

export interface Deity {
  slug: string;
  category: string;
  name: string;
  sanskritName: string;
  story: string;
  symbolism: string;
  family: string;
  weapons: string;
  vehicles: string;
  mantras: string[];
  festivalSlugs: string[];
  templeSlugs: string[];
  imageUrl?: string;
}

export interface Temple {
  slug: string;
  name: string;
  deitySlug: string;
  location: string;
  history: string;
  importance: string;
  architecture: string;
  timings: string;
  festivalSlugs: string[];
  nearby: string;
  virtualTourUrl?: string;
  imageUrl?: string;
}

export interface FestivalGuide {
  slug: string;
  name: string;
  whenLabel: string;
  why: string;
  story: string;
  rituals: string;
  pujaMethod: string;
  mantras: string;
  bhog: string;
  regionalTraditions: string;
  deitySlugs: string[];
}

export interface AskResponse {
  answer: string;
  aiPowered?: boolean;
  relatedScriptures: Veda[];
  relatedChapters: Chapter[];
  relatedVerses: Verse[];
  relatedTopics: Topic[];
}
