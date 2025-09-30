import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimations } from '@angular/platform-browser/animations';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MyPreset } from '../mypreset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { GlobalInterceptor } from './core/interceptors/global-interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([GlobalInterceptor])),
    provideRouter(routes),
    provideAnimations(),
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

