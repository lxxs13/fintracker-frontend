import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MyPreset } from '../mypreset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { GlobalInterceptor } from './core/interceptors/global-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([GlobalInterceptor])),
    provideRouter(routes),
    provideNoopAnimations(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: true,
        }
      }
    }),
  ]
};

