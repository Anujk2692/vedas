import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YOGA_ASANAS, YogaAsana } from '../../core/data/yoga-asanas.data';
import { LanguageService } from '../../core/services/language.service';
import { YogaPoseSvgComponent } from './yoga-pose-svg.component';

@Component({
  selector: 'app-meditation',
  standalone: true,
  imports: [FormsModule, YogaPoseSvgComponent],
  template: `
    <div class="container" [class.narrow]="tab === 'timer'">
      <div class="mode-tabs">
        <button type="button" class="mode-btn" [class.active]="tab === 'timer'" (click)="tab = 'timer'">
          {{ isHi ? '🧘 ध्यान टाइमर' : '🧘 Meditation Timer' }}
        </button>
        <button type="button" class="mode-btn" [class.active]="tab === 'yoga'" (click)="tab = 'yoga'">
          {{ isHi ? '🤸 योग आसन व प्राणायाम' : '🤸 Yoga Asanas & Benefits' }}
        </button>
      </div>

      @if (tab === 'timer') {
        <div class="timer-box">
          <h1>{{ isHi ? '🧘 ध्यान टाइमर' : '🧘 Meditation Timer' }}</h1>
          <p class="sub">
            {{ isHi ? 'दैनिक ध्यान और श्वास अभ्यास के लिए शांत टाइमर।' : 'Daily dhyaan practice — sit calmly with steady breath.' }}
          </p>
          <div class="timer">{{ display }}</div>
          <div class="presets">
            @for (m of presets; track m) {
              <button type="button" class="chip" [class.active]="minutes === m" (click)="minutes = m">{{ m }} min</button>
            }
          </div>
          <div class="actions">
            @if (!running) {
              <button type="button" class="btn btn-primary" (click)="start()">{{ isHi ? 'शुरू करें' : 'Start' }}</button>
            } @else {
              <button type="button" class="btn btn-outline" (click)="stop()">{{ isHi ? 'रोकें' : 'Stop' }}</button>
            }
          </div>
          @if (completed) {
            <p class="done">{{ isHi ? '🙏 शांति — ध्यान पूर्ण हुआ' : '🙏 Shanti — meditation complete' }}</p>
          }
        </div>
      } @else {
        <div class="yoga-head">
          <h1>{{ isHi ? '🤸 योग आसन व लाभ' : '🤸 Yoga Asanas, Graphics & Video Guides' }}</h1>
          <p class="sub">
            {{
              isHi
                ? 'प्रत्येक आसन की चित्र-विधि, श्वास निर्देश, स्वास्थ्य लाभ और गाइडेड वीडियो।'
                : 'Pose illustrations, step-by-step instructions, health benefits, and guided videos for every asana.'
            }}
          </p>
        </div>

        @if (selected) {
          <div class="detail card">
            <button type="button" class="back-btn" (click)="selected = null">
              {{ isHi ? '← सभी योग आसन' : '← All Yoga Asanas' }}
            </button>
            <div class="detail-top">
              <div class="graphic-frame">
                <app-yoga-pose-svg [poseId]="selected.id" [size]="200" />
              </div>
              <div class="detail-meta">
                <span class="pill">{{ isHi ? selected.categoryHi : selected.category }} · {{ selected.duration }}</span>
                <h2>{{ isHi ? selected.titleHi : selected.titleEn }}</h2>
                <p class="sanskrit">{{ selected.sanskrit }}</p>
                <p class="breath">🌬️ {{ isHi ? selected.breathHi : selected.breathEn }}</p>
              </div>
            </div>

            <div class="video-section">
              <h3>{{ isHi ? '🎥 गाइडेड योग वीडियो' : '🎥 Guided Video Tutorial' }}</h3>
              <div class="video-wrap">
                <iframe
                  [src]="embedUrl(selected.videoId)"
                  title="Yoga video tutorial"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <a
                [href]="'https://www.youtube.com/watch?v=' + selected.videoId"
                target="_blank"
                rel="noopener"
                class="yt-link"
              >
                {{ isHi ? '▶ YouTube पर खोलें' : '▶ Watch on YouTube' }}
              </a>
            </div>

            <div class="two-col">
              <div class="panel">
                <h3>{{ isHi ? '📋 करने की विधि (चित्र सहित)' : '📋 Step-by-Step Visual Guide' }}</h3>
                <div class="steps-visual">
                  @for (step of (isHi ? selected.stepsHi : selected.stepsEn); track step; let i = $index) {
                    <div class="step-card">
                      <div class="step-svg">
                        <app-yoga-pose-svg [poseId]="selected.stepGraphics[i] || selected.id" [size]="110" />
                      </div>
                      <div class="step-text">
                        <span class="step-num">{{ isHi ? 'चरण ' + (i + 1) : 'Step ' + (i + 1) }}</span>
                        <p>{{ step }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div class="panel benefits-panel">
                <h3>{{ isHi ? '✨ मुख्य लाभ (Benefits)' : '✨ Key Benefits' }}</h3>
                <ul>
                  @for (b of (isHi ? selected.benefitsHi : selected.benefitsEn); track b) {
                    <li>✅ {{ b }}</li>
                  }
                </ul>
                <p class="caution">⚠️ {{ isHi ? selected.cautionHi : selected.cautionEn }}</p>
              </div>
            </div>
          </div>
        } @else {
          <div class="presets">
            @for (cat of categories; track cat.key) {
              <button
                type="button"
                class="chip"
                [class.active]="selectedCategory === cat.key"
                (click)="selectedCategory = cat.key"
              >
                {{ isHi ? cat.hi : cat.en }}
              </button>
            }
          </div>

          <div class="yoga-grid">
            @for (a of filteredAsanas; track a.id) {
              <article class="yoga-card card" (click)="selected = a">
                <div class="yoga-graphic">
                  <app-yoga-pose-svg [poseId]="a.id" [size]="150" />
                </div>
                <div class="yoga-body">
                  <span class="pill">{{ isHi ? a.categoryHi : a.category }} · {{ a.duration }}</span>
                  <h3>{{ isHi ? a.titleHi : a.titleEn }}</h3>
                  <p class="sanskrit-sm">{{ a.sanskrit }}</p>
                  <p class="benefit-preview">✅ {{ (isHi ? a.benefitsHi : a.benefitsEn)[0] }}</p>
                  <span class="cta">
                    {{ isHi ? 'विधि, लाभ व वीडियो देखें →' : 'View Graphics, Steps, Benefits & Video →' }}
                  </span>
                </div>
              </article>
            }
          </div>
        }
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 560px; text-align: center; }
    .mode-tabs { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 1.75rem; flex-wrap: wrap; }
    .mode-btn { border: 1px solid rgba(196,92,0,0.25); background: #fff7ed; color: #7a3200; border-radius: 999px; padding: 0.55rem 1.25rem; font-weight: 700; cursor: pointer; }
    .mode-btn.active { background: #c45c00; color: #fff; border-color: #c45c00; }
    .timer-box { text-align: center; }
    .sub { color: #6e4e37; margin-bottom: 1.25rem; }
    .timer { font-size: 3rem; font-weight: 800; color: #7a3200; margin: 2rem 0; }
    .presets { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
    .chip { border: 1px solid rgba(196,92,0,0.2); background: #fff3e6; color: #7a3200; border-radius: 999px; padding: 0.4rem 0.9rem; cursor: pointer; font-weight: 600; }
    .chip.active { background: #c45c00; color: white; border-color: #c45c00; }
    .done { margin-top: 1.5rem; font-weight: 700; color: #7a3200; }
    .yoga-head { text-align: center; margin-bottom: 1rem; }
    .yoga-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1rem; }
    .yoga-card { cursor: pointer; display: flex; flex-direction: column; gap: 0.75rem; transition: transform 0.15s ease; padding: 1rem; border-radius: 16px; border: 1px solid rgba(196,92,0,0.16); background: #fff; }
    .yoga-card:hover { transform: translateY(-2px); border-color: #c45c00; }
    .yoga-graphic { display: flex; justify-content: center; background: #fff8f0; border-radius: 12px; padding: 0.5rem; }
    .pill { display: inline-block; font-size: 0.75rem; font-weight: 700; background: #fff3e6; color: #a14b00; padding: 0.2rem 0.6rem; border-radius: 999px; }
    .yoga-body h3 { margin: 0.45rem 0 0.2rem; color: #4d2200; font-size: 1.05rem; }
    .sanskrit-sm { color: #8c5a32; font-size: 0.85rem; margin: 0 0 0.45rem; }
    .benefit-preview { font-size: 0.88rem; color: #4e3422; margin: 0 0 0.5rem; }
    .cta { font-size: 0.82rem; font-weight: 700; color: #c45c00; }
    .detail { padding: 1.5rem; border-radius: 16px; background: #fff; border: 1px solid rgba(196,92,0,0.18); }
    .back-btn { background: none; border: none; color: #c45c00; font-weight: 700; cursor: pointer; margin-bottom: 1rem; padding: 0; font-size: 0.95rem; }
    .detail-top { display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .graphic-frame { background: #fff8f0; border-radius: 16px; padding: 0.75rem; border: 1px solid rgba(196,92,0,0.16); }
    .detail-meta { flex: 1; min-width: 240px; }
    .detail-meta h2 { margin: 0.4rem 0 0.25rem; color: #4d2200; }
    .sanskrit { font-size: 1rem; color: #8c5a32; margin: 0 0 0.5rem; font-weight: 600; }
    .breath { background: #fff7ed; padding: 0.55rem 0.85rem; border-radius: 10px; color: #6e3d14; font-size: 0.9rem; margin: 0; }
    .video-section { margin-bottom: 1.5rem; }
    .video-section h3 { color: #4d2200; margin-bottom: 0.6rem; }
    .video-wrap { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 14px; background: #000; }
    .video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; }
    .yt-link { display: inline-block; margin-top: 0.6rem; color: #c45c00; font-weight: 700; text-decoration: none; }
    .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem; }
    .panel { background: #fffaf3; border: 1px solid rgba(196,92,0,0.14); border-radius: 14px; padding: 1rem 1.25rem; }
    .panel h3 { margin-top: 0; color: #7a3200; }
    .panel ol, .panel ul { padding-left: 1.2rem; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; color: #3d2717; }
    .steps-visual { display: flex; flex-direction: column; gap: 0.75rem; }
    .step-card { display: flex; gap: 0.85rem; align-items: center; background: #fff; border: 1px solid rgba(196,92,0,0.14); border-radius: 12px; padding: 0.6rem 0.75rem; }
    .step-svg { flex-shrink: 0; background: #fff8f0; border-radius: 10px; padding: 0.25rem; }
    .step-text { flex: 1; }
    .step-num { display: inline-block; font-size: 0.72rem; font-weight: 800; color: #c45c00; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem; }
    .step-text p { margin: 0; font-size: 0.92rem; line-height: 1.45; color: #3d2717; }
    .benefits-panel ul { list-style: none; padding-left: 0; }
    .caution { margin-top: 0.85rem; font-size: 0.85rem; color: #9a3412; background: #ffedd5; padding: 0.55rem 0.75rem; border-radius: 8px; }
  `,
})
export class MeditationComponent {
  private readonly lang = inject(LanguageService);
  private readonly sanitizer = inject(DomSanitizer);

