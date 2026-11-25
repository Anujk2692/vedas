import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

interface ClarityGuide {
  id: string;
  icon: string;
  category: string;
  titleHi: string;
  titleEn: string;
  questionHi: string;
  questionEn: string;
  clarityHi: string;
  clarityEn: string;
  actionHi: string;
  actionEn: string;
  source: string;
}

const CLARITY_GUIDES: ClarityGuide[] = [
  {
    id: 'fear',
    icon: '🌊',
    category: 'Mind & Fear',
    titleHi: 'भय और अनिश्चितता से मुक्ति',
    titleEn: 'Freedom from Fear & Anxiety',
    questionHi: 'भविष्य की चिंता और असफलता का डर मन को क्यों सताता है?',
    questionEn: 'Why does fear of the future and failure disturb the mind?',
    clarityHi:
      'भय तब पैदा होता है जब मन आज के सत्य के बजाय कल की कल्पना से जुड़ जाता है। गीता के अनुसार आपका अधिकार केवल वर्तमान कर्म की शुद्धता पर है, परिणाम की चिंता पर नहीं।',
    clarityEn:
      'Fear arises when the mind leaves the clarity of present action and clings to imagined outcomes. Your only real domain is the honesty of today’s action.',
    actionHi: 'आज के काम को बिना तुलना किए 100% ध्यान से पूरा करें।',
    actionEn: 'Give 100% attention to one task today without comparing outcomes.',
    source: 'Bhagavad Gita 2.47 · Nishkama Karma',
  },
  {
    id: 'relationships',
    icon: '🤝',
    category: 'Relationships',
    titleHi: 'प्रेम बनाम मोह (Attachment)',
    titleEn: 'Love vs. Attachment',
    questionHi: 'रिश्तों में अपेक्षाएँ और दुख क्यों बढ़ते हैं?',
    questionEn: 'Why do expectations and hurt grow in close relationships?',
    clarityHi:
      'मोह दूसरे को अपनी सुरक्षा का साधन बनाता है, जबकि प्रेम दूसरे की स्वतंत्रता और आत्म-विकास का सम्मान करता है। जब आप भीतर से शांत होते हैं, तो संबंध सहज हो जाते हैं।',
    clarityEn:
      'Attachment uses the other person for emotional security; love honors freedom and growth. Inner steadiness turns relationships from dependency into companionship.',
    actionHi: 'किसी प्रियजन को बदलने की इच्छा छोड़कर आज उन्हें ध्यान से सुनें।',
    actionEn: 'Listen deeply to someone close today without trying to control them.',
    source: 'Brihadaranyaka Upanishad · Maitreyi Samvad',
  },
  {
    id: 'purpose',
    icon: '🧭',
    category: 'Purpose & Career',
    titleHi: 'स्वधर्म और सही जीवन दिशा',
    titleEn: 'Swadharma & Authentic Purpose',
    questionHi: 'भीड़ की दौड़ से अलग अपनी असली दिशा कैसे पहचानें?',
    questionEn: 'How do you recognize your true direction beyond the rat race?',
    clarityHi:
      'दूसरों की नकल से मिली सफलता भी भीतर खालीपन छोड़ती है। स्वधर्म का अर्थ है—वह कार्य जो आपके विवेक, सत्य और करुणा को गहरा करे, न कि केवल अहंकार को।',
    clarityEn:
      'Borrowed ambitions leave you restless even after achievement. Swadharma is work that sharpens your understanding and compassion rather than inflating your ego.',
    actionHi: 'लिखें कि आप कौन-सा काम बिना प्रशंसा की उम्मीद के भी करना चाहेंगे।',
    actionEn: 'Write down one meaningful effort you would pursue even without applause.',
    source: 'Bhagavad Gita 3.35 & 18.47',
  },
  {
    id: 'overthinking',
    icon: '🧠',
    category: 'Ego & Mind',
    titleHi: 'अति-चिंतन और क्रोध का समाधान',
    titleEn: 'Dissolving Overthinking & Anger',
    questionHi: 'मन एक ही विचार में बार-बार क्यों उलझता है?',
    questionEn: 'Why does the mind keep looping on the same thoughts?',
    clarityHi:
      'जब हम विचार के साथ एक हो जाते हैं, तो वह भारी लगता है। जैसे ही आप विचार के साक्षी (Observer) बनते हैं, मन का शोर अपने-आप धीमा पड़ने लगता है।',
    clarityEn:
      'Thoughts feel overwhelming only when you identify with them. Becoming the quiet observer (Sakshi) immediately loosens their grip.',
    actionHi: 'दिन में दो बार 3 मिनट मौन बैठकर केवल आती-जाती साँस और विचारों को देखें।',
    actionEn: 'Sit silently for 3 minutes twice today and simply observe passing thoughts.',
    source: 'Bhagavad Gita 6.26 · Sakshi Bhava',
  },
];

