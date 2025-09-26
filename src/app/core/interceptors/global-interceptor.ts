import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { catchError, finalize, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const GlobalInterceptor: HttpInterceptorFn = (req, next) => {
  const _router = inject(Router)
  const token = localStorage.getItem('token');

  const reqClone = req.clone({
    url: `${environment.urlBase}${req.url}`,
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(reqClone).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        switch (error.status) {
          case HttpStatusCode.Unauthorized:
            _router.navigateByUrl('');
        }
      }

      return throwError(() => error);
    }),
    finalize(() => {})
  );
};
