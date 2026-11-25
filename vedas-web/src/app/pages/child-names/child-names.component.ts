import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { ChildNameResponse } from '../../core/models';

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
          Combine Father &amp; Mother names with optional God/Goddess synonyms, religion, country, and language-specific meanings.
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

      @if (result) {
        <section class="results-section">
          <div class="results-head">
            <h2>{{ result.totalSuggestions }} Suggestions for {{ result.fatherName }} &amp; {{ result.motherName }}</h2>
            <span class="meta">
              {{ result.deity }} · {{ result.religion }} · {{ result.country }} · {{ result.language.toUpperCase() }}
            </span>
          </div>

          <div class="name-grid">
            @for (item of result.suggestions; track item.name) {
              <article class="card name-card">
                <div class="name-top">
                  <h3>{{ item.name }}</h3>
                  <span class="pill">{{ item.gender }}</span>
                </div>
                <p class="meaning">{{ item.meaning }}</p>
                <p class="blend"><strong>Combination:</strong> {{ item.combinationSource }}</p>
                <p class="deity"><strong>Deity / Origin:</strong> {{ item.deityConnection }} · {{ item.origin }}</p>
                @if (item.synonyms.length) {
                  <div class="syn-row">
                    @for (syn of item.synonyms; track syn) {
                      <span class="syn-chip">{{ syn }}</span>
                    }
                  </div>
                }
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
      margin-bottom: 2rem;
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
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
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
    .field select {
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
    .results-head {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .name-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 1rem;
    }
    .name-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .name-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .name-top h3 {
      margin: 0;
      font-size: 1.35rem;
    }
    .meaning {
      margin: 0;
      font-weight: 600;
      color: #2c1810;
    }
    .blend,
    .deity {
      margin: 0;
      font-size: 0.86rem;
      color: #5c4033;
    }
    .syn-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.25rem;
    }
    .syn-chip {
      background: #faf6f0;
      border: 1px solid rgba(196, 92, 0, 0.2);
      border-radius: 999px;
      padding: 0.15rem 0.55rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #7a3200;
    }
  `,
})
export class ChildNamesComponent {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);

  fatherName = '';
  motherName = '';
  deity = 'Any';
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

  generate(): void {
    if (this.fatherName.trim().length < 2 || this.motherName.trim().length < 2) {
      this.error = 'Please enter both Father and Mother names (at least 2 characters each).';
      return;
    }
    this.error = '';
    this.loading = true;
    this.api
      .suggestChildNames({
        fatherName: this.fatherName.trim(),
        motherName: this.motherName.trim(),
        deity: this.deity === 'Any' ? '' : this.deity,
        gender: this.gender,
        religion: this.religion,
        country: this.country,
        language: this.language,
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
}
