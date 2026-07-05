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
  festival: string;
  note: string;
}

export interface AskResponse {
  answer: string;
  relatedScriptures: Veda[];
  relatedChapters: Chapter[];
  relatedVerses: Verse[];
  relatedTopics: Topic[];
}
