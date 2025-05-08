import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { GlobalUserParamService } from '../services/global-user-param.service';


export const sessionIdGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const globalParams = inject(GlobalUserParamService);

  const id = route.queryParamMap.get('id');
  // const user = route.queryParamMap.get('usuario');
  const user = 'admin';

  if (id && user) {
    globalParams.setParams({ user });
    return true;
  } else {
    return router.createUrlTree(['/error']);
  }
};
