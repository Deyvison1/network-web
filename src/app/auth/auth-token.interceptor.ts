import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { RouterService } from '../services/router.service';
import { tap } from 'rxjs';
import { NotificationService } from '../services/notification.service';

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
        }
        if (err.status === 403) {
          router.redirectionTo('/forbidden');
        }
        if (err.status === 404 || err.status === 400) {
          notificationService.notificationSimple(err.error.message);
        }
        if (err.status === 500) {
          notificationService.notificationSimple(
            'Aconteceu um erro no servidor. Tente novamente ou contate a equipe técnica.'
          );
        }
      },
    })
  );
};