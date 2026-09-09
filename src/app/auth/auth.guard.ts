import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouterService } from '../services/router.service';
import { KeycloakService } from '../services/keycloak.service';

export const AuthGuard: CanActivateFn = (): boolean => {
  const auth = inject(KeycloakService);
  const router = inject(RouterService);
  const isLogado = auth.isLoggedIn();
  if (!isLogado) {
    router.redirectionTo('/home');
  }
  return isLogado;
};
