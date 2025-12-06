import { Routes } from '@angular/router';
import { ManageComponent } from './manage';

export const manageRoutes: Routes = [
  {
    path: '',
    component: ManageComponent,
    children: [
      {
        path: 'topic',
        loadComponent: () =>
          import('./topic/topic-list').then((m) => m.ManageTopicListComponent),
      },
      {
        path: 'topic/new',
        loadComponent: () =>
          import('./topic/topic-form').then((m) => m.ManageTopicFormComponent),
      },
      {
        path: 'topic/:id',
        loadComponent: () =>
          import('./topic/topic-form').then((m) => m.ManageTopicFormComponent),
      },
      {
        path: 'category',
        loadComponent: () =>
          import('./category/category-list').then(
            (m) => m.ManageCategoryListComponent
          ),
      },
      {
        path: 'category/new',
        loadComponent: () =>
          import('./category/category-form').then(
            (m) => m.ManageCategoryFormComponent
          ),
      },
      {
        path: 'category/:id',
        loadComponent: () =>
          import('./category/category-form').then(
            (m) => m.ManageCategoryFormComponent
          ),
      },
      {
        path: 'question',
        loadComponent: () =>
          import('./question/question-list').then(
            (m) => m.ManageQuestionListComponent
          ),
      },
      {
        path: 'question/new',
        loadComponent: () =>
          import('./question/question-form').then(
            (m) => m.ManageQuestionFormComponent
          ),
      },
      {
        path: 'question/:id',
        loadComponent: () =>
          import('./question/question-form').then(
            (m) => m.ManageQuestionFormComponent
          ),
      },
      {
        path: '',
        redirectTo: 'topic',
        pathMatch: 'full',
      },
    ],
  },
];
