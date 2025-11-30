import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  LoginAdminRequest,
  LoginAdminResponse,
  TokenPair,
} from '@devdude/common/types';
import { APP_CONFIG } from '../utils/config.di';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _http = inject(HttpClient);
  private readonly _appConfig = inject(APP_CONFIG);
  private readonly _baseUrl = this._appConfig.baseUrl;

  refreshToken() {
    return this._http.post<TokenPair>(
      `${this._baseUrl}/auth/refresh-token`,
      {}
    );
  }

  login(body: LoginAdminRequest) {
    return this._http.post<LoginAdminResponse>(
      `${this._baseUrl}/auth/login`,
      body
    );
  }
}
