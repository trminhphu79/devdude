import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../shared/uis/layout/header/header';
import { Footer } from '../shared/uis/layout/footer/footer';
import { HeroComponent } from './components/hero.component';
import { FeaturesComponent } from './components/features.component';
import { CommunityComponent } from './components/community.component';
import { FoundersComponent } from './components/founders.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Header,
    Footer,
    HeroComponent,
    FeaturesComponent,
    CommunityComponent,
    FoundersComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
