import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meditation',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container narrow">
      <h1>🧘 Meditation Timer</h1>
      <p>Daily dhyaan practice — a feature found in top Gita apps like Srimad Gita.</p>
      <div class="timer">{{ display }}</div>
      <div class="presets">
        @for (m of presets; track m) {
          <button type="button" class="chip" [class.active]="minutes === m" (click)="minutes = m">{{ m }} min</button>
        }
      </div>
      <div class="actions">
        @if (!running) {
          <button type="button" class="btn btn-primary" (click)="start()">Start</button>
        } @else {
          <button type="button" class="btn btn-outline" (click)="stop()">Stop</button>
        }
      </div>
      @if (completed) {
        <p class="done">🙏 शांति — meditation complete</p>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 480px; text-align: center; }
    .timer { font-size: 3rem; font-weight: 800; color: #7a3200; margin: 2rem 0; }
    .presets { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-bottom: 1.5rem; }
    .chip { border: 1px solid rgba(196,92,0,0.2); background: #fff3e6; border-radius: 999px; padding: 0.4rem 0.85rem; cursor: pointer; }
    .chip.active { background: #c45c00; color: white; border-color: #c45c00; }
    .done { margin-top: 1.5rem; font-weight: 700; color: #7a3200; }
  `,
})
export class MeditationComponent {
  presets = [5, 10, 15, 20, 30];
  minutes = 10;
  secondsLeft = 0;
  running = false;
  completed = false;
  private timerId: ReturnType<typeof setInterval> | null = null;

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
