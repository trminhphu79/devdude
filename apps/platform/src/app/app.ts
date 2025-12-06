import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [RouterModule, ReactiveFormsModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected title = 'platform';
  private fb = inject(FormBuilder);
  form = this.fb.group({
    otp: [''],
  });

  onOtpComplete(e: any) {
    console.log(e);
  }
}
