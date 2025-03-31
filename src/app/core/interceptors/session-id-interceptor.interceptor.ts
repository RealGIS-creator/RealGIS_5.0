import { HttpInterceptorFn } from '@angular/common/http';
import { GetSessionIdParamsService } from '../services/get-session-id-params.service';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';

export const sessionIdInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const idParams = inject(GetSessionIdParamsService);
  const idsession = idParams.sessionId

  if (idsession != null) {
    const tokenService = inject(TokenService);
    const token = tokenService.getToken();
    if (token) {
      console.log('token: ', token)
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
        // { withCredentials: true }
      });
      return next(cloned);
    } else {
      return next(req);
    }
  }
  console.log('pasa por interceptor');
  return next(req);
}; 
