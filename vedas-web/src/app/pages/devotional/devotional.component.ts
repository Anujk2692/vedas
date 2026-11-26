import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SpeechService } from '../../core/services/speech.service';
import { DevotionalItem, DevotionalLine } from '../../core/models';

@Component({
  selector: 'app-devotional',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="container">
      @if (detail) {
        <div class="narrow">
          <a [routerLink]="['/' + mode]" class="back">
            {{ isHi ? '← वापस सूची में' : '← Back to list' }}
          </a>
          <div class="hero-box card">
            <span class="pill">{{ detail.deity }}</span>
            <h1>{{ detail.title }}</h1>
            <p class="sanskrit-sm">{{ detail.sanskritName }}</p>
            <p>{{ detail.description }}</p>
            @if (speech.voiceOutputSupported) {
              <button type="button" class="btn btn-primary" (click)="toggleSpeakAll()">
                {{ speakingAll ? (isHi ? '⏹ रोकें' : '⏹ Stop Audio') : (isHi ? '🔊 पूरा पाठ सुनें' : '🔊 Listen Full') }}
              </button>
            }
          </div>

          <p class="tap-hint">
            {{ isHi ? '💡 किसी भी पद पर टैप करें और ऑडियो में सुनें' : '💡 Tap any stanza below to hear it read aloud' }}
          </p>

          <div class="verses">
            @for (line of detail.lines ?? []; track $index) {
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
        </div>
      } @else {
        <div class="head-row">
          <div>
            <h1>
              {{
                mode === 'chalisas'
                  ? (isHi ? '📿 चालीसा संग्रह' : '📿 Chalisa Collection')
                  : (isHi ? '🎶 भजन संग्रह' : '🎶 Bhajan Collection')
              }}
            </h1>
            <p class="sub">
              {{
                isHi
                  ? 'किसी भी पद पर टैप करके ऑडियो के साथ पढ़ें और सुनें'
                  : 'Read and tap any stanza to listen aloud'
              }}
            </p>
          </div>
          <input
            type="search"
            class="search-input"
            [(ngModel)]="query"
            [placeholder]="isHi ? 'खोजें…' : 'Search…'" />
        </div>

        @if (loading) {
          <p class="loading">{{ isHi ? 'लोड हो रहा है…' : 'Loading…' }}</p>
        }

        <div class="grid">
          @for (item of filteredItems; track item.slug) {
            <a [routerLink]="['/' + mode, item.slug]" class="card scripture-card">
              <span class="pill">{{ item.deity }}</span>
              <h3>{{ item.title }}</h3>
              <p class="sanskrit-sm">{{ item.sanskritName }}</p>
              <p>{{ item.description }}</p>
              <span class="meta">{{ item.lineCount }} {{ isHi ? 'पद' : 'stanzas' }} →</span>
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 760px; margin: 0 auto; }
    .head-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 1rem; margin-bottom: 1.25rem; }
    .head-row h1 { margin: 0 0 0.25rem; }
    .sub { margin: 0; color: #5c4033; font-size: 0.92rem; }
    .search-input { padding: 0.55rem 0.9rem; border-radius: 999px; border: 1px solid rgba(196, 92, 0, 0.28); background: #fff; min-width: 220px; font-size: 0.9rem; }
    .hero-box { background: linear-gradient(135deg, #fff9f2 0%, #fff1df 100%); border: 1.5px solid rgba(196, 92, 0, 0.22); margin-bottom: 1rem; }
    .hero-box h1 { margin: 0.5rem 0 0.25rem; }
    .tap-hint { font-size: 0.86rem; color: #7a3200; font-weight: 700; margin: 0 0 0.75rem; }
    .verses { display: flex; flex-direction: column; gap: 0.85rem; }
    .verse-card { cursor: pointer; transition: border-color 0.15s, background 0.15s; }
    .verse-card:hover { border-color: rgba(196, 92, 0, 0.45); }
    .verse-card.active-verse { background: #fff7ed; border: 1.5px solid #c45c00; }
    .verse-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem; }
    .verse-num { background: #fff3e6; color: #c45c00; font-weight: 800; font-size: 0.75rem; padding: 0.15rem 0.55rem; border-radius: 999px; }
    .tap-audio { font-size: 0.76rem; font-weight: 700; color: #9a7b6a; }
    .active-verse .tap-audio { color: #c45c00; }
    .sanskrit { font-size: 1.18rem; color: #7a3200; line-height: 1.75; margin: 0.25rem 0; font-weight: 600; }
    .translit { font-style: italic; color: #9a7b6a; margin: 0.25rem 0; }
    .meaning { margin: 0.35rem 0 0; color: #2c1810; }
    @media (max-width: 600px) { .search-input { width: 100%; min-width: 0; } }
  `,
})
export class DevotionalComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  readonly speech = inject(SpeechService);

  mode: 'chalisas' | 'bhajans' = 'chalisas';
  items: DevotionalItem[] = [];
  detail: DevotionalItem | null = null;
  query = '';
  loading = true;
  speakingAll = false;
  activeLineIndex: number | null = null;

  get isHi(): boolean {
    return this.langService.isHi();
  }

  get filteredItems(): DevotionalItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(
      i =>
        i.title.toLowerCase().includes(q) ||
        i.deity.toLowerCase().includes(q) ||
        i.sanskritName.toLowerCase().includes(q),
    );
  }

  ngOnInit(): void {
    this.mode = (this.route.snapshot.data['mode'] as 'chalisas' | 'bhajans') ?? 'chalisas';
    const slug = this.route.snapshot.paramMap.get('slug');
    const lang = this.langService.lang();

    if (slug) {
      const obs = this.mode === 'chalisas' ? this.api.getChalisa(slug, lang) : this.api.getBhajan(slug, lang);
      obs.subscribe({
        next: d => {
          this.detail = d;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } else {
      const obs = this.mode === 'chalisas' ? this.api.getChalisas(lang) : this.api.getBhajans(lang);
      obs.subscribe({
        next: list => {
          this.items = list;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  toggleSpeakAll(): void {
    if (!this.detail?.lines?.length) return;
    if (this.speakingAll) {
      this.speech.stopSpeaking();
      this.speakingAll = false;
      this.activeLineIndex = null;
      return;
    }
    const text = this.detail.lines.map(l => l.sanskrit).join(' ');
    this.activeLineIndex = null;
    this.speakingAll = true;
    this.speech.speak(text, 'hi');
  }

  speakLine(line: DevotionalLine, index: number): void {
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
