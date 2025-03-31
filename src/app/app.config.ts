import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { sessionIdInterceptorInterceptor } from './core/interceptors/session-id-interceptor.interceptor';
import { initializeToken } from './core/funcions/inicialize-token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([sessionIdInterceptorInterceptor])),
    provideAppInitializer(initializeToken)
  ]
};
