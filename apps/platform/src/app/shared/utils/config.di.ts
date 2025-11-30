import { InjectionToken } from '@angular/core';

export interface AppConfig {
  baseUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');

export const provideAppConfig = (env: AppConfig) => {
  return {
    provide: APP_CONFIG,
    useValue: env,
  };
};
