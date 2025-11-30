import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portal-manage',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold">Manage Content</h2>
      <p>Manage categories, topics, and questions here.</p>
    </div>
  `,
})
export class ManageComponent {}
