import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AartiSummary } from '../../core/models';

@Component({
  selector: 'app-aartis',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="container aarti-page">
      <div class="head-row">
        <div>
          <h1>{{ isHi ? '🪔 आरती संग्रह' : '🪔 Aarti Collection' }}</h1>
          <p class="sub">
            {{ isHi ? '21 देवी-देवताओं की संपूर्ण आरती — पाठ, अर्थ और ऑडियो सहित' : 'Complete lyrics, meanings & audio for 21 Devi & Devta Aartis' }}
          </p>
        </div>
        <input
          type="search"
          class="search-input"
          [(ngModel)]="query"
          [placeholder]="isHi ? 'आरती खोजें…' : 'Search Aarti…'" />
      </div>

      <div class="filter-row">
        <button type="button" class="filter-chip" [class.active]="filter === 'ALL'" (click)="filter = 'ALL'">
          {{ isHi ? 'सभी' : 'All' }} ({{ aartis.length }})
        </button>
        <button type="button" class="filter-chip" [class.active]="filter === 'DEVTA'" (click)="filter = 'DEVTA'">
          {{ isHi ? 'देवता' : 'Devta' }}
        </button>
        <button type="button" class="filter-chip" [class.active]="filter === 'DEVI'" (click)="filter = 'DEVI'">
          {{ isHi ? 'देवी' : 'Devi' }}
        </button>
      </div>

      @if (loading) {
        <p class="loading">{{ isHi ? 'लोड हो रहा है…' : 'Loading…' }}</p>
      }

      <div class="grid">
        @for (a of filteredAartis; track a.id) {
          <a [routerLink]="['/aartis', a.slug]" class="card scripture-card">
            <span class="pill">{{ a.deityType }}</span>
            <h3>{{ a.title }}</h3>
            <p class="sanskrit-sm">{{ a.sanskritName }}</p>
            <p>{{ a.description }}</p>
            <span class="meta">{{ isHi ? 'पूरी आरती पढ़ें →' : 'Read full Aarti →' }}</span>
          </a>
        }
      </div>
    </div>
  `,
  styles: `
    .aarti-page { padding-bottom: 2rem; }
    .head-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-end;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .head-row h1 { margin: 0 0 0.25rem; }
    .sub { margin: 0; color: #5c4033; font-size: 0.92rem; }
    .search-input {
      padding: 0.55rem 0.9rem;
      border-radius: 999px;
      border: 1px solid rgba(196, 92, 0, 0.28);
      background: #fff;
      min-width: 220px;
      font-size: 0.9rem;
    }
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .filter-chip {
      border: 1px solid rgba(196, 92, 0, 0.25);
      background: #fff;
      color: #7a3200;
      border-radius: 999px;
      padding: 0.4rem 0.95rem;
      font-weight: 700;
      cursor: pointer;
    }
    .filter-chip.active {
      background: #7a3200;
      color: #fff;
      border-color: #7a3200;
    }
    @media (max-width: 600px) {
      .search-input { width: 100%; min-width: 0; }
    }
  `,
})
export class AartisComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  aartis: AartiSummary[] = [];
  filter: 'ALL' | 'DEVTA' | 'DEVI' = 'ALL';
  query = '';
  loading = true;

  get isHi(): boolean {
    return this.langService.isHi();
  }

  get filteredAartis(): AartiSummary[] {
    const q = this.query.trim().toLowerCase();
    return this.aartis.filter(a => {
      const typeOk = this.filter === 'ALL' || a.deityType === this.filter;
      const queryOk =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.sanskritName.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q);
      return typeOk && queryOk;
    });
  }

  ngOnInit(): void {
    this.api.getAartis(this.langService.lang()).subscribe({
      next: a => {
        this.aartis = a;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
