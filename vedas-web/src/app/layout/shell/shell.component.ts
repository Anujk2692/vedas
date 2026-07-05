import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  readonly year = new Date().getFullYear();

  constructor(readonly langService: LanguageService) {}

  setLang(code: string): void {
    this.langService.setLang(code);
    location.reload();
  }
}
