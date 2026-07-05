import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { Veda } from '../../core/models';

@Component({
  selector: 'app-scriptures',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="container">
      <h1>Scriptures</h1>
      @if (loading) { <p>Loading…</p> }
      <div class="grid">
        @for (v of vedas; track v.id) {
          <a [routerLink]="['/scriptures', v.slug]" class="card scripture-card">
            <span class="pill">{{ v.scriptureType ?? 'VEDA' }}</span>
            <h3>{{ v.title }}</h3>
            <p class="sanskrit-sm">{{ v.sanskritName }}</p>
            <p>{{ v.description }}</p>
          </a>
        }
      </div>
    </div>
  `,
})
export class ScripturesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);
  vedas: Veda[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getVedas(this.langService.lang()).subscribe({
      next: v => {
        this.vedas = v;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
