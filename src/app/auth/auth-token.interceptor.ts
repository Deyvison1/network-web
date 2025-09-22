import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RouterService } from '../services/router.service';
import { tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { ActionTypeNotification } from '../consts/enums/action-type-notification.enum';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(RouterService);
  const notificationService = inject(NotificationService);

  // Começa com o header que sempre vai
  let headers = req.headers.set(
    'X-Internal-Token',
    'c523db8c7dafcaf567a28d7d910f985ffdfff52d2e5850f18062f8c82e338e6b'
  );

  // Adiciona Authorization se tiver token
  const token = localStorage.getItem('token');
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // Clona a requisição com os headers montados
  const cloneReq = req.clone({ headers });

  // Retorna a requisição com o tratamento de erro
  return next(cloneReq).pipe(
    tap({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          router.redirectionTo('/home');
          localStorage.removeItem('token');
        } else if (err.status === 403) {
          router.redirectionTo('/forbidden');
        } else if (err.status === 404) {
          notificationService.notification(
            err.error.message,
            ActionTypeNotification.WARNING
          );
        } else if (err.status === 400) {
          notificationService.notification(
            NotificationService.getError(err),
            ActionTypeNotification.WARNING
          );
        } else if (err.status === 500) {
          notificationService.notification(
            'Aconteceu um erro no servidor. Tente novamente ou contate a equipe técnica.',
            ActionTypeNotification.ERRO
          );
        } else if (err.status === 409) {
          notificationService.notification(
            err.error,
            ActionTypeNotification.WARNING
          );
        } else {
          notificationService.notification(
            'Error desconhecido, contate o administrador do sistema.',
            ActionTypeNotification.ERRO
          );
        }
      },
    })
  );
};
