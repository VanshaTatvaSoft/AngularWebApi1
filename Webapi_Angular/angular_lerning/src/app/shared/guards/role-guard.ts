import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt-service';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  if (isBrowser){
    const userRole = jwtService.getUserRole();
    const allowedRoles = route.data['roles'] as string[];

    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    return router.parseUrl('/AccessDenied');
  }
  return true;
};
