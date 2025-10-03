import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';

import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { MyPreset } from '../mypreset';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { GlobalInterceptor } from './core/interceptors/global-interceptor';
import { MessageService } from 'primeng/api';

registerLocaleData(localeEs, 'es');

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
      },
      translation: {
        dayNames: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
        dayNamesShort: ['dom','lun','mar','mié','jue','vie','sáb'],
        dayNamesMin: ['D','L','M','X','J','V','S'],
        monthNames: [
          'enero','febrero','marzo','abril','mayo','junio',
          'julio','agosto','septiembre','octubre','noviembre','diciembre'
        ],
        monthNamesShort: [
          'enero','febrero','marzo','abril','mayo','junio',
          'julio','agosto','septiembre','octubre','noviembre','diciembre'
        ],
        today: 'Hoy',
        clear: 'Limpiar',
        accept: 'Aceptar',
        reject: 'Cancelar',
      }
    }),
    {
      provide: LOCALE_ID,
      useValue: 'es',
    },
  ]
};

