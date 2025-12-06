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
import { AuthService } from '../shared/services/auth.service';
import { LoginAdminRequest } from '@devdude/common/types';
import { delay, filter, finalize, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AdminAuthStore } from '../shared/store/admin-auth';
import { UserRole } from '@devdude/common/enums';

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
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
}
