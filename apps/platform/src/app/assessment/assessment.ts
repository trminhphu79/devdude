import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-assessment',
  imports: [RouterOutlet],
  templateUrl: './assessment.html',
  styleUrls: ['./assessment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentComponent {}
