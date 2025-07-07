import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/auth/auth-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient((
      withInterceptors([authInterceptor])
    )),
    provideRouter(routes)
  ]
});