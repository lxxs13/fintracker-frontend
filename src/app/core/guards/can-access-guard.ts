import { MessageService } from 'primeng/api';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../../shared/services/common';

export const canAccessGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const commonService = inject(CommonService);

  const token = localStorage.getItem('token');

  if (!token) {
    commonService.showMessage('Datos de sesión invalidos', 'No ha sido posible validar la activiad del usuario. Inicia sesión nuevamente, por favor.', 'ERROR')
    router.navigateByUrl('');
    return false;
  }

  if (commonService.tokenExpired(token)) {
    commonService.showMessage('Sesión expirada', 'Su sesión ha expirado. Inicie sesión nuevamente, por favor.', 'ERROR')
    router.navigateByUrl('');
  }

  return true;
};
