import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if ( req.url.endsWith('/login') || req.url.endsWith('/register') || req.url.endsWith('/refresh')) {
    return next(req);
  }

  const accessToken = localStorage.getItem('access_token');

  const authReq = accessToken
    ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401){
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          authService.logout();
          return throwError(() => error);
        }

        return authService.refreshToken(refreshToken).pipe(
          switchMap((res: any) => {
            localStorage.setItem('access_token', res.accessToken);
            localStorage.setItem('refresh_token', res.refreshToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
