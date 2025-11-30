import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portal-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4">
      <h1>Admin Portal</h1>
      <h2 class="text-xl font-bold">Dashboard</h2>
      <p>Leaderboard and stats will go here.</p>
    </div>
  `,
})
export class DashboardComponent {}
