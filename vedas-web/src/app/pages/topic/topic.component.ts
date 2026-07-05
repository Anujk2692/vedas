import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Topic } from '../../core/models';

@Component({
  selector: 'app-topic',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container narrow">
      @if (topic) {
        <a routerLink="/gyan" class="back">← Gyan Hub</a>
        <h1>{{ topic.icon }} {{ topic.title }}</h1>
        <p>{{ topic.description }}</p>
        <article class="card"><p>{{ topic.summary }}</p></article>
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
  styles: ['.narrow { max-width: 720px; }'],
})
export class TopicComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  topic: Topic | null = null;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getTopic(slug, this.langService.lang()).subscribe(t => (this.topic = t));
  }
}
