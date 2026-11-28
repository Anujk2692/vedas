import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { PujaBooking, PujaCatalogItem, TempleAudioItem } from '../../core/models';

@Component({
  selector: 'app-puja-booking',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <h1>🛕 Temple Chadhava, Puja Booking & Temple Audio</h1>
      <p class="sub">Book authentic Sankalp Puja & Chadhava at sacred temples and listen to Temple Bell, Shankh & Aarti ambience.</p>

      <h2>🔔 Temple Audio Collection</h2>
      <div class="grid-2">
        @for (a of audios; track a.id) {
          <div class="card">
            <strong>{{ a.titleEn }}</strong>
            <p class="muted">{{ a.templeName }} · {{ a.category }} · {{ a.durationLabel }}</p>
            <audio controls [src]="a.streamUrl" style="width: 100%; margin-top: 0.5rem;"></audio>
          </div>
        }
      </div>

      <h2>🪔 Book Temple Puja / Chadhava</h2>
      <div class="card form-box">
        <div class="grid-3">
          <label>Devotee Name <input [(ngModel)]="devoteeName" placeholder="Full Name for Sankalp" /></label>
          <label>Gotra <input [(ngModel)]="gotra" placeholder="e.g. Kashyap" /></label>
          <label>Preferred Date <input type="date" [(ngModel)]="bookingDate" /></label>
        </div>
        <label style="margin-top: 0.5rem;">Sankalp / Wish <input [(ngModel)]="sankalpNotes" placeholder="Health, Career, Family Peace..." /></label>
      </div>

      @if (bookingSuccess) {
        <p class="ok">{{ bookingSuccess }}</p>
      }

      <div class="grid-3">
        @for (p of pujas; track p.code) {
          <div class="card puja-card">
            <span class="tag">{{ p.deity }}</span>
            <h3>{{ p.titleEn }}</h3>
            <p class="muted">{{ p.templeName }}</p>
            <p>{{ p.benefitsEn }}</p>
            <div class="foot">
              <strong class="price">{{ p.priceDisplay }}</strong>
              <button type="button" class="btn btn-primary" (click)="book(p)" [disabled]="loading">Book Seva</button>
            </div>
          </div>
        }
      </div>

      @if (myBookings.length) {
        <h2>📜 My Puja Bookings</h2>
        <div class="grid-2">
          @for (b of myBookings; track b.id) {
            <div class="card">
              <strong>{{ b.pujaTitle }} · {{ b.status }}</strong>
              <p class="muted">{{ b.templeName }} · {{ b.bookingDate }}</p>
              <p>Devotee: {{ b.devoteeName }} ({{ b.gotra }})</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .sub { color: #6e4e37; margin-bottom: 1rem; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.85rem; margin-bottom: 1.5rem; }
    .form-box { margin-bottom: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; font-weight: 700; color: #7a3200; }
    input { padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px solid rgba(196,92,0,0.25); font: inherit; }
    .puja-card { display: flex; flex-direction: column; gap: 0.4rem; }
    .tag { font-size: 0.75rem; font-weight: 800; color: #c45c00; }
    .foot { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 0.5rem; }
    .price { font-size: 1.2rem; color: #7a3200; }
    .muted { color: #6e4e37; font-size: 0.86rem; }
    .ok { background: #dcfce7; color: #166534; padding: 0.75rem 1rem; border-radius: 10px; font-weight: 700; margin-bottom: 1rem; }
  `,
})
export class PujaBookingComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly sub = inject(SubscriptionService);

  pujas: PujaCatalogItem[] = [];
  audios: TempleAudioItem[] = [];
  myBookings: PujaBooking[] = [];
  devoteeName = '';
  gotra = 'Kashyap';
  bookingDate = new Date().toISOString().slice(0, 10);
  sankalpNotes = '';
  bookingSuccess = '';
  loading = false;

  ngOnInit(): void {
    this.api.getSevaCatalog().subscribe(res => {
      this.pujas = res.pujas;
      this.audios = res.templeAudios;
    });
    this.loadMyBookings();
  }

  loadMyBookings(): void {
    this.api.myPujas(this.sub.getAccountKey()).subscribe(list => (this.myBookings = list));
  }

  book(p: PujaCatalogItem): void {
    const name = this.devoteeName.trim() || 'Devotee';
    this.loading = true;
    this.bookingSuccess = '';
    this.api
      .bookPuja({
        accountKey: this.sub.getAccountKey(),
        pujaCode: p.code,
        devoteeName: name,
        gotra: this.gotra,
        bookingDate: this.bookingDate,
        sankalpNotes: this.sankalpNotes,
      })
      .subscribe({
        next: b => {
          this.loading = false;
          this.bookingSuccess = `Confirmed: ${b.pujaTitle} at ${b.templeName} for ${b.devoteeName} on ${b.bookingDate}`;
          this.loadMyBookings();
        },
        error: () => { this.loading = false; },
      });
  }
}
