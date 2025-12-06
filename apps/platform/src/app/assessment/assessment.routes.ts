import { Routes } from '@angular/router';
import { AppLayout } from '../shared/uis/layout/layout';

export const assessmentRoutes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./overview/overview').then((m) => m.OverviewComponent),
      },
      {
        path: 'quiz',
        loadComponent: () => import('./quiz/quiz').then((m) => m.QuizComponent),
      },
      {
        path: 'result',
        loadComponent: () =>
          import('./result/result').then((m) => m.ResultComponent),
      },
    ],
  },
];
