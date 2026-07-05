import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AartiDetail,
  AartiSummary,
  AskResponse,
  Chapter,
  DailyShlok,
  Language,
  Panchang,
  SanatanHub,
  SearchResult,
  StudyPath,
  Topic,
  Veda,
  Verse,
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

  getPanchang(lang: string): Observable<Panchang> {
    return this.http.get<Panchang>(this.withLang(lang, '/sanatan/panchang'));
  }

  askGuru(question: string, lang: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.base}/sanatan/ask`, { question, lang });
  }

  health(): Observable<string> {
    return this.http.get(`${this.base}/health`, { responseType: 'text' });
  }
}
