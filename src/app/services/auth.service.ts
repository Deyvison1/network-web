import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';
import { RouterService } from './router.service';
import { HttpService } from './http.service';
import { LoginDTO } from '../models/login.dto';
import { Observable } from 'rxjs';
import { CredenciaisDTO } from '../models/credentials';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/auth');

  private readonly router = inject(RouterService);
  public getToken(): string {
    return localStorage.getItem('token');
  }

  login(userAuth: LoginDTO): Observable<CredenciaisDTO> {
    return this.http.post<CredenciaisDTO>(`${this.url}`, userAuth);
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
