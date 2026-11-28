import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { SubscriptionStatus } from '../models';
import { ApiService } from './api.service';

export const SUBSCRIPTION_ACCOUNT_KEY_STORAGE = 'sanatan_sub_account_key';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  private readonly api = inject(ApiService);

  readonly status = signal<SubscriptionStatus | null>(null);
  readonly isSubscribed = computed(() => this.status()?.active === true);

  getAccountKey(): string {
    try {
      return localStorage.getItem(SUBSCRIPTION_ACCOUNT_KEY_STORAGE)?.trim() || 'demo@sanatangyan.app';
    } catch {
      return 'demo@sanatangyan.app';
    }
  }

  saveAccountKey(key: string): void {
    try {
      localStorage.setItem(SUBSCRIPTION_ACCOUNT_KEY_STORAGE, key.trim());
    } catch {
      // ignore storage errors
    }
  }

  setStatus(next: SubscriptionStatus): void {
    this.status.set(next);
  }

  refreshStatus(rawKey?: string): Observable<SubscriptionStatus> {
    const key = (rawKey ?? this.getAccountKey()).trim() || 'demo@sanatangyan.app';
    this.saveAccountKey(key);
    return this.api.getSubscriptionStatus(key).pipe(tap(res => this.status.set(res)));
  }

  checkAccess(): Observable<boolean> {
    const key = this.getAccountKey();
    const current = this.status();
    if (current && current.accountKey.toLowerCase() === key.toLowerCase()) {
      return of(current.active);
    }
    return this.refreshStatus(key).pipe(
      map(res => res.active),
      catchError(() => of(false)),
    );
  }
}
