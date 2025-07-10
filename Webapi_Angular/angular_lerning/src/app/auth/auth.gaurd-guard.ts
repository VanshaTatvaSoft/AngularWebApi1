import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../shared/services/storage';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';
import { JwtService } from '../shared/services/jwt-service';

export const authGaurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageSevice = inject(Storage);
  const auth = inject(AuthService);
  const jwtService = inject(JwtService);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (isBrowser) {
    let userName: string | null = "";
    const token = storageSevice.getItem('access_token');
    if (token) {
      userName = jwtService.getUserName();
      auth.setUserName(userName);
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }
  return true;
};
