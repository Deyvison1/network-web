import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';

import { inject } from '@angular/core';

import { from } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { RouterService } from '../services/router.service';
import { NotificationService } from '../services/notification.service';
import { ActionTypeNotification } from '../consts/enums/action-type-notification.enum';
import { KeycloakService } from '../services/keycloak.service';

export const AuthTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(RouterService);
  const notificationService = inject(NotificationService);
  const keycloakService = inject(KeycloakService);

  if (!keycloakService.isLoggedIn()) {
    return next(req).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          handleError(err, router, notificationService);
        },
      }),
    );
  }

  return from(keycloakService.getToken()).pipe(
    switchMap((token) => {
      const cloneReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(cloneReq);
    }),

    tap({
      error: (err: HttpErrorResponse) => {
        handleError(err, router, notificationService);
      },
    }),
  );
};

function handleError(
  err: HttpErrorResponse,
  router: RouterService,
  notificationService: NotificationService,
): void {
  if (err.status === 401) {
    router.redirectionTo('/home');
    return;
  }

  if (err.status === 403) {
    router.redirectionTo('/forbidden');
    return;
  }

  if (err.status === 404) {
    notificationService.notification(
      err.error?.message,
      ActionTypeNotification.WARNING,
    );
    return;
  }

  if (err.status === 400) {
    notificationService.notification(
      NotificationService.getError(err),
      ActionTypeNotification.WARNING,
    );
    return;
  }

  if (err.status === 409) {
    notificationService.notification(err.error, ActionTypeNotification.WARNING);
    return;
  }

  if (err.status === 500) {
    notificationService.notification(
      'Aconteceu um erro no servidor. Tente novamente ou contate a equipe técnica.',
      ActionTypeNotification.ERRO,
    );
    return;
  }

  notificationService.notification(
    'Error desconhecido, contate o administrador do sistema.',
    ActionTypeNotification.ERRO,
  );
}
