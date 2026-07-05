import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { DailyShlok, Panchang, Veda } from '../../core/models';

const SECTION_LABELS: Record<string, string> = {
  VEDA: 'चार वेद',
  ITIHASA: 'इतिहास ग्रंथ',
  UPANISHAD: 'उपनिषद',
  PURANA: 'पुराण',
  DARSHAN: 'दर्शन',
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly langService = inject(LanguageService);

  shlok: DailyShlok | null = null;
  panchang: Panchang | null = null;
  grouped: { type: string; label: string; items: Veda[] }[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const lang = this.langService.lang();
    this.api.getDailyShlok(lang).subscribe({
      next: d => (this.shlok = d),
      error: () => {},
    });
    this.api.getPanchang(lang).subscribe({
      next: p => (this.panchang = p),
      error: () => {},
    });
    this.api.getVedas(lang).subscribe({
      next: vedas => {
        const order = ['VEDA', 'ITIHASA', 'UPANISHAD', 'PURANA', 'DARSHAN'];
        this.grouped = order
          .map(type => ({
            type,
            label: SECTION_LABELS[type] ?? type,
            items: vedas.filter(v => (v.scriptureType ?? 'VEDA') === type),
          }))
          .filter(g => g.items.length > 0);
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load scriptures. Check API connection.';
        this.loading = false;
      },
    });
  }
}
