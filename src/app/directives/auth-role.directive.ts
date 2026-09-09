import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

import { KeycloakService } from '../services/keycloak.service';

@Directive({
  selector: '[appAuthRole]',
  standalone: true,
})
export class AuthRoleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly keycloakService = inject(KeycloakService);

  readonly appAuthRole = input<string[]>();

  ngOnInit(): void {
    const allowedRoles = this.appAuthRole();

    if (!allowedRoles?.length) {
      return;
    }

    const userRoles = this.keycloakService.getRoles();

    const hasAccess = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasAccess) {
      this.el.nativeElement.remove();
    }
  }
}
