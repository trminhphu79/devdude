import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortalHeader } from '../shared/uis/layout/portal-header/portal-header';
import { PortalSideBar } from '../shared/uis/layout/portal-side-bar/portal-side-bar';

@Component({
  selector: 'app-portal',
  imports: [RouterModule, PortalHeader, PortalSideBar],
  template: `
    <div
      class="min-h-screen bg-slate-950 font-sans text-slate-50 antialiased selection:bg-indigo-500/30"
    >
      <app-portal-side-bar></app-portal-side-bar>

      <div class="md:ml-64 transition-all duration-300">
        <app-portal-header></app-portal-header>

        <main class="p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
})
export class PortalComponent {}
