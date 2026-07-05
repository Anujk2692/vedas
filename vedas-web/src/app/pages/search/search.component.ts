import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SearchResult } from '../../core/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container">
      <h1>Search</h1>
      <div class="search-bar">
        <input [(ngModel)]="query" (keyup.enter)="search()" placeholder="Search karma, dharma, Gita…" />
        <button type="button" class="btn btn-primary" (click)="search()">Search</button>
      </div>
      @if (loading) { <p>Searching…</p> }
      @if (results) {
        @if (results.verses.length) {
          <h2>Verses</h2>
          @for (v of results.verses; track v.id) {
            <a [routerLink]="['/chapter', v.chapterId]" class="card list-item">
              <p class="sanskrit-sm">{{ v.sanskrit }}</p>
              <p>{{ v.translation }}</p>
            </a>
          }
        }
        @if (results.chapters.length) {
          <h2>Chapters</h2>
          @for (c of results.chapters; track c.id) {
            <a [routerLink]="['/chapter', c.id]" class="card list-item">{{ c.title }}</a>
          }
        }
        @if (results.vedas.length) {
          <h2>Scriptures</h2>
          @for (v of results.vedas; track v.id) {
            <a [routerLink]="['/scriptures', v.slug]" class="card list-item">{{ v.title }}</a>
          }
        }
      }
    </div>
  `,
  styles: `
    .search-bar { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; }
    input { flex: 1; padding: 0.75rem 1rem; border: 1px solid rgba(196,92,0,0.2); border-radius: 12px; font-size: 1rem; }
  `,
})
export class SearchComponent {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  query = '';
  results: SearchResult | null = null;
  loading = false;

  search(): void {
    const q = this.query.trim();
    if (q.length < 2) return;
    this.loading = true;
    this.api.search(q, this.langService.lang()).subscribe({
      next: r => {
        this.results = r;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
