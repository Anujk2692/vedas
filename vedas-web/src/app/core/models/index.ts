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
  transliteration?: string;
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

export interface ChildNameRequest {
  fatherName: string;
  motherName: string;
  deity?: string;
  gender?: string;
  religion?: string;
  country?: string;
  language?: string;
  startingLetter?: string;
}

export interface ChildNameSuggestion {
  name: string;
  scriptText: string;
  pronunciation: string;
  meaning: string;
  spiritualSignificance: string;
  combinationSource: string;
  deityConnection: string;
  gender: string;
  religion: string;
  origin: string;
  rashi: string;
  nakshatra: string;
  numerologyNumber: number;
  numerologyTrait: string;
  luckyDay: string;
  luckyColor: string;
  synonyms: string[];
}

export interface ChildNameResponse {
  fatherName: string;
  motherName: string;
  deity: string;
  religion: string;
  country: string;
  language: string;
  totalSuggestions: number;
  suggestions: ChildNameSuggestion[];
}

export interface DevotionalLine {
  sanskrit: string;
  transliteration: string;
  translation: string;
}

export interface DevotionalItem {
  slug: string;
  kind: 'CHALISA' | 'BHAJAN';
  deity: string;
  title: string;
  sanskritName: string;
  description: string;
  lineCount: number;
  lines?: DevotionalLine[];
}

export interface SubscriptionPlan {
  code: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  titleEn: string;
  titleHi: string;
  priceDisplay: string;
  billingNoteEn: string;
  billingNoteHi: string;
  durationDays: number;
  amountPaise?: number;
}

export interface SubscriptionStatus {
  accountKey: string;
  active: boolean;
  planCode: string;
  status: string;
  provider: string;
  sandboxMode: boolean;
  devTestingEnabled: boolean;
  razorpayConfigured?: boolean;
  expiresAt: string | null;
  plans: SubscriptionPlan[];
}

export interface RazorpayOrderResponse {
  keyId: string;
  orderId: string;
  amountPaise: number;
  currency: string;
  planCode: string;
  planName: string;
  accountKey: string;
}

export interface KundliRequest {
  name?: string;
  birthDate: string;
  birthTime: string;
  latitude?: number;
  longitude?: number;
  timezoneOffset?: number;
}

export interface PlanetPosition {
  planet: string;
  sign: string;
  signHi: string;
  degreeInSign: number;
  degreeFormatted: string;
  house: number;
  nakshatra: string;
  pada: number;
  signLord: string;
  starLord: string;
  subLord: string;
  navamsaSign: string;
  retrograde: boolean;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  years: number;
  current: boolean;
}

export interface LalKitabInsight {
  planet: string;
  house: number;
  status: string;
  remedyEn: string;
  remedyHi: string;
}

export interface KundliResponse {
  name: string;
  birthDate: string;
  birthTime: string;
  ayanamsa: number;
  ayanamsaFormatted: string;
  lagnaSign: string;
  lagnaSignHi: string;
  lagnaDegree: number;
  lagnaNakshatra: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  pada: number;
  manglik: boolean;
  manglikReason: string;
  planets: PlanetPosition[];
  mahadashas: DashaPeriod[];
  lalKitab: LalKitabInsight[];
}

export interface MilanResponse {
  totalScore: number;
  maxScore: number;
  verdict: string;
  boyRashi: string;
  boyNakshatra: string;
  boyManglik: boolean;
  girlRashi: string;
  girlNakshatra: string;
  girlManglik: boolean;
  kootas: { name: string; obtained: number; max: number; detail: string }[];
}

export interface DetailedPanchangResponse {
  date: string;
  weekday: string;
  tithi: string;
  paksha: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunSign: string;
  moonSign: string;
  sunrise: string;
  sunset: string;
  abhijitMuhurat: string;
  rahuKaal: string;
  yamaganda: string;
  gulikaKaal: string;
  dayChoghadiya: { period: string; name: string; quality: string; timeRange: string }[];
  shubhMuhurats: { activity: string; window: string; quality: string; notes: string }[];
}

export interface PujaCatalogItem {
  code: string;
  titleEn: string;
  titleHi: string;
  templeName: string;
  deity: string;
  benefitsEn: string;
  benefitsHi: string;
  amountPaise: number;
  priceDisplay: string;
}

export interface TempleAudioItem {
  id: string;
  titleEn: string;
  titleHi: string;
  templeName: string;
  category: string;
  streamUrl: string;
  durationLabel: string;
}

export interface PujaBooking {
  id: number;
  accountKey: string;
  pujaCode: string;
  pujaTitle: string;
  templeName: string;
  devoteeName: string;
  gotra: string;
  bookingDate: string;
  status: string;
}

export interface AstrologerProfile {
  id: string;
  name: string;
  specialtyEn: string;
  specialtyHi: string;
  languages: string;
  experienceYears: number;
  rating: number;
  feePerSessionPaise: number;
  feeDisplay: string;
  online: boolean;
  modes: string[];
}

export interface ConsultationSessionView {
  id: number;
  accountKey: string;
  astrologerId: string;
  astrologerName: string;
  mode: string;
  topic: string;
  roomCode: string;
  joinUrl: string;
  status: string;
  amountPaise: number;
  createdAt: string;
}

export interface ConsultationMessage {
  id: number;
  sessionId: number;
  senderRole: 'USER' | 'ASTROLOGER';
  senderName: string;
  message: string;
  createdAt: string;
}
