import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouterService } from '../services/router.service';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = (): boolean => {
  const auth = inject(AuthService);
  const router = inject(RouterService);
  const isLogado = auth.isLoggedIn();
  if (isLogado) {
    return true;
  }
  router.redirectionTo('/home');
  return false;
};
