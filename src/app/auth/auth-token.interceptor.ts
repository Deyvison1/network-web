import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RouterService } from '../services/router.service';
import { tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(RouterService);
  const notificationService = inject(NotificationService);

  if (localStorage.getItem('token') !== null) {
    const cloneReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('token')}`
      ),
    });
    return next(cloneReq).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            router.redirectionTo('/home');
          }
          if (err.status === 403) {
            router.redirectionTo('/forbidden');
          }
          if (err.status === 404) {
            notificationService.notificationSimple(err.error.message);
          }
          if (err.status === 400) {
            notificationService.notificationSimple(err.error.message);
          }
          if (err.status === 500) {
            notificationService.notificationSimple(
              'Aconteceu um error no servidor. Tente novamente ou contate a equipe tecnica.'
            );
          }
        },
      })
    );
  } else {
    return next(req.clone());
  }
};
