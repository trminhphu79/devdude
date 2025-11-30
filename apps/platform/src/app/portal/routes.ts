import { Routes } from '@angular/router';
import { adminAuthGuard } from '../shared/guards/admin-auth.guard';

export const portalRoutes: Routes = [
  {
    path: 'manage',
    canMatch: [adminAuthGuard],
    loadComponent: () =>
      import('./manage/manage').then((m) => m.ManageComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    canMatch: [adminAuthGuard],
    loadComponent: () =>
      import('./dashboard/dashboard').then((m) => m.DashboardComponent),
  },
];
