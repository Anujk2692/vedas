import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Quiz, QuizSummary } from '../../core/models';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      <a routerLink="/" class="back">← Home</a>
      <h1>Daily Quiz</h1>
      <p>Short quizzes on Dharma, Karma, and the Gita.</p>

      @if (!quizId) {
        @for (q of quizzes; track q.id) {
          <a [routerLink]="['/quiz', q.id]" class="card list-item">
            <strong>{{ q.title }}</strong>
            <p>{{ q.description }}</p>
            <small>{{ q.questionCount }} questions · {{ q.level }}</small>
          </a>
        }
      } @else if (quiz) {
        @if (done) {
          <article class="card">
            <h2>Quiz complete</h2>
            <p>Score: {{ score }}/{{ quiz.questions.length }}</p>
            <a routerLink="/quiz" class="btn btn-primary">Back to quizzes</a>
          </article>
        } @else {
          <article class="card">
            <small>Question {{ index + 1 }} / {{ quiz.questions.length }}</small>
            <h2>{{ quiz.questions[index].prompt }}</h2>
            @for (opt of quiz.questions[index].options; track $index) {
              <button
                type="button"
                class="option"
                [class.correct]="revealed && $index === quiz.questions[index].correctIndex"
                [class.wrong]="revealed && selected === $index && $index !== quiz.questions[index].correctIndex"
                [disabled]="revealed"
                (click)="choose($index)">
                {{ opt }}
              </button>
            }
            @if (revealed) {
              <p class="explain">{{ quiz.questions[index].explanation }}</p>
              <button type="button" class="btn btn-primary" (click)="next()">
                {{ index + 1 >= quiz.questions.length ? 'Finish' : 'Next' }}
              </button>
            }
          </article>
        }
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: [
    `
      .narrow { max-width: 720px; }
      .list-item { display: block; margin-bottom: 0.75rem; text-decoration: none; color: inherit; }
      .option {
        display: block;
        width: 100%;
        text-align: left;
        margin: 0.4rem 0;
        padding: 0.75rem 1rem;
        border-radius: 10px;
        border: 1px solid #ddd;
        background: #fff;
        cursor: pointer;
      }
      .option.correct { border-color: #2e7d32; background: #e8f5e9; }
      .option.wrong { border-color: #c62828; background: #ffebee; }
      .explain { margin-top: 1rem; color: #555; }
    `,
  ],
})
export class QuizComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);

  quizzes: QuizSummary[] = [];
  quiz: Quiz | null = null;
  quizId: string | null = null;
  index = 0;
  selected: number | null = null;
  score = 0;
  done = false;

  get revealed(): boolean {
    return this.selected !== null;
  }

  ngOnInit(): void {
    const lang = this.langService.lang();
    this.quizId = this.route.snapshot.paramMap.get('id');
    if (!this.quizId) {
      this.api.getQuizzes(lang).subscribe(q => (this.quizzes = q));
      return;
    }
    this.api.getQuiz(this.quizId, lang).subscribe(q => (this.quiz = q));
  }

  choose(i: number): void {
    if (this.revealed || !this.quiz) {
      return;
    }
    this.selected = i;
    if (i === this.quiz.questions[this.index].correctIndex) {
      this.score += 1;
    }
  }

  next(): void {
    if (!this.quiz) {
      return;
    }
    if (this.index + 1 >= this.quiz.questions.length) {
      this.done = true;
      return;
    }
    this.index += 1;
    this.selected = null;
  }
}
