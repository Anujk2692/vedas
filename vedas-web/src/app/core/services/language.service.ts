import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'vedas_web_lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly lang = signal(this.load());

  setLang(code: string): void {
    this.lang.set(code);
    localStorage.setItem(STORAGE_KEY, code);
  }

  private load(): string {
    return localStorage.getItem(STORAGE_KEY) ?? 'hi';
  }
}