  tab: 'timer' | 'yoga' = 'timer';
  presets = [5, 10, 15, 20, 30];
  minutes = 10;
  secondsLeft = 0;
  running = false;
  completed = false;
  private timerId: ReturnType<typeof setInterval> | null = null;

  asanas = YOGA_ASANAS;
  selected: YogaAsana | null = null;
  selectedCategory = 'All';
  categories = [
    { key: 'All', en: 'All (24)', hi: 'सभी (24)' },
    { key: 'Standing', en: 'Standing', hi: 'खड़े होकर' },
    { key: 'Seated', en: 'Seated', hi: 'बैठकर' },
    { key: 'Backbend', en: 'Backbend', hi: 'पीछे झुकने वाले' },
    { key: 'Inversion', en: 'Inversion', hi: 'उल्टे आसन' },
    { key: 'Relaxation', en: 'Relaxation', hi: 'विश्राम' },
    { key: 'Pranayama', en: 'Pranayama', hi: 'प्राणायाम' },
  ];

  get isHi(): boolean {
    return this.lang.lang() === 'hi' || this.lang.lang() === 'sa';
  }

  get filteredAsanas(): YogaAsana[] {
    if (this.selectedCategory === 'All') return this.asanas;
    return this.asanas.filter(a => a.category === this.selectedCategory);
  }

  embedUrl(videoId: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?rel=0`);
  }

  get display(): string {
    const total = this.running || this.secondsLeft > 0 ? this.secondsLeft : this.minutes * 60;
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  start(): void {
    this.stop(false);
    this.completed = false;
    this.secondsLeft = this.minutes * 60;
    this.running = true;
    this.timerId = setInterval(() => {
      if (this.secondsLeft <= 1) {
        this.stop(true);
        return;
      }
      this.secondsLeft -= 1;
    }, 1000);
  }

  stop(markComplete = false): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.running = false;
    if (markComplete) {
      this.completed = true;
      this.secondsLeft = 0;
    }
  }
}
