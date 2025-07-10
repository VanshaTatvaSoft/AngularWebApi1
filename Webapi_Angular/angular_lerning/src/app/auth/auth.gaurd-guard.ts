import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../shared/services/storage';
import { isPlatformBrowser } from '@angular/common';

export const authGaurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageSevice = inject(Storage);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (isBrowser) {
    const token = storageSevice.getItem('access_token');
    if (token) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  }
  return true;
};
