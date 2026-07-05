import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Verse } from '../../core/models';

@Component({
  selector: 'app-chapter',
  standalone: true,
  template: `
    <div class="container narrow">
      @if (loading) { <p>Loading verses…</p> }
      @for (v of verses; track v.id) {
        <article class="card verse-card">
          <span class="verse-num">{{ v.number }}</span>
          <p class="sanskrit">{{ v.sanskrit }}</p>
          <p class="translit">{{ v.transliteration }}</p>
          <p>{{ v.translation }}</p>
          @if (v.commentary) {
            <p class="commentary">{{ v.commentary }}</p>
          }
        </article>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 760px; }
    .verse-num { font-weight: 800; color: #c45c00; }
    .sanskrit { font-size: 1.2rem; line-height: 1.75; color: #7a3200; margin: 0.5rem 0; }
    .translit { font-style: italic; color: #9a7b6a; }
    .commentary { color: #5c4033; border-left: 3px solid #e8922a; padding-left: 1rem; margin-top: 0.75rem; }
  `,
})
export class ChapterComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  verses: Verse[] = [];
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getVerses(id, this.langService.lang()).subscribe({
      next: v => {
        this.verses = v;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