@Component({
  selector: 'app-clarity',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container clarity-page">
      <section class="clarity-hero card">
        <span class="pill">{{ isHi ? 'जीवन बोध · स्पष्टता' : 'LIFE CLARITY · VEDANTIC INSIGHT' }}</span>
        <h1>{{ isHi ? 'संदेह से स्पष्टता की ओर' : 'From Confusion to Clarity' }}</h1>
        <p class="lead">
          {{
            isHi
              ? 'भय, संबंध, करियर और मन के प्रश्नों पर सीधे, व्यावहारिक और शास्त्र-आधारित उत्तर।'
              : 'Direct, practical, scripture-grounded clarity on fear, relationships, purpose, and the mind.'
          }}
        </p>
        <div class="hero-cta">
          <a routerLink="/ai-guru" class="btn btn-primary">
            {{ isHi ? 'AI गुरु से अपना प्रश्न पूछें' : 'Ask AI Guru Your Question' }}
          </a>
          <a routerLink="/scriptures/gita" class="btn btn-ghost">
            {{ isHi ? 'भगवद्गीता पढ़ें' : 'Read Bhagavad Gita' }}
          </a>
        </div>
      </section>

      <div class="filter-bar">
        <button
          type="button"
          class="filter-btn"
          [class.active]="selectedId === 'all'"
          (click)="selectedId = 'all'">
          {{ isHi ? 'सभी विषय' : 'All Topics' }}
        </button>
        @for (item of guides; track item.id) {
          <button
            type="button"
            class="filter-btn"
            [class.active]="selectedId === item.id"
            (click)="selectedId = item.id">
            {{ item.icon }} {{ isHi ? item.titleHi : item.titleEn }}
          </button>
        }
      </div>

      <div class="clarity-grid">
        @for (item of visibleGuides; track item.id) {
          <article class="card clarity-card">
            <div class="card-top">
              <span class="topic-icon">{{ item.icon }}</span>
              <span class="pill">{{ item.category }}</span>
            </div>
            <h2>{{ isHi ? item.titleHi : item.titleEn }}</h2>
            <p class="question">“{{ isHi ? item.questionHi : item.questionEn }}”</p>
            <p class="answer">{{ isHi ? item.clarityHi : item.clarityEn }}</p>
            <div class="practice-box">
              <strong>{{ isHi ? 'आज का अभ्यास:' : 'Today’s Practice:' }}</strong>
              <span>{{ isHi ? item.actionHi : item.actionEn }}</span>
            </div>
            <div class="card-foot">
              <small class="meta">{{ item.source }}</small>
              <a routerLink="/ai-guru" class="ask-link">
                {{ isHi ? 'और गहराई से पूछें →' : 'Explore with AI Guru →' }}
              </a>
            </div>
          </article>
        }
      </div>
    </div>
  `,
  styles: `
    .clarity-page {
      padding: 2rem 0 3rem;
    }
    .clarity-hero {
      background: linear-gradient(135deg, #fff8f0 0%, #fff1df 100%);
      border: 1px solid rgba(196, 92, 0, 0.22);
      margin-bottom: 1.5rem;
    }
    .clarity-hero h1 {
      margin: 0.75rem 0 0.5rem;
      font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    }
    .lead {
      color: #5c4033;
      max-width: 680px;
      margin-bottom: 1.25rem;
    }
    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .btn-primary {
      background: #c45c00;
      color: #fff;
    }
    .btn-ghost {
      background: #fff;
      color: #7a3200;
      border: 1px solid rgba(122, 50, 0, 0.25);
    }
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .filter-btn {
      border: 1px solid rgba(196, 92, 0, 0.2);
      background: #fff;
      color: #5c4033;
      padding: 0.5rem 0.95rem;
      border-radius: 999px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .filter-btn.active {
      background: #7a3200;
      color: #fff;
      border-color: #7a3200;
    }
    .clarity-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .clarity-card {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .topic-icon {
      font-size: 1.6rem;
    }
    .clarity-card h2 {
      margin: 0;
      font-size: 1.2rem;
    }
    .question {
      margin: 0;
      font-weight: 700;
      color: #7a3200;
    }
    .answer {
      margin: 0;
      color: #2c1810;
    }
    .practice-box {
      background: #faf6f0;
      border-left: 3px solid #c45c00;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .card-foot {
      margin-top: auto;
      padding-top: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }
    .ask-link {
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
    }
  `,
})
export class ClarityComponent {
  private readonly langService = inject(LanguageService);
  readonly guides = CLARITY_GUIDES;
  selectedId = 'all';

  get isHi(): boolean {
    return this.langService.lang() === 'hi';
  }

  get visibleGuides(): ClarityGuide[] {
    if (this.selectedId === 'all') {
      return this.guides;
    }
    return this.guides.filter(g => g.id === this.selectedId);
  }
}
