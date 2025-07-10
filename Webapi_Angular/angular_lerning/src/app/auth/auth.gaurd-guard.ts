import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Storage } from '../shared/services/storage';

export const authGaurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const storageSevice = inject(Storage)
  const token = storageSevice.getItem('access_token');
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
