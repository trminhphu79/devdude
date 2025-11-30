import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, retry, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    req = addToken(req, token);
  }

  return next(req).pipe(
    catchError((error) => {
      if (isAuthorizationError(error)) {
        return handle403Error(req, next, authService, router);
      }
      return throwError(() => error);
    })
  );
};

const isAuthorizationError = (error: HttpErrorResponse) => {
  return (
    (error instanceof HttpErrorResponse && error.status === 401) ||
    error.status === 403
  );
};
const addToken = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const handle403Error = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      retry(3),
      switchMap((response: any) => {
        isRefreshing = false;
        const newToken = response.accessToken;
        if (newToken) {
          localStorage.setItem('token', newToken);
          refreshTokenSubject.next(newToken);
          return next(addToken(req, newToken));
        }
        return throwError(() => new Error('No token in refresh response'));
      }),
      catchError((err) => {
        isRefreshing = false;
        localStorage.removeItem('token');
        router.navigate(['/portal/auth']);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((token) => {
        return next(addToken(req, token!));
      })
    );
  }
};
