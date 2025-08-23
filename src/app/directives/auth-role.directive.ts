import {
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { AuthService } from '../services/auth.service';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';

@Directive({
  selector: '[appAuthRole]',
})
export class AuthRoleDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly authService = inject(AuthService);
  readonly appAuthRole = input<string[]>();

  private getUserRole(): InformationsTokenDTO {
    return this.authService.decodePayloadJWT();
  }

  ngOnInit(): void {
    const role: InformationsTokenDTO = this.getUserRole();
    const allowedRoles = this.appAuthRole();

    if (!allowedRoles?.some((r) => role.roles.includes(r))) {
      this.el.nativeElement.style.display = 'none';
      this.el.nativeElement.remove();
    }
  }
}
