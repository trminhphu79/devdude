import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminAuthStore } from '../store/admin-auth';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const adminAuthStore = inject(AdminAuthStore);
  if (!adminAuthStore.isAuthenticated()) {
    return router.createUrlTree(['/auth']);
  }
  return true;
};
