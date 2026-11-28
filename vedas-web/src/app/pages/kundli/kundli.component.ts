import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { KundliRequest, KundliResponse, MilanResponse } from '../../core/models';

@Component({
  selector: 'app-kundli',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <h1>🔭 Astronomical Kundli, KP, Lal Kitab & 36-Guna Milan</h1>
      <p class="sub">Sidereal Lahiri Ayanamsa planetary degrees, D9 Navamsa, KP Sub-Lord, Vimshottari Dasha & Ashtakoot Gun Milan.</p>

      <div class="tabs">
        <button type="button" class="btn" [class.btn-primary]="tab === 'kundli'" [class.btn-outline]="tab !== 'kundli'" (click)="tab = 'kundli'">
          🪐 Full Kundli (D1 + D9 + KP + Dasha)
        </button>
        <button type="button" class="btn" [class.btn-primary]="tab === 'milan'" [class.btn-outline]="tab !== 'milan'" (click)="tab = 'milan'">
          💍 36-Guna Kundli Milan
        </button>
      </div>

      @if (tab === 'kundli') {
        <form class="card form-grid" (ngSubmit)="runKundli()">
          <label>Name <input [(ngModel)]="form.name" name="name" placeholder="Native name" /></label>
          <label>Birth Date <input type="date" [(ngModel)]="form.birthDate" name="birthDate" required /></label>
          <label>Birth Time <input type="time" [(ngModel)]="form.birthTime" name="birthTime" required /></label>
          <label>Latitude <input type="number" step="0.0001" [(ngModel)]="form.latitude" name="lat" /></label>
          <label>Longitude <input type="number" step="0.0001" [(ngModel)]="form.longitude" name="lon" /></label>
          <button type="submit" class="btn btn-primary" [disabled]="loading">{{ loading ? 'Calculating...' : 'Generate Astronomical Kundli' }}</button>
        </form>

        @if (kundli) {
          <div class="card summary">
            <div><strong>Lagna (Ascendant):</strong> {{ kundli.lagnaSign }} ({{ kundli.lagnaNakshatra }})</div>
            <div><strong>Moon Rashi:</strong> {{ kundli.moonSign }} · <strong>Nakshatra:</strong> {{ kundli.nakshatra }} (Pada {{ kundli.pada }})</div>
            <div><strong>Sun Sign:</strong> {{ kundli.sunSign }} · <strong>Lahiri Ayanamsa:</strong> {{ kundli.ayanamsaFormatted }}</div>
            <div [class.warn]="kundli.manglik">{{ kundli.manglikReason }}</div>
          </div>

          <h2>Planetary Longitudes (D1, D9 Navamsa & KP Sub-Lord)</h2>
          <div class="card table-wrap">
            <table>
              <thead>
                <tr><th>Planet</th><th>Rashi (D1)</th><th>Degree</th><th>House</th><th>Nakshatra (Pada)</th><th>KP Star / Sub-Lord</th><th>Navamsa (D9)</th></tr>
              </thead>
              <tbody>
                @for (p of kundli.planets; track p.planet) {
                  <tr>
                    <td><strong>{{ p.planet }}</strong> {{ p.retrograde ? '(R)' : '' }}</td>
                    <td>{{ p.sign }}</td>
                    <td>{{ p.degreeFormatted }}</td>
                    <td>{{ p.house }}</td>
                    <td>{{ p.nakshatra }} ({{ p.pada }})</td>
                    <td>{{ p.starLord }} / <strong>{{ p.subLord }}</strong></td>
                    <td>{{ p.navamsaSign }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <h2>Vimshottari Mahadasha Timeline</h2>
          <div class="grid-3">
            @for (d of kundli.mahadashas; track d.planet) {
              <div class="card" [class.current]="d.current">
                <strong>{{ d.planet }} {{ d.current ? '● ACTIVE' : '' }}</strong>
                <p>{{ d.startDate }} → {{ d.endDate }}</p>
                <span class="muted">{{ d.years }} years</span>
              </div>
            }
          </div>

          <h2>Lal Kitab House Insights & Remedies</h2>
          <div class="grid-2">
            @for (lk of kundli.lalKitab; track lk.planet) {
              <div class="card">
                <strong>{{ lk.planet }} (House {{ lk.house }}) — {{ lk.status }}</strong>
                <p>{{ lk.remedyEn }}</p>
                <p class="muted">{{ lk.remedyHi }}</p>
              </div>
            }
          </div>
        }
      } @else {
        <form class="card" (ngSubmit)="runMilan()">
          <div class="grid-2">
            <div>
              <h3>👨 Boy Details</h3>
              <label>Name <input [(ngModel)]="boy.name" name="bName" /></label>
              <label>Date <input type="date" [(ngModel)]="boy.birthDate" name="bDate" /></label>
              <label>Time <input type="time" [(ngModel)]="boy.birthTime" name="bTime" /></label>
            </div>
            <div>
              <h3>👩 Girl Details</h3>
              <label>Name <input [(ngModel)]="girl.name" name="gName" /></label>
              <label>Date <input type="date" [(ngModel)]="girl.birthDate" name="gDate" /></label>
              <label>Time <input type="time" [(ngModel)]="girl.birthTime" name="gTime" /></label>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 1rem;" [disabled]="loading">
            {{ loading ? 'Matching...' : 'Check 36-Guna Ashtakoot Milan' }}
          </button>
        </form>

        @if (milan) {
          <div class="card summary">
            <h2>Score: {{ milan.totalScore }} / {{ milan.maxScore }} — {{ milan.verdict }}</h2>
            <p><strong>Boy:</strong> {{ milan.boyRashi }} ({{ milan.boyNakshatra }}) · {{ milan.boyManglik ? 'Manglik' : 'Non-Manglik' }}</p>
            <p><strong>Girl:</strong> {{ milan.girlRashi }} ({{ milan.girlNakshatra }}) · {{ milan.girlManglik ? 'Manglik' : 'Non-Manglik' }}</p>
          </div>
          <div class="grid-2">
            @for (k of milan.kootas; track k.name) {
              <div class="card">
                <strong>{{ k.name }}: {{ k.obtained }} / {{ k.max }}</strong>
                <p class="muted">{{ k.detail }}</p>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
  styles: `
    .sub { color: #6e4e37; margin-bottom: 1rem; }
    .tabs { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; align-items: end; margin-bottom: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; font-weight: 700; color: #7a3200; }
    input { padding: 0.55rem 0.75rem; border-radius: 8px; border: 1px solid rgba(196,92,0,0.25); font: inherit; }
    .summary { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 1rem; }
    .warn { color: #b42318; font-weight: 700; }
    .table-wrap { overflow-x: auto; margin-bottom: 1.25rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { text-align: left; padding: 0.5rem 0.6rem; border-bottom: 1px solid rgba(196,92,0,0.12); }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem; }
    .current { border: 2px solid #c45c00; background: #fff8f0; }
    .muted { color: #6e4e37; font-size: 0.85rem; }
  `,
})
export class KundliComponent {
  private readonly api = inject(ApiService);
  tab: 'kundli' | 'milan' = 'kundli';
  loading = false;

  form: KundliRequest = { name: 'Anuj', birthDate: '1992-06-26', birthTime: '09:15', latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5 };
  boy: KundliRequest = { name: 'Boy', birthDate: '1992-06-26', birthTime: '09:15', latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5 };
  girl: KundliRequest = { name: 'Girl', birthDate: '1994-08-15', birthTime: '14:30', latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5 };

  kundli: KundliResponse | null = null;
  milan: MilanResponse | null = null;

  runKundli(): void {
    this.loading = true;
    this.api.computeKundli(this.form).subscribe({
      next: res => { this.kundli = res; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  runMilan(): void {
    this.loading = true;
    this.api.computeMilan(this.boy, this.girl).subscribe({
      next: res => { this.milan = res; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
