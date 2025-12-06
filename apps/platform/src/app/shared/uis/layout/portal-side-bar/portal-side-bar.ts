import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-portal-side-bar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './portal-side-bar.html',
  styleUrl: './portal-side-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalSideBar {}
