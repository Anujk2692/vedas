import { Component, OnInit, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { DailyShlok, Panchang, StudyPath, Veda } from '../../core/models';

interface RecentItem {
  kind: 'scripture' | 'topic';
  id: string;
  title: string;
  subtitle?: string;
  viewedAt: number;
}

const RECENT_KEY = 'sanatan_recent_v1';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly langService = inject(LanguageService);
  readonly ui = computed(() => this.langService.ui().home);

  shlok: DailyShlok | null = null;
  gitaOfDay: DailyShlok | null = null;
  panchang: Panchang | null = null;
  studyPath: StudyPath | null = null;
  recent: RecentItem[] = [];
  grouped: { type: string; label: string; items: Veda[] }[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const lang = this.langService.lang();
    this.recent = this.loadRecent();
    this.api.getDailyShlok(lang).subscribe({
      next: d => (this.shlok = d),
      error: () => {},
    });
    this.api.getGitaOfDay(lang).subscribe({
      next: d => (this.gitaOfDay = d),
      error: () => {},
    });
    this.api.getPanchang(lang).subscribe({
      next: p => (this.panchang = p),
      error: () => {},
    });
    this.api.getSanatanHub(lang).subscribe({
      next: hub => {
        this.studyPath = hub.studyPaths?.[0] ?? null;
      },
      error: () => {},
    });
    this.api.getVedas(lang).subscribe({
      next: vedas => {
        const order = ['VEDA', 'ITIHASA', 'UPANISHAD', 'PURANA', 'DARSHAN', 'NITI'];
        const sectionLabels = this.ui().sections;
        this.grouped = order
          .map(type => ({
            type,
            label: sectionLabels[type] ?? type,
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

  private loadRecent(): RecentItem[] {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? (JSON.parse(raw) as RecentItem[]).slice(0, 5) : [];
    } catch {
      return [];
    }
  }
}
