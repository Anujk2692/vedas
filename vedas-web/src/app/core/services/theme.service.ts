import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'sepia' | 'dark';

const STORAGE_KEY = 'sanatan_theme_v1';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.loadInitial());

  constructor() {
    this.apply(this.mode());
  }

  setMode(next: ThemeMode): void {
    this.mode.set(next);
    this.apply(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  }

  cycle(): void {
    const order: ThemeMode[] = ['light', 'sepia', 'dark'];
    const idx = order.indexOf(this.mode());
    this.setMode(order[(idx + 1) % order.length]);
  }

  private loadInitial(): ThemeMode {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'sepia' || saved === 'light') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'light';
  }

  private apply(mode: ThemeMode): void {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode);
    }
  }
}
