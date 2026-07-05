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
        @if (veda.overview) {
          <article class="card"><p>{{ veda.overview }}</p></article>
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
