import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export const GlobalInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const reqClone = req.clone({
    url: `${environment.urlBase}${req.url}`,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
  return next(reqClone);
};
