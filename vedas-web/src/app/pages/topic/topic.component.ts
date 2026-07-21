import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Topic } from '../../core/models';

const RECENT_KEY = 'sanatan_recent_v1';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      @if (topic) {
        <a routerLink="/gyan" class="back">← Gyan Hub</a>
        <h1>{{ topic.icon }} {{ topic.title }}</h1>
        <article class="card">
          <h3>Simple</h3>
          <p>{{ topic.simpleExplanation || topic.summary || topic.description }}</p>
        </article>
        <article class="card">
          <h3>Detailed</h3>
          <p>{{ topic.detailedExplanation || topic.description }}</p>
        </article>
        @if (topic.relatedScriptureSlugs?.length) {
          <h3>Related scriptures</h3>
          @for (slug of topic.relatedScriptureSlugs; track slug) {
            <a [routerLink]="['/scriptures', slug]" class="card list-item">{{ slug }} →</a>
          }
        }
      } @else {
        <p>Loading…</p>
      }
    </div>
  `,
  styles: ['.narrow { max-width: 720px; } .list-item { display:block; margin-bottom:0.5rem; }'],
})
export class TopicComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  topic: Topic | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getTopic(slug, this.langService.lang()).subscribe(t => {
      this.topic = t;
      this.pushRecent({
        kind: 'topic',
        id: t.slug,
        title: t.title,
        subtitle: 'Gyan topic',
        viewedAt: Date.now(),
      });
    });
  }

  private pushRecent(item: {
    kind: 'scripture' | 'topic';
    id: string;
    title: string;
    subtitle?: string;
    viewedAt: number;
  }): void {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const list = raw ? (JSON.parse(raw) as typeof item[]) : [];
      const next = [item, ...list.filter(r => !(r.kind === item.kind && r.id === item.id))].slice(0, 5);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }
}
