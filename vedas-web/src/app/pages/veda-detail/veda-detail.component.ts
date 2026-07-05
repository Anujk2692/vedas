import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Chapter, Veda } from '../../core/models';

@Component({
  selector: 'app-veda-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      @if (veda) {
        <a routerLink="/scriptures" class="back">← All scriptures</a>
        <h1>{{ veda.title }}</h1>
        <p class="sanskrit-lg">{{ veda.sanskritName }}</p>
        <p>{{ veda.description }}</p>

        @if (veda.hasPdf && veda.pdfUrl) {
          <div class="pdf-section card">
            <h3>📄 पूर्ण ग्रंथ PDF</h3>
            <p class="muted">{{ veda.pdfSourceName ?? 'Gita Press / Archive.org' }}</p>
            <a [href]="veda.pdfUrl" target="_blank" rel="noopener" class="btn btn-primary">Open Main PDF</a>
            @if (veda.pdfEditions?.length) {
              <div class="pdf-list">
                @for (ed of veda.pdfEditions; track ed.url) {
                  <a [href]="ed.url" target="_blank" rel="noopener" class="pdf-item">📖 {{ ed.title }}</a>
                }
              </div>
            }
          </div>
        }

        @if (veda.overview) {
          <article class="card"><h3>Overview</h3><p>{{ veda.overview }}</p></article>
        }
        @if (veda.philosophy) {
          <article class="card"><h3>Philosophy</h3><p>{{ veda.philosophy }}</p></article>
        }
        @if (veda.learningGuide) {
          <article class="card"><h3>Learning Guide</h3><p>{{ veda.learningGuide }}</p></article>
        }

        <h2>Chapters</h2>
        <div class="list">
          @for (c of chapters; track c.id) {
            <a [routerLink]="['/chapter', c.id]" class="card list-item">
              <strong>{{ c.number }}. {{ c.title }}</strong>
              <p>{{ c.summary }}</p>
              <small>{{ c.verseCount }} verses</small>
            </a>
          }
        </div>
      } @else if (!loading) {
        <p>Scripture not found.</p>
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: `
    .pdf-section { margin: 1.5rem 0; }
    .pdf-section h3 { margin-top: 0; color: #7a3200; }
    .muted { color: #9a7b6a; font-size: 0.9rem; }
    .pdf-list { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .pdf-item {
      display: block; padding: 0.65rem 0.85rem; background: #fff3e6;
      border-radius: 10px; text-decoration: none; color: #7a3200; font-weight: 600; font-size: 0.9rem;
    }
    .card h3 { color: #7a3200; margin-top: 0; }
  `,
})
export class VedaDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  veda: Veda | null = null;
  chapters: Chapter[] = [];
  loading = true;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const lang = this.langService.lang();
    this.api.getVeda(slug, lang).subscribe({
      next: v => {
        this.veda = v;
        this.api.getChapters(v.id, lang).subscribe(c => (this.chapters = c));
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
