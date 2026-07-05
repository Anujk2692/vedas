import { Injectable } from '@angular/core';

interface SpeechRecognitionResultEvent {
  results: {
    [index: number]: {
      [index: number]: { transcript?: string };
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private recognition: SpeechRecognitionInstance | null = null;
  private speaking = false;

  get voiceInputSupported(): boolean {
    return typeof window !== 'undefined' && this.getRecognitionCtor() != null;
  }

  get voiceOutputSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  speak(text: string, lang: string): void {
    if (!this.voiceOutputSupported || !text.trim()) {
      return;
    }
    this.stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(this.stripForSpeech(text));
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => {
      this.speaking = false;
    };
    utterance.onerror = () => {
      this.speaking = false;
    };
    this.speaking = true;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.voiceOutputSupported) {
      window.speechSynthesis.cancel();
    }
    this.speaking = false;
  }

  isSpeaking(): boolean {
    return this.speaking || (this.voiceOutputSupported && window.speechSynthesis.speaking);
  }

  startListening(lang: string, onResult: (text: string) => void, onError?: (msg: string) => void): void {
    const Ctor = this.getRecognitionCtor();
    if (!Ctor) {
      onError?.('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    this.stopListening();
    const recognition = new Ctor();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const text = event.results[0]?.[0]?.transcript?.trim();
      if (text) {
        onResult(text);
      }
    };
    recognition.onerror = () => {
      onError?.('Could not recognize speech. Try again or type your question.');
    };
    recognition.onend = () => {
      this.recognition = null;
    };
    this.recognition = recognition;
    recognition.start();
  }

  stopListening(): void {
    this.recognition?.stop();
    this.recognition = null;
  }

  isListening(recognitionRef: SpeechRecognitionInstance | null): boolean {
    return recognitionRef != null;
  }

  private getRecognitionCtor(): SpeechRecognitionCtor | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const w = window as Window & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
  }

  private stripForSpeech(text: string): string {
    return text
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
