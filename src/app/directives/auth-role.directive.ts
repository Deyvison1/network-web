import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';

@Directive({
  selector: '[appAuthRole]',
})
export class AuthRoleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly authService = inject(AuthService);

  roleUser() {
    return this.authService.decodePayloadJWT();
  }

  ngOnInit(): void {
    const nada: InformationsTokenDTO = this.roleUser();
    if (!nada.roles.includes('[ROLE_ADMIN]')) {
      this.el.nativeElement.style.display = 'none';
      this.el.nativeElement.remove();
    }
  }
}
