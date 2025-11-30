import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assessment-overview',
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <h2 class="text-xl font-bold">Your Progress</h2>
      <div class="p-4 border rounded bg-gray-50">
        <p class="text-center text-gray-500">
          [Chart Placeholder: Attempts per Topic]
        </p>
      </div>

      <h3 class="text-lg font-semibold">Pick a Topic to Start Quiz</h3>
      <div class="flex gap-4">
        <button
          routerLink="quiz"
          [queryParams]="{ topic: 'angular' }"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          FE - Angular
        </button>
        <button
          routerLink="quiz"
          [queryParams]="{ topic: 'react' }"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          FE - ReactJS
        </button>
        <button
          routerLink="quiz"
          [queryParams]="{ topic: 'flutter' }"
          class="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition"
        >
          Mobile - Flutter
        </button>
      </div>
    </div>
  `,
})
export class OverviewComponent {}
