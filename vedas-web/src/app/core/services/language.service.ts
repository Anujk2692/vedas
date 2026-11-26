import { Injectable, computed, signal } from '@angular/core';

const STORAGE_KEY = 'vedas_web_lang';

const UI_STRINGS = {
  en: {
    nav: {
      home: 'Home',
      scriptures: 'Scriptures',
      gyan: 'Gyan',
      clarity: 'Clarity',
      names: 'Names',
      aarti: 'Aarti',
      search: 'Search',
      aiGuru: 'AI Guru',
      quiz: 'Quiz',
      culture: 'Culture',
      meditate: 'Meditate',
    },
    footer: {
      tagline: '🕉 Sanatan Gyan — Vedas · Gita · Itihasa · Upanishads',
      sub: 'Website & API: vedas-oax2.onrender.com',
    },
    home: {
      eyebrow: 'Namaste',
      title: 'Sacred Scriptures & Sanatan Knowledge',
      lead: 'Read · Listen · Study — Vedas, Gita, Ramayana, Upanishads and more in Hindi & English.',
      exploreScriptures: 'Explore Scriptures',
      lifeClarity: '✨ Life Clarity',
      childNames: '👶 Child Names',
      studyPaths: 'Study Paths',
      dailyQuiz: 'Daily Quiz',
      culture: 'Culture',
      askAiGuru: 'Ask AI Guru',
      loading: 'Loading…',
      loadError: 'Could not load scriptures. Check API connection.',
      clarityBadge: '✨ Jeevan Bodh · Life Clarity',
      clarityPill: 'Practical Vedanta',
      clarityQuote: '“What you seek outside cannot be found without clarity within.”',
      clarityDesc: 'Explore direct, scripture-grounded clarity on Fear, Relationships, Purpose & Overthinking — or ask AI Guru your own question.',
      openClarity: 'Open Life Clarity',
      dailyShlok: 'Shlok of the Day',
      gitaOfDay: 'Gita of the Day',
      openGita: 'Open Gita',
      panchangTitle: 'Today’s Panchang',
      ritual: 'Ritual:',
      continueLearning: 'Continue Learning',
      openStudyPath: 'Open Study Path',
      recentlyViewed: 'Recently Viewed',
      chapters: 'chapters',
      verses: 'verses',
      sections: {
        VEDA: 'Four Vedas',
        ITIHASA: 'Itihasa Epics',
        UPANISHAD: 'Upanishads',
        PURANA: 'Puranas',
        DARSHAN: 'Darshan Philosophy',
        NITI: 'Niti Shastra',
      } as Record<string, string>,
    },
  },
  hi: {
    nav: {
      home: 'होम',
      scriptures: 'ग्रंथ',
      gyan: 'ज्ञान',
      clarity: 'जीवन बोध',
      names: 'नामकरण',
      aarti: 'आरती',
      search: 'खोजें',
      aiGuru: 'AI गुरु',
      quiz: 'क्विज़',
      culture: 'संस्कृति',
      meditate: 'ध्यान',
    },
    footer: {
      tagline: '🕉 सनातन ज्ञान — वेद · गीता · इतिहास · उपनिषद',
      sub: 'वेबसाइट एवं API: vedas-oax2.onrender.com',
    },
    home: {
      eyebrow: 'नमस्ते',
      title: 'पावन ग्रंथ एवं सनातन ज्ञान',
      lead: 'पढ़ें · सुनें · अध्ययन करें — वेद, गीता, रामायण, उपनिषद और अन्य ग्रंथ हिंदी व अंग्रेज़ी में।',
      exploreScriptures: 'ग्रंथ देखें',
      lifeClarity: '✨ जीवन बोध',
      childNames: '👶 नामकरण',
      studyPaths: 'अध्ययन पथ',
      dailyQuiz: 'दैनिक क्विज़',
      culture: 'संस्कृति',
      askAiGuru: 'AI गुरु से पूछें',
      loading: 'लोड हो रहा है…',
      loadError: 'ग्रंथ लोड नहीं हो सके। कृपया API कनेक्शन जांचें।',
      clarityBadge: '✨ जीवन बोध · स्पष्टता',
      clarityPill: 'व्यावहारिक वेदांत',
      clarityQuote: '“जो बाहर खोजा जा रहा है, वह भीतर की स्पष्टता के बिना कभी नहीं मिलता।”',
      clarityDesc: 'भय, संबंध, उद्देश्य और अति-चिंतन पर सीधे, शास्त्र-आधारित उत्तर पढ़ें — या AI गुरु से अपना प्रश्न पूछें।',
      openClarity: 'जीवन बोध खोलें',
      dailyShlok: 'आज का श्लोक',
      gitaOfDay: 'गीता ऑफ़ द डे',
      openGita: 'गीता खोलें',
      panchangTitle: 'आज का पंचांग',
      ritual: 'विधि:',
      continueLearning: 'अध्ययन जारी रखें',
      openStudyPath: 'अध्ययन पथ खोलें',
      recentlyViewed: 'हाल ही में देखा गया',
      chapters: 'अध्याय',
      verses: 'श्लोक',
      sections: {
        VEDA: 'चार वेद',
        ITIHASA: 'इतिहास ग्रंथ',
        UPANISHAD: 'उपनिषद',
        PURANA: 'पुराण',
        DARSHAN: 'दर्शन शास्त्र',
        NITI: 'नीति ग्रंथ',
      } as Record<string, string>,
    },
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal(this.load());
  readonly isHi = computed(() => this.lang() === 'hi');
  readonly ui = computed(() => (this.isHi() ? UI_STRINGS.hi : UI_STRINGS.en));

  setLang(code: string): void {
    this.lang.set(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  private load(): string {
    return localStorage.getItem(STORAGE_KEY) ?? 'hi';
  }
}
