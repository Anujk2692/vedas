import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Deity, FestivalGuide, Temple } from '../../core/models';

@Component({
  selector: 'app-culture',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <a routerLink="/" class="back">← Home</a>
      <h1>Deities · Temples · Festivals</h1>
      <div class="tabs">
        <a routerLink="/culture" [class.on]="!kind">All hubs</a>
        <a routerLink="/culture/deities" [class.on]="kind === 'deities'">Deities</a>
        <a routerLink="/culture/temples" [class.on]="kind === 'temples'">Temples</a>
        <a routerLink="/culture/festivals" [class.on]="kind === 'festivals'">Festivals</a>
      </div>

      @if (slug && deity) {
        <article class="card">
          <h2>{{ deity.name }} <small>{{ deity.sanskritName }}</small></h2>
          <p><strong>Story:</strong> {{ deity.story }}</p>
          <p><strong>Symbolism:</strong> {{ deity.symbolism }}</p>
          <p><strong>Family:</strong> {{ deity.family }}</p>
          <p><strong>Weapons:</strong> {{ deity.weapons }}</p>
          <p><strong>Vehicle:</strong> {{ deity.vehicles }}</p>
          <p><strong>Mantras:</strong> {{ deity.mantras.join(' · ') }}</p>
        </article>
      } @else if (slug && temple) {
        <article class="card">
          <h2>{{ temple.name }}</h2>
          <p>{{ temple.location }}</p>
          <p><strong>History:</strong> {{ temple.history }}</p>
          <p><strong>Importance:</strong> {{ temple.importance }}</p>
          <p><strong>Architecture:</strong> {{ temple.architecture }}</p>
          <p><strong>Timings:</strong> {{ temple.timings }}</p>
          <p><strong>Nearby:</strong> {{ temple.nearby }}</p>
          @if (temple.virtualTourUrl) {
            <a [href]="temple.virtualTourUrl" target="_blank" rel="noopener" class="btn btn-primary">Map / tour</a>
          }
        </article>
      } @else if (slug && festival) {
        <article class="card">
          <h2>{{ festival.name }}</h2>
          <p>{{ festival.whenLabel }}</p>
          <p><strong>Why:</strong> {{ festival.why }}</p>
          <p><strong>Story:</strong> {{ festival.story }}</p>
          <p><strong>Rituals:</strong> {{ festival.rituals }}</p>
          <p><strong>Puja:</strong> {{ festival.pujaMethod }}</p>
          <p><strong>Mantras:</strong> {{ festival.mantras }}</p>
          <p><strong>Bhog:</strong> {{ festival.bhog }}</p>
          <p><strong>Regional:</strong> {{ festival.regionalTraditions }}</p>
        </article>
      } @else {
        @if (!kind || kind === 'deities') {
          <h2>Gods &amp; Goddesses</h2>
          <div class="grid">
            @for (d of deities; track d.slug) {
              <a [routerLink]="['/culture/deities', d.slug]" class="card">
                <h3>{{ d.name }}</h3>
                <p>{{ d.story }}</p>
              </a>
            }
          </div>
        }
        @if (!kind || kind === 'temples') {
          <h2>Temples</h2>
          <div class="grid">
            @for (t of temples; track t.slug) {
              <a [routerLink]="['/culture/temples', t.slug]" class="card">
                <h3>{{ t.name }}</h3>
                <p>{{ t.location }}</p>
              </a>
            }
          </div>
        }
        @if (!kind || kind === 'festivals') {
          <h2>Festivals</h2>
          <div class="grid">
            @for (f of festivals; track f.slug) {
              <a [routerLink]="['/culture/festivals', f.slug]" class="card">
                <h3>{{ f.name }}</h3>
                <p>{{ f.why }}</p>
              </a>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .tabs { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1rem 0 1.5rem; }
      .tabs a { text-decoration: none; padding: 0.4rem 0.8rem; border-radius: 999px; border: 1px solid #e6d5c3; color: #7a3200; }
      .tabs a.on { background: #c45c00; color: #fff; border-color: #c45c00; }
      .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
      .card { text-decoration: none; color: inherit; }
    `,
  ],
})
export class CultureComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly lang = inject(LanguageService);
  private readonly route = inject(ActivatedRoute);

  kind: string | null = null;
  slug: string | null = null;
  deities: Deity[] = [];
  temples: Temple[] = [];
  festivals: FestivalGuide[] = [];
  deity: Deity | null = null;
  temple: Temple | null = null;
  festival: FestivalGuide | null = null;

  ngOnInit(): void {
    const l = this.lang.lang();
    this.kind = this.route.snapshot.paramMap.get('kind');
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.api.getDeities(l).subscribe(d => (this.deities = d));
    this.api.getTemples(l).subscribe(t => (this.temples = t));
    this.api.getFestivals(l).subscribe(f => (this.festivals = f));
    if (this.slug && this.kind === 'deities') {
      this.api.getDeity(this.slug, l).subscribe(d => (this.deity = d));
    }
    if (this.slug && this.kind === 'temples') {
      this.api.getTemple(this.slug, l).subscribe(t => (this.temple = t));
    }
    if (this.slug && this.kind === 'festivals') {
      this.api.getFestival(this.slug, l).subscribe(f => (this.festival = f));
    }
  }
}
