import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SpeechService } from '../../core/services/speech.service';
import { AartiDetail, AartiLine } from '../../core/models';

@Component({
  selector: 'app-aarti-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      <a routerLink="/aartis" class="back">{{ isHi ? '← सभी आरती' : '← All Aartis' }}</a>

      @if (aarti) {
        <div class="hero-box card">
          <span class="pill">{{ aarti.deityType }}</span>
          <h1>{{ aarti.title }}</h1>
          <p class="sanskrit-sm">{{ aarti.sanskritName }} · {{ aarti.transliteration }}</p>
          <p>{{ aarti.description }}</p>

          <div class="actions">
            @if (speech.voiceOutputSupported) {
              <button type="button" class="btn btn-primary" (click)="toggleSpeakAll()">
                {{ speakingAll ? (isHi ? '⏹ रोकें' : '⏹ Stop Audio') : (isHi ? '🔊 पूरी आरती सुनें' : '🔊 Listen Full Aarti') }}
              </button>
            }
            @if (aarti.pdfUrl) {
              <a [href]="aarti.pdfUrl" target="_blank" rel="noopener" class="btn btn-outline">
                {{ isHi ? '📄 PDF खोलें' : '📄 Open PDF' }}
              </a>
            }
          </div>

          @if (aarti.audioUrl) {
            <audio controls [src]="aarti.audioUrl" class="audio-player"></audio>
          }
        </div>

        <p class="tap-hint">
          {{ isHi ? '💡 किसी भी पद पर टैप करें और उसे ऑडियो में सुनें' : '💡 Tap any stanza below to hear it read aloud' }}
        </p>

        <div class="verses">
          @for (line of aarti.lines; track $index) {
            <article
              class="card verse-card"
              [class.active-verse]="activeLineIndex === $index"
              (click)="speakLine(line, $index)">
              <div class="verse-top">
                <span class="verse-num">{{ $index + 1 }}</span>
                <span class="tap-audio">
                  {{ activeLineIndex === $index ? (isHi ? '🔊 सुन रहे हैं… (टैप कर रोकें)' : '🔊 Playing… (Tap to stop)') : (isHi ? '🔊 सुनने के लिए टैप करें' : '🔊 Tap to listen') }}
                </span>
              </div>
              <p class="sanskrit">{{ line.sanskrit }}</p>
              <p class="translit">{{ line.transliteration }}</p>
              <p class="meaning">{{ line.translation }}</p>
            </article>
          }
        </div>
      } @else {
        <p class="loading">{{ isHi ? 'लोड हो रहा है…' : 'Loading…' }}</p>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 760px; }
    .hero-box {
      background: linear-gradient(135deg, #fff9f2 0%, #fff1df 100%);
      border: 1.5px solid rgba(196, 92, 0, 0.22);
      margin-bottom: 1rem;
    }
    .hero-box h1 { margin: 0.5rem 0 0.25rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.65rem; margin-top: 0.9rem; }
    .audio-player { width: 100%; margin-top: 0.9rem; }
    .tap-hint { font-size: 0.86rem; color: #7a3200; font-weight: 700; margin: 0 0 0.75rem; }
    .verses { display: flex; flex-direction: column; gap: 0.85rem; }
    .verse-card {
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s, transform 0.12s;
    }
    .verse-card:hover {
      border-color: rgba(196, 92, 0, 0.45);
      transform: translateY(-1px);
    }
    .verse-card.active-verse {
      background: #fff7ed;
      border: 1.5px solid #c45c00;
    }
    .verse-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }
    .verse-num {
      display: inline-block;
      background: #fff3e6;
      color: #c45c00;
      font-weight: 800;
      font-size: 0.75rem;
      padding: 0.15rem 0.55rem;
      border-radius: 999px;
    }
    .tap-audio {
      font-size: 0.76rem;
      font-weight: 700;
      color: #9a7b6a;
    }
    .active-verse .tap-audio { color: #c45c00; }
    .sanskrit { font-size: 1.18rem; color: #7a3200; line-height: 1.75; margin: 0.25rem 0; font-weight: 600; }
    .translit { font-style: italic; color: #9a7b6a; margin: 0.25rem 0; }
    .meaning { margin: 0.35rem 0 0; color: #2c1810; }
  `,
})
export class AartiDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  readonly speech = inject(SpeechService);
  aarti: AartiDetail | null = null;
  speakingAll = false;
  activeLineIndex: number | null = null;

  get isHi(): boolean {
    return this.langService.isHi();
  }

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getAarti(slug, this.langService.lang()).subscribe(a => (this.aarti = a));
  }

  toggleSpeakAll(): void {
    if (!this.aarti) return;
    if (this.speakingAll) {
      this.speech.stopSpeaking();
      this.speakingAll = false;
      this.activeLineIndex = null;
      return;
    }
    const text = this.aarti.lines.map(l => l.sanskrit).join(' ');
    this.activeLineIndex = null;
    this.speakingAll = true;
    this.speech.speak(text, 'hi');
  }

  speakLine(line: AartiLine, index: number): void {
    if (!this.speech.voiceOutputSupported) return;
    if (this.activeLineIndex === index) {
      this.speech.stopSpeaking();
      this.activeLineIndex = null;
      return;
    }
    this.speakingAll = false;
    this.activeLineIndex = index;
    this.speech.speak(line.sanskrit, 'hi');
  }

  ngOnDestroy(): void {
    this.speech.stopSpeaking();
  }
}
