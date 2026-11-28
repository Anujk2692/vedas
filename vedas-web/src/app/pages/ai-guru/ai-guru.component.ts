import { Component, OnDestroy, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SpeechService } from '../../core/services/speech.service';
import { AskResponse } from '../../core/models';

@Component({
  selector: 'app-ai-guru',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container narrow">
      <h1>🙏 AI Guru</h1>
      <p>Ask any question — AI Guru combines Vedic Astrology (Jyotish), Numerology, Panchang, Vastu, and Scriptures.</p>

      <div class="astro-toggle-row">
        <button type="button" class="btn btn-outline astro-toggle" (click)="showAstro = !showAstro">
          {{ showAstro ? '▾ Hide Birth & Name Details' : '🔮 Add Birth Date / Name for Jyotish & Numerology' }}
        </button>
        <label class="auto-speak">
          <input type="checkbox" [(ngModel)]="autoSpeak" />
          Auto-play answer audio
        </label>
      </div>

      @if (showAstro) {
        <div class="card astro-panel">
          <input [(ngModel)]="personName" placeholder="Full Name / पूरा नाम" />
          <input [(ngModel)]="birthDate" placeholder="Birth Date (DD/MM/YYYY)" />
          <input [(ngModel)]="birthTime" placeholder="Birth Time (HH:MM, e.g. 06:30)" />
          <input [(ngModel)]="birthPlace" placeholder="Birth Place / City" />
          <select [(ngModel)]="gender">
            <option value="">Gender (Optional)</option>
            <option value="Male">Male / पुरुष</option>
            <option value="Female">Female / महिला</option>
          </select>
          <select [(ngModel)]="category">
            <option value="General">Focus: General Guidance</option>
            <option value="Career">Career & Job / करियर</option>
            <option value="Wealth">Business & Wealth / धन</option>
            <option value="Marriage">Marriage & Love / विवाह</option>
            <option value="Health">Health & Peace / स्वास्थ्य</option>
            <option value="Vastu">Home & Vastu / वास्तु</option>
          </select>
        </div>
      }

      @if (listening) {
        <div class="listening card">🎤 Listening… speak your question</div>
      }

      <div class="search-bar">
        <input
          [(ngModel)]="question"
          (keyup.enter)="ask()"
          placeholder="Ask about karma, dharma, moksha… or use mic"
        />
        @if (speech.voiceInputSupported) {
          <button type="button" class="btn btn-outline mic" (click)="toggleMic()" [disabled]="loading">
            {{ listening ? '⏹ Stop' : '🎤 Voice' }}
          </button>
        }
        <button type="button" class="btn btn-primary" (click)="ask()" [disabled]="loading">Ask</button>
      </div>

      <div class="chips">
        @for (s of suggestions; track s) {
          <button type="button" class="chip" (click)="question = s; ask()">{{ s }}</button>
        }
      </div>

      @if (error) {
        <p class="error">{{ error }}</p>
      }
      @if (voiceError) {
        <p class="error">{{ voiceError }}</p>
      }

      @if (response) {
        @if (response.aiPowered) {
          <p class="ai-badge">✨ Krishna AI (LLM) — scripture-grounded</p>
        }
        <article class="card answer">
          <div class="answer-head">
            <h3>Answer</h3>
            @if (speech.voiceOutputSupported) {
              <button type="button" class="btn btn-outline listen" (click)="toggleSpeak()">
                {{ speaking ? '⏹ Stop' : '🔊 Listen' }}
              </button>
            }
          </div>
          <p class="answer-text">{{ response.answer }}</p>
        </article>

        @if (response.relatedTopics?.length) {
          <h3>Related topics</h3>
          @for (t of response.relatedTopics; track t.slug) {
            <a [routerLink]="['/gyan/topic', t.slug]" class="card list-item">{{ t.icon }} {{ t.title }}</a>
          }
        }

        @if (response.relatedVerses?.length) {
          <h3>Related verses</h3>
          @for (v of response.relatedVerses; track v.id) {
            <a [routerLink]="['/chapter', v.chapterId]" class="card list-item">
              <p class="sanskrit-sm">{{ v.sanskrit }}</p>
              <p>{{ v.translation }}</p>
            </a>
          }
        }
      }

      @if (history.length) {
        <h3>Recent questions</h3>
        @for (h of history; track h.at) {
          <button type="button" class="card list-item history" (click)="loadHistory(h)">
            <strong>{{ h.question }}</strong>
            <p>{{ h.answer }}</p>
          </button>
        }
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 720px; }
    .auto-speak { display: inline-flex; align-items: center; gap: 0.5rem; margin: 0.75rem 0; font-size: 0.9rem; color: #7a3200; cursor: pointer; }
    .auto-speak input[type="checkbox"] { flex: 0 0 auto; width: 17px; height: 17px; min-width: 0; padding: 0; accent-color: #c45c00; cursor: pointer; }
    .listening { margin: 0.75rem 0; background: #fff3e6; color: #7a3200; font-weight: 600; }
    .search-bar { display: flex; gap: 0.5rem; margin: 1rem 0; flex-wrap: wrap; }
    .search-bar input { flex: 1; min-width: 180px; padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid rgba(196,92,0,0.2); }
    .astro-toggle-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.85rem; }
    .astro-toggle { font-size: 0.85rem; padding: 0.45rem 0.9rem; }
    .astro-panel { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.65rem; margin-bottom: 1rem; padding: 0.9rem; }
    .astro-panel input, .astro-panel select { padding: 0.55rem 0.8rem; border-radius: 10px; border: 1px solid rgba(196,92,0,0.25); font: inherit; font-size: 0.9rem; background: #fff; }
    .mic, .listen { white-space: nowrap; }
    .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
    .chip { border: 1px solid rgba(196,92,0,0.2); background: #fff3e6; border-radius: 999px; padding: 0.4rem 0.85rem; cursor: pointer; font-size: 0.85rem; }
    .answer { border-left: 4px solid #c45c00; }
    .answer-head { display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; }
    .answer-head h3 { margin: 0; }
    .answer-text { white-space: pre-line; margin-bottom: 0; }
    .error { color: #b42318; background: #fef3f2; padding: 0.75rem 1rem; border-radius: 10px; }
    .ai-badge { color: #7a3200; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.5rem; }
    .history { text-align: left; width: 100%; cursor: pointer; border: none; }
    .history p { margin: 0.35rem 0 0; color: #9a7b6a; font-size: 0.85rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `,
})
export class AiGuruComponent implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  readonly speech = inject(SpeechService);

  question = '';
  response: AskResponse | null = null;
  loading = false;
  error: string | null = null;
  voiceError: string | null = null;
  listening = false;
  speaking = false;
  autoSpeak = true;
  history: { question: string; answer: string; at: number }[] = [];

  suggestions = [
    'मेरा मूलांक और भाग्यांक क्या कहते हैं?',
    'करियर और धन के लिए ज्योतिष व गीता सलाह',
    'What does numerology & astrology say for my career?',
    'कर्म योग क्या है?',
  ];
  showAstro = true;
  personName = '';
  birthDate = '';
  birthTime = '';
  birthPlace = '';
  gender = '';
  category = 'General';

  constructor() {
    try {
      const saved = localStorage.getItem('sanatan_ai_history');
      if (saved) this.history = JSON.parse(saved);
      const auto = localStorage.getItem('sanatan_ai_auto_speak');
      if (auto != null) this.autoSpeak = auto !== 'false';
    } catch {
      // ignore
    }
  }

  ngOnDestroy(): void {
    this.speech.stopListening();
    this.speech.stopSpeaking();
  }

  ask(): void {
    const q = this.question.trim();
    if (q.length < 2) return;
    this.loading = true;
    this.error = null;
    this.voiceError = null;
    this.speech.stopSpeaking();
    this.api
      .askGuru(q, this.langService.lang(), {
        personName: this.personName.trim() || undefined,
        birthDate: this.birthDate.trim() || undefined,
        birthTime: this.birthTime.trim() || undefined,
        birthPlace: this.birthPlace.trim() || undefined,
        gender: this.gender || undefined,
        category: this.category || undefined,
      })
      .subscribe({
      next: r => {
        this.response = r;
        this.loading = false;
        this.pushHistory(q, r.answer);
        if (this.autoSpeak) {
          this.speakAnswer(r.answer);
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not get an answer. The server may be waking up — please try again.';
      },
    });
  }

  toggleMic(): void {
    if (this.listening) {
      this.speech.stopListening();
      this.listening = false;
      return;
    }
    this.voiceError = null;
    this.listening = true;
    this.speech.startListening(
      this.langService.lang(),
      text => {
        this.listening = false;
        this.question = text;
        this.ask();
      },
      msg => {
        this.listening = false;
        this.voiceError = msg ?? 'Voice input failed';
      },
    );
  }

  toggleSpeak(): void {
    if (this.speaking) {
      this.speech.stopSpeaking();
      this.speaking = false;
      return;
    }
    if (this.response?.answer) {
      this.speakAnswer(this.response.answer);
    }
  }

  loadHistory(item: { question: string; answer: string }): void {
    this.question = item.question;
    this.response = {
      answer: item.answer,
      relatedScriptures: [],
      relatedChapters: [],
      relatedVerses: [],
      relatedTopics: [],
    };
  }

  private speakAnswer(text: string): void {
    this.speaking = true;
    this.speech.speak(text, this.langService.lang());
    setTimeout(() => {
      this.speaking = this.speech.isSpeaking();
    }, 500);
  }

  private pushHistory(question: string, answer: string): void {
    this.history = [{ question, answer, at: Date.now() }, ...this.history.filter(h => h.question !== question)].slice(0, 8);
    localStorage.setItem('sanatan_ai_history', JSON.stringify(this.history));
    localStorage.setItem('sanatan_ai_auto_speak', this.autoSpeak ? 'true' : 'false');
  }
}
