import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-assessment',
  imports: [RouterModule],
  templateUrl: './assessment.html',
  styleUrls: ['./assessment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssessmentComponent {}
