import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SanatanHub } from '../../core/models';

@Component({
  selector: 'app-gyan',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <h1>सनातन ज्ञान · Gyan Hub</h1>
      @if (hub) {
        <section>
          <h2>Study Paths</h2>
          <div class="grid">
            @for (p of hub.studyPaths; track p.slug) {
              <a [routerLink]="['/gyan/path', p.slug]" class="card">
                <span class="icon">{{ p.icon }}</span>
                <h3>{{ p.title }}</h3>
                <p>{{ p.durationLabel }} · {{ p.level }}</p>
                <p>{{ p.description }}</p>
              </a>
            }
          </div>
        </section>
        <section>
          <h2>Topics</h2>
          <div class="grid topics">
            @for (t of hub.topics; track t.slug) {
              <a [routerLink]="['/gyan/topic', t.slug]" class="card topic-card">
                <span>{{ t.icon }}</span>
                <strong>{{ t.title }}</strong>
              </a>
            }
          </div>
        </section>
        <section>
          <h2>Resources</h2>
          @for (r of hub.resources; track r.slug) {
            <a [href]="r.url" target="_blank" rel="noopener" class="card list-item">
              <strong>{{ r.title }}</strong>
              <p>{{ r.sourceName }} · {{ r.description }}</p>
            </a>
          }
        </section>
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: `
    .icon { font-size: 2rem; }
    .topics { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .topic-card { text-align: center; span { font-size: 1.8rem; display: block; } }
  `,
})
export class GyanComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  hub: SanatanHub | null = null;

  ngOnInit(): void {
    this.api.getSanatanHub(this.langService.lang()).subscribe(h => (this.hub = h));
  }
}
