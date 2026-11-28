import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AstrologerProfile, ConsultationMessage, ConsultationSessionView } from '../../core/models';

@Component({
  selector: 'app-live-consultation',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container">
      <h1>🎙️ Live Astrologer Consultation (Chat · Audio · Video)</h1>
      <p class="sub">Connect 1-on-1 with verified Vedic, KP, Lal Kitab & Numerology Acharyas via Live Chat, Audio or Video Call.</p>

      <div class="card topic-box">
        <label>Your Consultation Topic <input [(ngModel)]="topic" placeholder="e.g. Career, Marriage, Kundli Milan, Business Muhurat" /></label>
      </div>

      <div class="grid-2">
        @for (a of astrologers; track a.id) {
          <div class="card">
            <div class="top-row">
              <strong>{{ a.name }}</strong>
              <span class="online">● LIVE</span>
            </div>
            <p>{{ a.specialtyEn }}</p>
            <p class="muted">{{ a.languages }} · {{ a.experienceYears }} yrs · ⭐ {{ a.rating }} · <strong>{{ a.feeDisplay }}</strong></p>
            <div class="btn-row">
              @for (m of a.modes; track m) {
                <button type="button" class="btn btn-primary" (click)="startSession(a, m)" [disabled]="loading">
                  {{ m === 'CHAT' ? '💬 Chat' : m === 'AUDIO' ? '📞 Audio' : '📹 Video' }}
                </button>
              }
            </div>
          </div>
        }
      </div>

      @if (activeSession) {
        <div class="card session-room">
          <div class="top-row">
            <h2>Live Room: {{ activeSession.astrologerName }} ({{ activeSession.mode }})</h2>
            <a [href]="activeSession.joinUrl" target="_blank" rel="noopener" class="btn btn-outline">
              📹 Open Live Audio/Video Call
            </a>
          </div>
          <p class="muted">Room: {{ activeSession.roomCode }} · Topic: {{ activeSession.topic }}</p>

          <div class="chat-box">
            @for (msg of messages; track msg.id) {
              <div class="msg" [class.user]="msg.senderRole === 'USER'">
                <strong>{{ msg.senderName }}:</strong> {{ msg.message }}
              </div>
            }
          </div>

          <div class="send-row">
            <input [(ngModel)]="draft" placeholder="Type your birth details or question..." (keyup.enter)="send()" />
            <button type="button" class="btn btn-primary" (click)="send()">Send</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .sub { color: #6e4e37; margin-bottom: 1rem; }
    .topic-box { margin-bottom: 1rem; }
    label { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; font-weight: 700; color: #7a3200; }
    input { padding: 0.55rem 0.75rem; border-radius: 8px; border: 1px solid rgba(196,92,0,0.25); font: inherit; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 0.85rem; margin-bottom: 1.25rem; }
    .top-row { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .online { color: #16a34a; font-weight: 800; font-size: 0.82rem; }
    .btn-row { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
    .muted { color: #6e4e37; font-size: 0.86rem; }
    .session-room { border: 2px solid #c45c00; }
    .chat-box { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem; margin: 0.85rem 0; padding: 0.5rem; background: #fffaf5; border-radius: 10px; }
    .msg { padding: 0.6rem 0.8rem; border-radius: 10px; background: #f3ece4; align-self: flex-start; max-width: 85%; }
    .msg.user { background: #fde6cc; align-self: flex-end; }
    .send-row { display: flex; gap: 0.5rem; }
    .send-row input { flex: 1; }
  `,
})
export class LiveConsultationComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly sub = inject(SubscriptionService);

  astrologers: AstrologerProfile[] = [];
  topic = 'Kundli & Career Guidance';
  activeSession: ConsultationSessionView | null = null;
  messages: ConsultationMessage[] = [];
  draft = '';
  loading = false;

  ngOnInit(): void {
    this.api.getAstrologers().subscribe(list => (this.astrologers = list));
  }

  startSession(a: AstrologerProfile, mode: string): void {
    this.loading = true;
    this.api
      .bookConsultation({
        accountKey: this.sub.getAccountKey(),
        astrologerId: a.id,
        mode,
        topic: this.topic,
      })
      .subscribe({
        next: session => {
          this.activeSession = session;
          this.loading = false;
          this.api.getConsultationMessages(session.id).subscribe(m => (this.messages = m));
        },
        error: () => { this.loading = false; },
      });
  }

  send(): void {
    if (!this.activeSession || !this.draft.trim()) return;
    const text = this.draft.trim();
    this.draft = '';
    this.api
      .sendConsultationMessage(this.activeSession.id, this.sub.getAccountKey(), text)
      .subscribe(m => (this.messages = m));
  }
}
