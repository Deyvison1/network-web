import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';
import { RouterService } from './router.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDTO } from '../models/login.dto';
import { ResponseTokenDTO } from '../models/interfaces/token-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/auth');
  private readonly roles: string[] = ['ADMIN', 'USER'];
  private readonly router = inject(RouterService);
  public getToken(): string {
    return localStorage.getItem('token');
  }

  login(userAuth: LoginDTO): Observable<ResponseTokenDTO> {
    return this.http.post<ResponseTokenDTO>(`${this.url}/signin`, userAuth);
  }

  public decodePayloadJWT(): InformationsTokenDTO {
    return jwtDecode(this.getToken());
  }

  hasAccess(): boolean {
    return this.hasAnyRole(this.roles, this.decodePayloadJWT().roles);
  }

  private hasAnyRole(userRoles: string[], requiredRoles: string[]): boolean {
    return requiredRoles.some(role => userRoles.includes(role));
  }

  isRole(rolesComponent: string[]) {
    const allowedRoles = this.roles;
    const userRoles = ['admin'];

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    return hasPermission;
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.redirectionTo('/home');
  }
}
