import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { AartiSummary } from '../../core/models';

@Component({
  selector: 'app-aartis',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <h1>🪔 Aarti</h1>
      <div class="grid">
        @for (a of aartis; track a.id) {
          <a [routerLink]="['/aartis', a.slug]" class="card scripture-card">
            <span class="pill">{{ a.deityType }}</span>
            <h3>{{ a.title }}</h3>
            <p class="sanskrit-sm">{{ a.sanskritName }}</p>
            <p>{{ a.description }}</p>
          </a>
        }
      </div>
    </div>
  `,
})
export class AartisComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  aartis: AartiSummary[] = [];

  ngOnInit(): void {
    this.api.getAartis(this.langService.lang()).subscribe(a => (this.aartis = a));
  }
}
