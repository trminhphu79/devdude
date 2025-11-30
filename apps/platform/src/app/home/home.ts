import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../shared/uis/layout/header/header';
import { Footer } from '../shared/uis/layout/footer/footer';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
