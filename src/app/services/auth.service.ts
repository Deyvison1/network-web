import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import InformationsTokenDTO from '../models/interfaces/informations-token.dto';
import { RouterService } from './router.service';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginDTO } from '../models/login.dto';
import { TokenDTO } from '../models/interfaces/token.dto';
import { ResponseDTO } from '../models/interfaces/response.dto';
import { ResponseTokenDTO } from '../models/interfaces/token-response.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/auth');

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

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.router.redirectionTo('/home');
  }
}
