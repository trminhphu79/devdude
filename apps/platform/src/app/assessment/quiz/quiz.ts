import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold">Quiz Session</h2>
      <p>Quiz content will go here.</p>
    </div>
  `,
})
export class QuizComponent {}
