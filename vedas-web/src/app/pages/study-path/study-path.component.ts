import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { StudyPath } from '../../core/models';

@Component({
  selector: 'app-study-path',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      @if (path) {
        <a routerLink="/gyan" class="back">← Gyan Hub</a>
        <h1>{{ path.icon }} {{ path.title }}</h1>
        <p>{{ path.durationLabel }} · {{ path.level }}</p>
        <p>{{ path.description }}</p>
        @for (step of path.steps; track step.order) {
          <article class="card">
            <h3>{{ step.order }}. {{ step.title }}</h3>
            <p>{{ step.description }}</p>
            @if (step.scriptureSlug) {
              <a [routerLink]="['/scriptures', step.scriptureSlug]">Read scripture →</a>
            }
          </article>
        }
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: ['.narrow { max-width: 720px; }'],
})
export class StudyPathComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  path: StudyPath | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getStudyPath(slug, this.langService.lang()).subscribe(p => (this.path = p));
  }
}
