import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { ChildNameResponse, ChildNameSuggestion } from '../../core/models';

const SHORTLIST_KEY = 'vedas_child_name_shortlist_v1';

@Component({
  selector: 'app-child-names',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container child-page">
      <section class="hero-card card">
        <span class="pill">✨ नामकरण · CHILD NAME STUDIO</span>
        <h1>Sacred Child Name Suggestions</h1>
        <p class="lead">
          Combine Father &amp; Mother names with optional God/Goddess synonyms, Rashi Akshar (starting letter), Nakshatra, Numerology, and meaning in your chosen language.
        </p>

        <form class="form-grid" (ngSubmit)="generate()">
          <label class="field">
            <span>Father's Name *</span>
            <input type="text" [(ngModel)]="fatherName" name="fatherName" placeholder="e.g. Anuj" required />
          </label>

          <label class="field">
            <span>Mother's Name *</span>
            <input type="text" [(ngModel)]="motherName" name="motherName" placeholder="e.g. Priya" required />
          </label>

          <label class="field">
            <span>God / Goddess (Optional)</span>
            <select [(ngModel)]="deity" name="deity">
              @for (d of deities; track d) {
                <option [value]="d">{{ d }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Starting Letter / Rashi Akshar</span>
            <input
              type="text"
              [(ngModel)]="startingLetter"
              name="startingLetter"
              maxlength="1"
              placeholder="Optional (e.g. A, R, S)" />
          </label>

          <label class="field">
            <span>Gender</span>
            <select [(ngModel)]="gender" name="gender">
              <option value="ANY">Any</option>
              <option value="BOY">Boy</option>
              <option value="GIRL">Girl</option>
            </select>
          </label>

          <label class="field">
            <span>Religion</span>
            <select [(ngModel)]="religion" name="religion">
              @for (r of religions; track r) {
                <option [value]="r">{{ r }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Country</span>
            <select [(ngModel)]="country" name="country">
              @for (c of countries; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span>Meaning Language</span>
            <select [(ngModel)]="language" name="language">
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="sa">Sanskrit (संस्कृतम्)</option>
            </select>
          </label>

          <div class="submit-wrap">
            <button type="submit" class="btn btn-primary" [disabled]="loading">
              {{ loading ? 'Generating…' : 'Suggest Names ✨' }}
            </button>
          </div>
        </form>

        @if (error) {
          <p class="error-msg">{{ error }}</p>
        }
      </section>

      @if (shortlist.length) {
        <section class="card shortlist-banner">
          <div class="shortlist-top">
            <strong>❤️ Shortlisted Names ({{ shortlist.length }})</strong>
            <button type="button" class="filter-chip" (click)="showShortlistOnly = !showShortlistOnly">
              {{ showShortlistOnly ? 'Show All Results' : 'Filter Shortlisted' }}
            </button>
          </div>
          <div class="syn-row">
            @for (saved of shortlist; track saved) {
              <span class="syn-chip">{{ saved }}</span>
            }
          </div>
        </section>
      }

      @if (result) {
        <section class="results-section">
          <div class="results-head">
            <div>
              <h2>{{ filteredSuggestions.length }} Suggestions for {{ result.fatherName }} &amp; {{ result.motherName }}</h2>
              <span class="meta">
                {{ result.deity }} · {{ result.religion }} · {{ result.country }} · {{ result.language.toUpperCase() }}
              </span>
            </div>
            <div class="result-controls">
              <input
                type="search"
                class="search-box"
                [(ngModel)]="searchQuery"
                placeholder="Search name, meaning, Rashi…" />
              <div class="result-filters">
                <button type="button" class="filter-chip" [class.active]="resultGenderFilter === 'ALL'" (click)="resultGenderFilter = 'ALL'">All</button>
                <button type="button" class="filter-chip" [class.active]="resultGenderFilter === 'BOY'" (click)="resultGenderFilter = 'BOY'">Boy</button>
                <button type="button" class="filter-chip" [class.active]="resultGenderFilter === 'GIRL'" (click)="resultGenderFilter = 'GIRL'">Girl</button>
              </div>
            </div>
          </div>

          <div class="name-grid">
            @for (item of filteredSuggestions; track item.name) {
              <article class="card name-card">
                <div class="name-top">
                  <div>
                    <h3>{{ item.name }}</h3>
                    <span class="script-sub">{{ item.scriptText }} · /{{ item.pronunciation }}/</span>
                  </div>
                  <div class="top-actions">
                    <button
                      type="button"
                      class="fav-btn"
                      [class.saved]="isShortlisted(item.name)"
                      (click)="toggleShortlist(item.name)"
                      [attr.aria-label]="'Shortlist ' + item.name">
                      {{ isShortlisted(item.name) ? '❤️' : '🤍' }}
                    </button>
                    <span class="pill">{{ item.gender }}</span>
                  </div>
                </div>

                <p class="meaning">{{ item.meaning }}</p>
                <p class="significance">{{ item.spiritualSignificance }}</p>

                <div class="astro-grid">
                  <div class="astro-item">
                    <small>Rashi</small>
                    <strong>{{ item.rashi }}</strong>
                  </div>
                  <div class="astro-item">
                    <small>Nakshatra</small>
                    <strong>{{ item.nakshatra }}</strong>
                  </div>
                  <div class="astro-item">
                    <small>Numerology #{{ item.numerologyNumber }}</small>
                    <strong>{{ item.numerologyTrait }}</strong>
                  </div>
                  <div class="astro-item">
                    <small>Lucky Day &amp; Color</small>
                    <strong>{{ item.luckyDay }} · {{ item.luckyColor }}</strong>
                  </div>
                </div>

                <p class="blend"><strong>Blend:</strong> {{ item.combinationSource }}</p>
                <p class="deity"><strong>Deity / Origin:</strong> {{ item.deityConnection }} · {{ item.origin }}</p>

                <div class="card-footer">
                  @if (item.synonyms.length) {
                    <div class="syn-row">
                      @for (syn of item.synonyms; track syn) {
                        <span class="syn-chip">{{ syn }}</span>
                      }
                    </div>
                  }
                  <button type="button" class="copy-btn" (click)="copyName(item)">
                    {{ copiedName === item.name ? 'Copied ✓' : 'Copy' }}
                  </button>
                </div>
              </article>
            }
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .child-page {
      padding: 2rem 0 3rem;
    }
    .hero-card {
      background: linear-gradient(135deg, #fff8f0 0%, #fff1df 100%);
      border: 1.5px solid rgba(196, 92, 0, 0.22);
      margin-bottom: 1.5rem;
    }
    .hero-card h1 {
      margin: 0.6rem 0 0.4rem;
    }
    .lead {
      color: #5c4033;
      margin-bottom: 1.25rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
      gap: 1rem;
      align-items: end;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 700;
      font-size: 0.85rem;
      color: #7a3200;
    }
    .field input,
    .field select,
    .search-box {
      padding: 0.65rem 0.8rem;
      border-radius: 10px;
      border: 1px solid rgba(122, 50, 0, 0.25);
      background: #fff;
      font-size: 0.95rem;
      color: #2c1810;
    }
    .submit-wrap {
      display: flex;
      align-items: center;
    }
    .btn-primary {
      background: #c45c00;
      color: #fff;
      width: 100%;
    }
    .error-msg {
      color: #b71c1c;
      font-weight: 700;
      margin-top: 1rem;
    }
    .shortlist-banner {
      margin-bottom: 1.5rem;
      background: #fffaf4;
      border: 1px solid rgba(196, 92, 0, 0.22);
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .shortlist-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .results-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .results-head h2 {
      margin: 0 0 0.2rem;
    }
    .result-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: center;
    }
    .search-box {
      min-width: 220px;
      padding: 0.45rem 0.75rem;
      font-size: 0.88rem;
    }
    .result-filters {
      display: flex;
      gap: 0.45rem;
    }
    .filter-chip {
      border: 1px solid rgba(196, 92, 0, 0.25);
      background: #fff;
      color: #7a3200;
      border-radius: 999px;
      padding: 0.35rem 0.85rem;
      font-weight: 700;
      cursor: pointer;
    }
    .filter-chip.active {
      background: #7a3200;
      color: #fff;
      border-color: #7a3200;
    }
    .name-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
      gap: 1.15rem;
    }
    .name-card {
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }
    .name-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .top-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .fav-btn {
      background: transparent;
      border: none;
      font-size: 1.15rem;
      cursor: pointer;
      padding: 0.15rem;
    }
    .name-top h3 {
      margin: 0;
      font-size: 1.4rem;
    }
    .script-sub {
      font-size: 0.85rem;
      color: #9a7b6a;
      font-weight: 600;
    }
    .meaning {
      margin: 0;
      font-weight: 700;
      color: #2c1810;
    }
    .significance {
      margin: 0;
      font-size: 0.88rem;
      color: #5c4033;
    }
    .astro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background: #faf6f0;
      border-radius: 10px;
      padding: 0.65rem;
      border: 1px solid rgba(196, 92, 0, 0.12);
    }
    .astro-item {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    }
    .astro-item small {
      font-size: 0.72rem;
      color: #9a7b6a;
      text-transform: uppercase;
      font-weight: 700;
    }
    .astro-item strong {
      font-size: 0.82rem;
      color: #2c1810;
    }
    .blend,
    .deity {
      margin: 0;
      font-size: 0.84rem;
      color: #5c4033;
    }
    .card-footer {
      margin-top: auto;
      padding-top: 0.45rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .syn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .syn-chip {
      background: #fff3e6;
      border: 1px solid rgba(196, 92, 0, 0.2);
      border-radius: 999px;
      padding: 0.15rem 0.55rem;
      font-size: 0.74rem;
      font-weight: 700;
      color: #7a3200;
    }
    .copy-btn {
      background: #7a3200;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 0.35rem 0.85rem;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
    }
  `,
})
export class ChildNamesComponent {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);

  fatherName = '';
  motherName = '';
  deity = 'Any';
  startingLetter = '';
  gender = 'ANY';
  religion = 'Hinduism';
  country = 'India';
  language = this.langService.lang() === 'hi' ? 'hi' : 'en';

  readonly deities = ['Any', 'Shiva', 'Krishna', 'Rama', 'Ganesha', 'Durga', 'Lakshmi', 'Saraswati', 'Hanuman'];
  readonly religions = ['Hinduism', 'Sikhism', 'Jainism', 'Buddhism', 'Islam', 'Christianity', 'Universal'];
  readonly countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Nepal', 'Global'];

  loading = false;
  error = '';
  result: ChildNameResponse | null = null;
  resultGenderFilter: 'ALL' | 'BOY' | 'GIRL' = 'ALL';
  searchQuery = '';
  showShortlistOnly = false;
  copiedName = '';
  shortlist: string[] = this.loadShortlist();

  get filteredSuggestions(): ChildNameSuggestion[] {
    if (!this.result) return [];
    const q = this.searchQuery.trim().toLowerCase();
    return this.result.suggestions.filter(s => {
      const genderOk =
        this.resultGenderFilter === 'ALL' ||
        s.gender === this.resultGenderFilter ||
        s.gender === 'UNISEX';
      const shortlistOk = !this.showShortlistOnly || this.shortlist.includes(s.name);
      const searchOk =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.rashi.toLowerCase().includes(q) ||
        s.nakshatra.toLowerCase().includes(q);
      return genderOk && shortlistOk && searchOk;
    });
  }

  generate(): void {
    if (this.fatherName.trim().length < 2 || this.motherName.trim().length < 2) {
      this.error = 'Please enter both Father and Mother names (at least 2 characters each).';
      return;
    }
    this.error = '';
    this.loading = true;
    this.resultGenderFilter = 'ALL';
    this.showShortlistOnly = false;
    this.api
      .suggestChildNames({
        fatherName: this.fatherName.trim(),
        motherName: this.motherName.trim(),
        deity: this.deity === 'Any' ? '' : this.deity,
        gender: this.gender,
        religion: this.religion,
        country: this.country,
        language: this.language,
        startingLetter: this.startingLetter.trim(),
      })
      .subscribe({
        next: res => {
          this.result = res;
          this.loading = false;
        },
        error: () => {
          this.error = 'Could not generate name suggestions. Please check your connection.';
          this.loading = false;
        },
      });
  }

  isShortlisted(name: string): boolean {
    return this.shortlist.includes(name);
  }

  toggleShortlist(name: string): void {
    if (this.shortlist.includes(name)) {
      this.shortlist = this.shortlist.filter(n => n !== name);
    } else {
      this.shortlist = [...this.shortlist, name];
    }
    try {
      localStorage.setItem(SHORTLIST_KEY, JSON.stringify(this.shortlist));
    } catch {
      // ignore storage errors
    }
  }

  copyName(item: ChildNameSuggestion): void {
    const summary = `${item.name} (${item.scriptText}) — ${item.meaning} | Rashi: ${item.rashi}, Nakshatra: ${item.nakshatra}`;
    navigator.clipboard?.writeText(summary).catch(() => {});
    this.copiedName = item.name;
    setTimeout(() => {
      if (this.copiedName === item.name) {
        this.copiedName = '';
      }
    }, 1800);
  }

  private loadShortlist(): string[] {
    try {
      const raw = localStorage.getItem(SHORTLIST_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }
}
