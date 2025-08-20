import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { Storage } from '../shared/services/storage';
import { FingerprintService } from '../shared/services/fingerprint-service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storageSevice = inject(Storage);
  const fingerPrintService = inject(FingerprintService);
  debugger

  if ( req.url.endsWith('/login') || req.url.endsWith('/register') || req.url.endsWith('/refresh')) {
    return next(req);
  }
  const accessToken = storageSevice.getItem('access_token');
  // const fingerprint = storageSevice.getItem('fp');
  // const fingerprint = fingerPrintService.getFingerPrint();

  // return from(fingerPrintService.getFingerPrint()).pipe(
    // switchMap((fingerprint) => {
      debugger
      const authReq = (accessToken)
        ? req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}`} })
        : req;

      return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          debugger
          const isTokenExpired = error.status === 401 && error.headers.get('Token-Expired')?.includes('true');
          if(isTokenExpired){
            const refreshToken = storageSevice.getItem('refresh_token');
            if (!refreshToken) {
              authService.logout();
              return throwError(() => error);
            }

            return authService.refreshToken(refreshToken).pipe(
              switchMap((res: any) => {
                debugger
                storageSevice.setItem('access_token', res.accessToken)
                storageSevice.setItem('refresh_token', res.refreshToken)
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.accessToken}`
                  }
                });

                return next(retryReq);
              }),
              catchError(() => {
                debugger
                authService.logout();
                return throwError(() => error);
              })
            );
          }
          if( error.status === 403){
            debugger
            authService.AccessDenied();
          }
          if (error.status === 401) {
            debugger
            authService.logout();
          }
          return throwError(() => error);
        })
      );
    // })
  // )


};
