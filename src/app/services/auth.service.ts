import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly router = inject(RouterService);
  public getToken(): string {
    return localStorage.getItem('token');
  }

  public decodePayloadJWT(): InformationsTokenDTO {
    return jwtDecode(this.getToken());
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.redirectionTo('/home');
  }
}
