import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AskResponse } from '../../core/models';

@Component({
  selector: 'app-ai-guru',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container narrow">
      <h1>🙏 AI Guru</h1>
      <p>Scripture-aware answers with related shloks and topics.</p>
      <div class="search-bar">
        <input [(ngModel)]="question" (keyup.enter)="ask()" placeholder="Ask about karma, dharma, moksha…" />
        <button type="button" class="btn btn-primary" (click)="ask()" [disabled]="loading">Ask</button>
      </div>
      <div class="chips">
        @for (s of suggestions; track s) {
          <button type="button" class="chip" (click)="question = s; ask()">{{ s }}</button>
        }
      </div>
      @if (response) {
        <article class="card answer">
          <h3>Answer</h3>
          <p style="white-space: pre-line">{{ response.answer }}</p>
        </article>
        @if (response.relatedVerses.length) {
          <h3>Related verses</h3>
          @for (v of response.relatedVerses; track v.id) {
            <a [routerLink]="['/chapter', v.chapterId]" class="card list-item">
              <p class="sanskrit-sm">{{ v.sanskrit }}</p>
              <p>{{ v.translation }}</p>
            </a>
          }
        }
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 720px; }
    .search-bar { display: flex; gap: 0.75rem; margin: 1rem 0; }
    input { flex: 1; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid rgba(196,92,0,0.2); }
    .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
    .chip { border: 1px solid rgba(196,92,0,0.2); background: #fff3e6; border-radius: 999px; padding: 0.4rem 0.85rem; cursor: pointer; font-size: 0.85rem; }
    .answer { border-left: 4px solid #c45c00; }
  `,
})
export class AiGuruComponent {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  question = '';
  response: AskResponse | null = null;
  loading = false;
  suggestions = ['कर्म योग क्या है?', 'What is dharma?', 'मोक्ष का मार्ग', 'Bhagavad Gita summary'];

  ask(): void {
    const q = this.question.trim();
    if (q.length < 2) return;
    this.loading = true;
    this.api.askGuru(q, this.langService.lang()).subscribe({
      next: r => {
        this.response = r;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
