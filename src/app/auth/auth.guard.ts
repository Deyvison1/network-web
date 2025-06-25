import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { RouterService } from '../services/router.service';

export const AuthGuard: CanActivateFn = (): boolean => {
  const auth = inject(UserAuthService);
  const router = inject(RouterService);
  const isLogado = auth.isLogado();
  if (isLogado) {
    return true;
  }
  router.redirectionTo('/home');
  return false;
};
