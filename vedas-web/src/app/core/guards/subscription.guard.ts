import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { SubscriptionService } from '../services/subscription.service';

export const subscriptionGuard: CanActivateFn = (_route, state) => {
  const sub = inject(SubscriptionService);
  const router = inject(Router);
  return sub.checkAccess().pipe(
    map(active =>
      active
        ? true
        : router.createUrlTree(['/subscription'], {
            queryParams: { locked: '1', redirect: state.url },
          }),
    ),
  );
};
