import { Route } from '@angular/router';
import { Home } from './home/home';
import { AdminAuthStore } from './shared/store/admin-auth';
import { adminAuthGuard } from './shared/guards/admin-auth.guard';
import { NotFound } from './not-found/not-found';

export const appRoutes: Route[] = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'assessment',
    loadChildren: () =>
      import('./assessment/assessment.routes').then((m) => m.assessmentRoutes),
  },
  {
    path: 'portal',
    loadChildren: () => import('./portal/routes').then((m) => m.portalRoutes),
  },
  {
    path: 'auth',
    pathMatch: 'full',
    loadComponent: () => import('./auth/auth').then((m) => m.Auth),
  },
  {
    path: '**',
    component: NotFound,
  },
];
