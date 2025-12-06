import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { AdminAuthStore } from '../shared/store/admin-auth';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _adminAuthStore = inject(AdminAuthStore);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  togglePasswordVisibility() {
    this.showPassword.update((val) => !val);
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.getRawValue();

    this._authService
      .login({ email, password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this._adminAuthStore.setState({
            accessToken: response.accessToken,
            account: response.account,
          });
          this._router.navigate(['/portal']);
        },
        error: (error) => {
          console.error('Login failed', error);
          this._router.navigate(['/auth']);

          if (error.status === 401) {
            this.errorMessage.set('Invalid email or password.');
          } else {
            this.errorMessage.set(
              'An unexpected error occurred. Please try again.'
            );
          }
        },
      });
  }
}
