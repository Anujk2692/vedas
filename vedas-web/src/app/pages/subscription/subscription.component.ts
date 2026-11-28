import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LanguageService } from '../../core/services/language.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SubscriptionPlan, SubscriptionStatus } from '../../core/models';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="container narrow">
      <h1>{{ isHi ? '👑 सनातन प्लस — एक सदस्यता, संपूर्ण ऐप' : '👑 Sanatan Plus — One Subscription for Everything' }}</h1>
      <p class="sub">
        {{
          isHi
            ? 'एक ही सदस्यता से Web, iOS और Android पर AI गुरु ज्योतिष/अंक ज्योतिष, सभी 48 आरती, 47 चालीसा, 59 भजन, 24 योग आसन और नामकरण अनलॉक करें।'
            : 'One unified subscription unlocks AI Guru Jyotish/Numerology, all 48 Aartis, 47 Chalisas, 59 Bhajans, 24 Yoga Asanas & Child Names across Web, iOS, and Android.'
        }}
      </p>

      <div class="card account-card">
        <label class="lbl">{{ isHi ? 'साझा खाता (Email या Phone — सभी डिवाइस सिंक हेतु)' : 'Shared Account Key (Email or Phone — syncs across Web, iOS & Android)' }}</label>
        <div class="row">
          <input [(ngModel)]="accountKey" placeholder="you@example.com or +9198..." />
          <button type="button" class="btn btn-outline" (click)="loadStatus()" [disabled]="loading">
            {{ isHi ? 'जांचें / Restore' : 'Check / Restore' }}
          </button>
          <button type="button" class="btn btn-outline" (click)="sendOtp()" [disabled]="loading">
            {{ isHi ? '🔐 OTP भेजें' : '🔐 Send OTP' }}
          </button>
        </div>
        @if (otpSent) {
          <div class="row" style="margin-top: 0.6rem;">
            <input [(ngModel)]="otpCode" placeholder="Enter 6-digit OTP" />
            <button type="button" class="btn btn-primary" (click)="verifyOtpCode()" [disabled]="loading">
              {{ isHi ? 'OTP सत्यापित करें' : 'Verify OTP' }}
            </button>
          </div>
          @if (otpMessage) {
            <p class="meta" style="margin-top: 0.35rem;">{{ otpMessage }}</p>
          }
        }
        @if (otpVerified) {
          <p class="meta" style="color: #166534; font-weight: 700; margin-top: 0.35rem;">✅ Account verified via OTP</p>
        }
      </div>

      @if (lockedRedirect && !status?.active) {
        <div class="lock-banner">
          <strong>🔒 {{ isHi ? 'प्रीमियम सुविधा लॉक है' : 'Subscription Required' }}</strong>
          <span>
            {{
              isHi
                ? 'AI गुरु (कुंडली/अंक ज्योतिष), 48 आरती, 47 चालीसा, 59 भजन, 24 योग आसन, नामकरण और ऑफ़लाइन कैश अनलॉक करने के लिए सनातन प्लस लें।'
                : 'Subscribe to Sanatan Plus to unlock Unlimited AI Guru, 48 Aartis, 47 Chalisas, 59 Bhajans, 24 Yoga Asanas + Videos, Child Name Studio & Offline Cache.'
            }}
          </span>
        </div>
      }

      @if (error) {
        <p class="error">{{ error }}</p>
      }

      @if (status) {
        <div class="card status-card" [class.active]="status.active">
          <div class="status-top">
            <span class="badge" [class.on]="status.active">
              {{ status.active ? (isHi ? '✅ सक्रिय (ACTIVE)' : '✅ ACTIVE') : (isHi ? 'मुफ़्त प्लान (FREE)' : 'FREE PLAN') }}
            </span>
            @if (status.sandboxMode) {
              <span class="dev-pill">🧪 Developer Sandbox</span>
            }
          </div>
          <h3>{{ status.planCode }} · {{ status.provider }}</h3>
          @if (status.expiresAt) {
            <p class="meta">{{ isHi ? 'वैधता:' : 'Valid until:' }} {{ status.expiresAt.slice(0, 10) }}</p>
          }
          @if (status.active && redirectUrl) {
            <button type="button" class="btn btn-primary" style="margin-right: 0.5rem;" (click)="continueToRedirect()">
              {{ isHi ? 'अनलॉक सुविधा खोलें →' : 'Continue to Unlocked Feature →' }}
            </button>
          }
          @if (status.active) {
            <button type="button" class="btn btn-outline" (click)="cancel()" [disabled]="loading">
              {{ isHi ? 'सदस्यता रद्द / रीसेट करें' : 'Cancel / Reset to Free' }}
            </button>
          }
        </div>

        @if (status.devTestingEnabled) {
          <div class="dev-banner">
            <strong>🧪 {{ isHi ? 'डेवलपर टेस्टिंग मोड चालू है' : 'Developer Testing Mode Enabled' }}</strong>
            <span>{{ isHi ? 'आप बिना भुगतान तुरंत किसी भी प्लान को टेस्ट कर सकते हैं।' : 'Test any plan instantly without real payment; disable via VEDAS_SUBSCRIPTION_DEV_TESTING_ENABLED=false in production.' }}</span>
          </div>
        }

        <div class="plans-grid">
          @for (p of status.plans; track p.code) {
            <article class="card plan-card" [class.featured]="p.code === 'YEARLY'">
              <span class="plan-code">{{ p.code }}</span>
              <h3>{{ isHi ? p.titleHi : p.titleEn }}</h3>
              <p class="price">{{ p.priceDisplay }}</p>
              <p class="note">{{ isHi ? p.billingNoteHi : p.billingNoteEn }}</p>
              <div class="plan-actions">
                @if (status.devTestingEnabled) {
                  <button type="button" class="btn btn-primary" (click)="activate(p, true)" [disabled]="loading">
                    {{ isHi ? '🧪 टेस्ट सक्रिय करें' : '🧪 Activate (Dev Test)' }}
                  </button>
                }
                <button type="button" class="btn btn-outline" (click)="payWithRazorpay(p)" [disabled]="loading">
                  {{ isHi ? '💳 Razorpay से भुगतान करें (UPI / Card)' : '💳 Pay via Razorpay (UPI / Card)' }}
                </button>
              </div>
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .narrow { max-width: 820px; }
    .sub { color: #6e4e37; margin-bottom: 1.25rem; }
    .account-card { margin-bottom: 1rem; }
    .lbl { display: block; font-size: 0.85rem; font-weight: 700; color: #7a3200; margin-bottom: 0.5rem; }
    .row { display: flex; gap: 0.65rem; flex-wrap: wrap; }
    .row input { flex: 1; min-width: 220px; padding: 0.65rem 0.9rem; border-radius: 10px; border: 1px solid rgba(196,92,0,0.25); font: inherit; }
    .status-card { margin-bottom: 1rem; border-left: 4px solid #9a7b6a; }
    .status-card.active { border-left-color: #2e7d32; background: #f3fbf4; }
    .status-top { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem; }
    .badge { font-size: 0.78rem; font-weight: 800; padding: 0.2rem 0.65rem; border-radius: 999px; background: #eee; color: #444; }
    .badge.on { background: #dcfce7; color: #166534; }
    .dev-pill { font-size: 0.78rem; font-weight: 700; padding: 0.2rem 0.65rem; border-radius: 999px; background: #fef3c7; color: #92400e; }
    .meta { color: #5c4033; font-size: 0.9rem; margin: 0.25rem 0 0.75rem; }
    .dev-banner { background: #fffbeb; border: 1px solid #f59e0b; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem; color: #78350f; font-size: 0.9rem; }
    .lock-banner { background: #fff1f2; border: 1px solid #fda4af; border-radius: 12px; padding: 0.85rem 1rem; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.25rem; color: #9f1239; font-size: 0.9rem; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1rem; }
    .plan-card { display: flex; flex-direction: column; gap: 0.5rem; }
    .plan-card.featured { border: 2px solid #c45c00; }
    .plan-code { font-size: 0.75rem; font-weight: 800; color: #c45c00; }
    .price { font-size: 1.45rem; font-weight: 800; color: #7a3200; margin: 0; }
    .note { font-size: 0.88rem; color: #5c4033; flex: 1; }
    .plan-actions { display: flex; flex-direction: column; gap: 0.45rem; margin-top: 0.5rem; }
    .error { color: #b42318; background: #fef3f2; padding: 0.75rem 1rem; border-radius: 10px; }
  `,
})
export class SubscriptionComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly lang = inject(LanguageService);
  private readonly subService = inject(SubscriptionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  accountKey = '';
  status: SubscriptionStatus | null = null;
  loading = false;
  error = '';
  lockedRedirect = false;
  redirectUrl = '';
  otpSent = false;
  otpCode = '';
  otpMessage = '';
  otpVerified = false;

  get isHi(): boolean {
    return this.lang.lang() === 'hi' || this.lang.lang() === 'sa';
  }

  ngOnInit(): void {
    this.accountKey = this.subService.getAccountKey();
    this.route.queryParamMap.subscribe(params => {
      this.lockedRedirect = params.get('locked') === '1';
      this.redirectUrl = params.get('redirect') || '';
    });
    this.loadStatus();
  }

  continueToRedirect(): void {
    if (this.redirectUrl) {
      this.router.navigateByUrl(this.redirectUrl);
    }
  }

  sendOtp(): void {
    const key = this.accountKey.trim();
    if (!key) return;
    this.api.requestOtp(key).subscribe({
      next: res => {
        this.otpSent = true;
        this.otpMessage = res.devOtpPreview ? `${res.message} (Test OTP: ${res.devOtpPreview})` : res.message;
      },
      error: () => { this.error = 'Failed to send OTP.'; },
    });
  }

  verifyOtpCode(): void {
    const key = this.accountKey.trim();
    if (!key || !this.otpCode.trim()) return;
    this.api.verifyOtp(key, this.otpCode.trim()).subscribe({
      next: res => {
        this.otpVerified = res.verified;
        this.otpSent = false;
        this.loadStatus();
      },
      error: err => { this.error = err?.error?.message || 'Invalid OTP.'; },
    });
  }

  loadStatus(): void {
    const key = this.accountKey.trim();
    if (!key) return;
    this.loading = true;
    this.error = '';
    this.subService.refreshStatus(key).subscribe({
      next: s => {
        this.status = s;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load subscription status.';
      },
    });
  }

  activate(plan: SubscriptionPlan, sandbox: boolean): void {
    const key = this.accountKey.trim();
    if (!key) return;
    const txId = sandbox ? `DEV-${plan.code}-${Date.now()}` : `WEB-LIVE-${plan.code}-${Date.now()}`;
    this.loading = true;
    this.error = '';
    this.api
      .activateSubscription({
        accountKey: key,
        planCode: plan.code,
        provider: sandbox ? 'DEV_SANDBOX' : 'RAZORPAY',
        transactionId: txId,
        sandbox,
      })
      .subscribe({
        next: s => {
          this.status = s;
          this.subService.setStatus(s);
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          this.error = err?.error?.message || 'Activation failed.';
        },
      });
  }

  payWithRazorpay(plan: SubscriptionPlan): void {
    const key = this.accountKey.trim();
    if (!key) return;
    if (this.status && this.status.razorpayConfigured === false) {
      this.error = this.isHi
        ? 'Razorpay अभी सर्वर पर कॉन्फ़िगर नहीं है (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET सेट करें), या ऊपर Dev Test बटन से टेस्ट करें।'
        : 'Razorpay is not configured on the server yet (set RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET), or use Dev Test above.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.api.createRazorpayOrder(key, plan.code).subscribe({
      next: async order => {
        try {
          const RazorpayCtor = await this.loadRazorpayCheckout();
          const isEmail = key.includes('@');
          const rzp = new RazorpayCtor({
            key: order.keyId,
            amount: order.amountPaise,
            currency: order.currency,
            name: 'Sanatan Gyan',
            description: order.planName,
            order_id: order.orderId,
            prefill: isEmail ? { email: key } : { contact: key },
            theme: { color: '#c45c00' },
            handler: (resp: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              this.api
                .verifyRazorpayPayment({
                  accountKey: key,
                  planCode: plan.code,
                  razorpayOrderId: resp.razorpay_order_id,
                  razorpayPaymentId: resp.razorpay_payment_id,
                  razorpaySignature: resp.razorpay_signature,
                })
                .subscribe({
                  next: s => {
                    this.status = s;
                    this.subService.setStatus(s);
                    this.loading = false;
                  },
                  error: err => {
                    this.loading = false;
                    this.error = err?.error?.message || 'Payment verification failed.';
                  },
                });
            },
            modal: {
              ondismiss: () => {
                this.loading = false;
              },
            },
          });
          if (typeof rzp.on === 'function') {
            rzp.on('payment.failed', (resp: { error?: { description?: string } }) => {
              this.loading = false;
              this.error = resp?.error?.description || 'Razorpay payment failed.';
            });
          }
          rzp.open();
        } catch (err) {
          this.loading = false;
          this.error = err instanceof Error ? err.message : 'Unable to open Razorpay Checkout.';
        }
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Could not create Razorpay order.';
      },
    });
  }

  private loadRazorpayCheckout(): Promise<any> {
    const win = window as any;
    if (win.Razorpay) {
      return Promise.resolve(win.Razorpay);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        if (win.Razorpay) {
          resolve(win.Razorpay);
        } else {
          reject(new Error('Razorpay SDK failed to initialize.'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay Checkout script.'));
      document.body.appendChild(script);
    });
  }

  cancel(): void {
    const key = this.accountKey.trim();
    if (!key) return;
    this.loading = true;
    this.api.cancelSubscription(key).subscribe({
      next: s => {
        this.status = s;
        this.subService.setStatus(s);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not cancel subscription.';
      },
    });
  }
}
