import { linkedSignal, signal, WritableSignal } from '@angular/core';
import { Injectable } from '@angular/core';
import { AdminAuthState } from './types';
import { UserRole } from '@devdude/common/enums';

const initialState: AdminAuthState = {
  accessToken: '',
  account: {
    id: '',
    email: '',
    fullName: '',
    role: UserRole.ADMIN,
  },
};

@Injectable({ providedIn: 'root' })
export class AdminAuthStore {
  private _state: WritableSignal<AdminAuthState> = signal(initialState);

  private _isAuthenticated: WritableSignal<boolean> = linkedSignal(() => {
    return this._state().accessToken !== '';
  });

  get state() {
    return this._state.asReadonly();
  }

  get isAuthenticated() {
    return this._isAuthenticated.asReadonly();
  }

  setState(state: AdminAuthState) {
    this._state.set(state);
  }

  clear() {
    this._state.set(initialState);
  }
}
