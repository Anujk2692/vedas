import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AartiDetail,
  AartiSummary,
  AskResponse,
  AstrologerProfile,
  Chapter,
  ChildNameRequest,
  ChildNameResponse,
  ConsultationMessage,
  ConsultationSessionView,
  DailyShlok,
  DetailedPanchangResponse,
  DevotionalItem,
  KundliRequest,
  KundliResponse,
  Language,
  MilanResponse,
  Panchang,
  PujaBooking,
  PujaCatalogItem,
  RazorpayOrderResponse,
  SanatanHub,
  SearchResult,
  StudyPath,
  SubscriptionStatus,
  TempleAudioItem,
  Topic,
  Veda,
  Verse,
  Quiz,
  QuizSummary,
  Deity,
  Temple,
  FestivalGuide,
} from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBaseUrl;

  private withLang(lang: string, path: string): string {
    const sep = path.includes('?') ? '&' : '?';
    return `${this.base}${path}${sep}lang=${lang}`;
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.base}/languages`);
  }

  getVedas(lang: string): Observable<Veda[]> {
    return this.http.get<Veda[]>(this.withLang(lang, '/vedas'));
  }

  getVeda(slug: string, lang: string): Observable<Veda> {
    return this.http.get<Veda>(this.withLang(lang, `/vedas/${slug}`));
  }

  getChapters(vedaId: string, lang: string): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(this.withLang(lang, `/vedas/${vedaId}/chapters`));
  }

  getVerses(chapterId: string, lang: string): Observable<Verse[]> {
    return this.http.get<Verse[]>(this.withLang(lang, `/chapters/${chapterId}/verses`));
  }

  search(query: string, lang: string): Observable<SearchResult> {
    const params = new HttpParams().set('q', query).set('lang', lang);
    return this.http.get<SearchResult>(`${this.base}/search`, { params });
  }

  getAartis(lang: string): Observable<AartiSummary[]> {
    return this.http.get<AartiSummary[]>(this.withLang(lang, '/aartis'));
  }

  getAarti(slug: string, lang: string): Observable<AartiDetail> {
    return this.http.get<AartiDetail>(this.withLang(lang, `/aartis/${slug}`));
  }

  getSanatanHub(lang: string): Observable<SanatanHub> {
    return this.http.get<SanatanHub>(this.withLang(lang, '/sanatan/hub'));
  }

  getStudyPath(slug: string, lang: string): Observable<StudyPath> {
    return this.http.get<StudyPath>(this.withLang(lang, `/sanatan/study-paths/${slug}`));
  }

  getTopic(slug: string, lang: string): Observable<Topic> {
    return this.http.get<Topic>(this.withLang(lang, `/sanatan/topics/${slug}`));
  }

  getDailyShlok(lang: string): Observable<DailyShlok> {
    return this.http.get<DailyShlok>(this.withLang(lang, '/sanatan/daily-shlok'));
  }

  getGitaOfDay(lang: string): Observable<DailyShlok> {
    return this.http.get<DailyShlok>(this.withLang(lang, '/sanatan/gita-of-day'));
  }

  getPanchang(lang: string): Observable<Panchang> {
    return this.http.get<Panchang>(this.withLang(lang, '/sanatan/panchang'));
  }

  getQuizzes(lang: string): Observable<QuizSummary[]> {
    return this.http.get<QuizSummary[]>(this.withLang(lang, '/sanatan/quizzes'));
  }

  getQuiz(id: string, lang: string): Observable<Quiz> {
    return this.http.get<Quiz>(this.withLang(lang, `/sanatan/quizzes/${id}`));
  }

  getDeities(lang: string): Observable<Deity[]> {
    return this.http.get<Deity[]>(this.withLang(lang, '/sanatan/deities'));
  }

  getDeity(slug: string, lang: string): Observable<Deity> {
    return this.http.get<Deity>(this.withLang(lang, `/sanatan/deities/${slug}`));
  }

  getTemples(lang: string): Observable<Temple[]> {
    return this.http.get<Temple[]>(this.withLang(lang, '/sanatan/temples'));
  }

  getTemple(slug: string, lang: string): Observable<Temple> {
    return this.http.get<Temple>(this.withLang(lang, `/sanatan/temples/${slug}`));
  }

  getFestivals(lang: string): Observable<FestivalGuide[]> {
    return this.http.get<FestivalGuide[]>(this.withLang(lang, '/sanatan/festivals'));
  }

  getFestival(slug: string, lang: string): Observable<FestivalGuide> {
    return this.http.get<FestivalGuide>(this.withLang(lang, `/sanatan/festivals/${slug}`));
  }

  askGuru(
    question: string,
    lang: string,
    astro?: {
      personName?: string;
      birthDate?: string;
      birthTime?: string;
      birthPlace?: string;
      gender?: string;
      category?: string;
    },
  ): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.base}/sanatan/ask`, { question, lang, ...astro });
  }

  suggestChildNames(payload: ChildNameRequest): Observable<ChildNameResponse> {
    return this.http.post<ChildNameResponse>(`${this.base}/child-names/suggest`, payload);
  }

  getChalisas(lang: string): Observable<DevotionalItem[]> {
    return this.http.get<DevotionalItem[]>(this.withLang(lang, '/chalisas'));
  }

  getChalisa(slug: string, lang: string): Observable<DevotionalItem> {
    return this.http.get<DevotionalItem>(this.withLang(lang, `/chalisas/${slug}`));
  }

  getBhajans(lang: string): Observable<DevotionalItem[]> {
    return this.http.get<DevotionalItem[]>(this.withLang(lang, '/bhajans'));
  }

  getBhajan(slug: string, lang: string): Observable<DevotionalItem> {
    return this.http.get<DevotionalItem>(this.withLang(lang, `/bhajans/${slug}`));
  }

  getSubscriptionStatus(accountKey: string): Observable<SubscriptionStatus> {
    return this.http.get<SubscriptionStatus>(`${this.base}/subscription/status`, { params: { accountKey } });
  }

  activateSubscription(payload: {
    accountKey: string;
    planCode: string;
    provider?: string;
    transactionId?: string;
    sandbox?: boolean;
  }): Observable<SubscriptionStatus> {
    return this.http.post<SubscriptionStatus>(`${this.base}/subscription/activate`, payload);
  }

  cancelSubscription(accountKey: string): Observable<SubscriptionStatus> {
    return this.http.post<SubscriptionStatus>(`${this.base}/subscription/cancel`, { accountKey });
  }

  createRazorpayOrder(accountKey: string, planCode: string): Observable<RazorpayOrderResponse> {
    return this.http.post<RazorpayOrderResponse>(`${this.base}/subscription/razorpay/create-order`, {
      accountKey,
      planCode,
    });
  }

  verifyRazorpayPayment(payload: {
    accountKey: string;
    planCode: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }): Observable<SubscriptionStatus> {
    return this.http.post<SubscriptionStatus>(`${this.base}/subscription/razorpay/verify`, payload);
  }

  computeKundli(payload: KundliRequest): Observable<KundliResponse> {
    return this.http.post<KundliResponse>(`${this.base}/jyotish/kundli`, payload);
  }

  computeMilan(boy: KundliRequest, girl: KundliRequest): Observable<MilanResponse> {
    return this.http.post<MilanResponse>(`${this.base}/jyotish/milan`, { boy, girl });
  }

  getDetailedPanchang(date?: string): Observable<DetailedPanchangResponse> {
    const params = date ? new HttpParams().set('date', date) : new HttpParams();
    return this.http.get<DetailedPanchangResponse>(`${this.base}/jyotish/panchang`, { params });
  }

  getSevaCatalog(): Observable<{ pujas: PujaCatalogItem[]; templeAudios: TempleAudioItem[] }> {
    return this.http.get<{ pujas: PujaCatalogItem[]; templeAudios: TempleAudioItem[] }>(`${this.base}/seva/catalog`);
  }

  bookPuja(payload: {
    accountKey: string;
    pujaCode: string;
    devoteeName: string;
    gotra?: string;
    bookingDate?: string;
    sankalpNotes?: string;
  }): Observable<PujaBooking> {
    return this.http.post<PujaBooking>(`${this.base}/seva/pujas/book`, payload);
  }

  myPujas(accountKey: string): Observable<PujaBooking[]> {
    return this.http.get<PujaBooking[]>(`${this.base}/seva/pujas/my`, { params: { accountKey } });
  }

  getAstrologers(): Observable<AstrologerProfile[]> {
    return this.http.get<AstrologerProfile[]>(`${this.base}/seva/astrologers`);
  }

  bookConsultation(payload: {
    accountKey: string;
    astrologerId: string;
    mode: string;
    topic?: string;
  }): Observable<ConsultationSessionView> {
    return this.http.post<ConsultationSessionView>(`${this.base}/seva/consultations/book`, payload);
  }

  myConsultations(accountKey: string): Observable<ConsultationSessionView[]> {
    return this.http.get<ConsultationSessionView[]>(`${this.base}/seva/consultations/my`, { params: { accountKey } });
  }

  getConsultationMessages(sessionId: number): Observable<ConsultationMessage[]> {
    return this.http.get<ConsultationMessage[]>(`${this.base}/seva/consultations/${sessionId}/messages`);
  }

  sendConsultationMessage(sessionId: number, senderName: string, message: string): Observable<ConsultationMessage[]> {
    return this.http.post<ConsultationMessage[]>(`${this.base}/seva/consultations/${sessionId}/messages`, {
      senderName,
      message,
    });
  }

  requestOtp(accountKey: string, displayName?: string): Observable<{ accountKey: string; message: string; devOtpPreview?: string }> {
    return this.http.post<{ accountKey: string; message: string; devOtpPreview?: string }>(`${this.base}/auth/request-otp`, {
      accountKey,
      displayName,
    });
  }

  verifyOtp(accountKey: string, otp: string): Observable<{ accountKey: string; displayName: string; sessionToken: string; verified: boolean }> {
    return this.http.post<{ accountKey: string; displayName: string; sessionToken: string; verified: boolean }>(`${this.base}/auth/verify-otp`, {
      accountKey,
      otp,
    });
  }

  health(): Observable<string> {
    return this.http.get(`${this.base}/health`, { responseType: 'text' });
  }
}
