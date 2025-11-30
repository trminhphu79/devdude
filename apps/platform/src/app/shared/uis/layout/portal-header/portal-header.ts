import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-portal-header',
  imports: [],
  templateUrl: './portal-header.html',
  styleUrl: './portal-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortalHeader {}
