import { ApplicationConfig, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { sessionIdInterceptorInterceptor } from './core/interceptors/session-id-interceptor.interceptor';
import { initializeToken } from './core/funcions/inicialize-token';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    // provideHttpClient(withInterceptors([sessionIdInterceptorInterceptor, httpErrorInterceptor])), //produccion
    provideHttpClient(), //prueba
    // provideAppInitializer(initializeToken) //produccion
  ]
};
