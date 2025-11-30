import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PortalHeader } from '../shared/uis/layout/portal-header/portal-header';
import { PortalSideBar } from '../shared/uis/layout/portal-side-bar/portal-side-bar';

@Component({
  selector: 'app-portal',
  imports: [RouterModule, PortalHeader, PortalSideBar],
  template: `
    <main>
      <app-portal-header></app-portal-header>
      <app-portal-side-bar></app-portal-side-bar>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class PortalComponent {}
