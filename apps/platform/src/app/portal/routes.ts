import { Routes } from '@angular/router';
import { adminAuthGuard } from '../shared/guards/admin-auth.guard';
import { PortalComponent } from './portal';

export const portalRoutes: Routes = [
  {
    path: '',
    component: PortalComponent,
    canMatch: [adminAuthGuard],
    children: [
      {
        path: 'manage',
        loadComponent: () =>
          import('./manage/manage').then((m) => m.ManageComponent),
        loadChildren: () =>
          import('./manage/manage.routes').then((m) => m.manageRoutes),
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./not-found/not-found').then(
            (m) => m.NotFoundPortalComponent
          ),
      },
    ],
  },
];
