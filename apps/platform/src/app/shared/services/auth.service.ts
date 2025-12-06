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

  /**
   * Refresh access token using refresh token from httpOnly cookie
   */
  refreshToken() {
    return this._http.post<TokenPair>(
      `${this._baseUrl}/auth/refresh`,
      {},
      { withCredentials: true } // Include cookies
    );
  }

  /**
   * Admin login with email and password
   */
  login(body: LoginAdminRequest) {
    return this._http.post<LoginAdminResponse>(
      `${this._baseUrl}/auth/admin/login`,
      body,
      { withCredentials: true } // Include cookies for refresh token
    );
  }

  /**
   * Get current authenticated account information
   */
  getCurrentAccount() {
    return this._http.get<LoginAdminResponse['account']>(
      `${this._baseUrl}/auth/me`
    );
  }

  /**
   * Logout and clear refresh token cookie
   */
  logout() {
    return this._http.post(
      `${this._baseUrl}/auth/logout`,
      {},
      { withCredentials: true }
    );
  }
}
