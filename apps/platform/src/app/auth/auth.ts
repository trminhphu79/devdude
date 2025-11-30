import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk/classes';
import { TuiButton, TuiError, TuiTextfield } from '@taiga-ui/core';
import { AuthService } from '../shared/services/auth.service';
import { LoginAdminRequest } from '@devdude/common/types';
import { delay, filter, finalize, map } from 'rxjs';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdminAuthStore } from '../shared/store/admin-auth';
import { UserRole } from '@devdude/common/enums';

@Component({
  selector: 'app-auth',
  imports: [
    ReactiveFormsModule,
    TuiTextfield,
    TuiButton,
    TuiButtonLoading,
    TuiError,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Auth {
  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _adminAuthStore = inject(AdminAuthStore);

  loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  loginErrorMsg = new TuiValidationError('Invalid credentials!');
  isShowError = signal(false);
  isSubmitting = signal(false);

  protected get computedError(): TuiValidationError | null {
    return this.isShowError() ? this.loginErrorMsg : null;
  }

  onSubmit() {
    if (this.loginForm.invalid || this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      this._adminAuthStore.setState({
        accessToken: 'xxxx',
        account: {
          fullName: 'Michael Dude',
          role: UserRole.ADMIN,
          email: this.loginForm.value.email as string,
          id: '1',
        },
      });
      this._router.navigate(['portal']);
    }, 3000);
    // this._authService
    //   .login(this.loginForm.value as LoginAdminRequest)
    //   .pipe(
    //     delay(2500),
    //     finalize(() => this.isSubmitting.set(false))
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.isShowError.set(false);
    //     },
    //     error: () => {
    //       this.isShowError.set(true);
    //     },
    //   });
  }
}
