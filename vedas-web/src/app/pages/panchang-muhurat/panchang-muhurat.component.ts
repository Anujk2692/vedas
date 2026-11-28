import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { DetailedPanchangResponse } from '../../core/models';

@Component({
  selector: 'app-panchang-muhurat',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <h1>🗓️ Detailed Panchang, Choghadiya & Shubh Muhurat</h1>
      <div class="card bar">
        <label>Select Date <input type="date" [(ngModel)]="date" /></label>
        <button type="button" class="btn btn-primary" (click)="load()" [disabled]="loading">
          {{ loading ? 'Loading...' : 'Check Panchang & Muhurat' }}
        </button>
      </div>

      @if (data) {
        <div class="grid-3">
          <div class="card"><strong>Tithi & Paksha</strong><p>{{ data.paksha }} {{ data.tithi }}</p></div>
          <div class="card"><strong>Nakshatra & Yoga</strong><p>{{ data.nakshatra }} · {{ data.yoga }}</p></div>
          <div class="card"><strong>Karana & Signs</strong><p>{{ data.karana }} · Sun: {{ data.sunSign }}</p></div>
          <div class="card"><strong>Sunrise / Sunset</strong><p>{{ data.sunrise }} / {{ data.sunset }}</p></div>
          <div class="card good"><strong>Abhijit Muhurat</strong><p>{{ data.abhijitMuhurat }}</p></div>
          <div class="card bad"><strong>Rahu Kaal / Yamaganda</strong><p>{{ data.rahuKaal }} · {{ data.yamaganda }}</p></div>
        </div>

        <h2>Day Choghadiya</h2>
        <div class="grid-4">
          @for (c of data.dayChoghadiya; track c.period) {
            <div class="card" [class.good]="c.quality === 'Auspicious'" [class.bad]="c.quality === 'Avoid'">
              <strong>{{ c.name }} ({{ c.quality }})</strong>
              <p>{{ c.timeRange }}</p>
            </div>
          }
        </div>

        <h2>Shubh Muhurat Recommendations</h2>
        <div class="grid-2">
          @for (m of data.shubhMuhurats; track m.activity) {
            <div class="card">
              <strong>{{ m.activity }}</strong>
              <p>{{ m.window }} · <em>{{ m.quality }}</em></p>
              <p class="muted">{{ m.notes }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .bar { display: flex; gap: 0.75rem; align-items: end; margin-bottom: 1rem; flex-wrap: wrap; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; font-weight: 700; color: #7a3200; }
    input { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid rgba(196,92,0,0.25); font: inherit; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; margin-bottom: 1.25rem; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; }
    .good { border-left: 4px solid #16a34a; background: #f0fdf4; }
    .bad { border-left: 4px solid #dc2626; background: #fef2f2; }
    .muted { color: #6e4e37; font-size: 0.88rem; }
  `,
})
export class PanchangMuhuratComponent implements OnInit {
  private readonly api = inject(ApiService);
  date = new Date().toISOString().slice(0, 10);
  data: DetailedPanchangResponse | null = null;
  loading = false;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getDetailedPanchang(this.date).subscribe({
      next: d => { this.data = d; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
