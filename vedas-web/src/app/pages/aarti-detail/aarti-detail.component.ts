import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AartiDetail } from '../../core/models';

@Component({
  selector: 'app-aarti-detail',
  standalone: true,
  template: `
    <div class="container narrow">
      @if (aarti) {
        <h1>{{ aarti.title }}</h1>
        <p>{{ aarti.description }}</p>
        @if (aarti.pdfUrl) {
          <p><a [href]="aarti.pdfUrl" target="_blank" rel="noopener" class="btn btn-primary">Open PDF</a></p>
        }
        @for (line of aarti.lines; track $index) {
          <article class="card verse-card">
            <p class="sanskrit">{{ line.sanskrit }}</p>
            <p class="translit">{{ line.transliteration }}</p>
            <p>{{ line.translation }}</p>
          </article>
        }
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 720px; }
    .sanskrit { font-size: 1.15rem; color: #7a3200; line-height: 1.7; }
    .translit { font-style: italic; color: #9a7b6a; }
  `,
})
export class AartiDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  aarti: AartiDetail | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getAarti(slug, this.langService.lang()).subscribe(a => (this.aarti = a));
  }
}
