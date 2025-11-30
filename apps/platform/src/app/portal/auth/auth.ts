import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portal-auth',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold">Login</h2>
      <p>Authentication form will go here.</p>
    </div>
  `,
})
export class AuthComponent {}
