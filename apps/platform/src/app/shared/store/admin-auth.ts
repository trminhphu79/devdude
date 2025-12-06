import {
  computed,
  effect,
  inject,
  Injectable,
  signal,
  WritableSignal,
} from '@angular/core';
import { AdminAuthState } from './types';
import { UserRole } from '@devdude/common/enums';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../utils/constants';

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
  private _storage = inject(StorageService);

  private _state: WritableSignal<AdminAuthState> = signal(initialState);

  constructor() {
    const storedToken = this._storage.getItem<string>(
      STORAGE_KEYS.ACCESS_TOKEN
    );
    const storedUser = this._storage.getItem<any>(STORAGE_KEYS.USER_INFO);

    if (storedToken) {
      this._state.set({
        accessToken: storedToken,
        account: storedUser || initialState.account,
      });
    }

    effect(() => {
      const state = this._state();
      if (state.accessToken) {
        this._storage.setItem(STORAGE_KEYS.ACCESS_TOKEN, state.accessToken);
        this._storage.setItem(STORAGE_KEYS.USER_INFO, state.account);
      } else {
        this._storage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        this._storage.removeItem(STORAGE_KEYS.USER_INFO);
      }
    });
  }

  private _isAuthenticated = computed(() => {
    return this._state().accessToken !== '';
  });

  get state() {
    return this._state.asReadonly();
  }

  get isAuthenticated() {
    return this._isAuthenticated;
  }

  setState(state: AdminAuthState) {
    this._state.set(state);
  }

  setAccessToken(accessToken: string) {
    this._state.update((state) => ({ ...state, accessToken }));
  }

  clear() {
    this._state.set(initialState);
  }
}
