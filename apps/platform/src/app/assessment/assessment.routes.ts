import { Routes } from '@angular/router';

export const assessmentRoutes: Routes = [
  {
    path: 'assessment',
    loadComponent: () =>
      import('./assessment').then((m) => m.AssessmentComponent),
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
