import { Directive, ElementRef, OnInit, inject, input } from '@angular/core';

import { KeycloakService } from '../services/keycloak.service';

@Directive({
  selector: '[appAuthRole]',
})
export class AuthRoleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly keycloakService = inject(KeycloakService);

  readonly appAuthRole = input<string[]>();

  ngOnInit(): void {
    const userRoles = this.keycloakService.getRoles();
    const allowedRoles = this.appAuthRole();

    if (!allowedRoles?.some((role) => userRoles.includes(role))) {
      this.el.nativeElement.remove();
    }
  }
}
