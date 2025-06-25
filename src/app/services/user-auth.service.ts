import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CredenciaisDTO } from '../models/credentials';
import { UserDTO } from '../models/user.dto';
import { HttpService } from './http.service';
import PageConfig from '../models/interfaces/page.config';
import { LoginDTO } from '../models/login.dto';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/api/usuario');

  getToken(userAuth: LoginDTO): Observable<CredenciaisDTO> {
    return this.http.post<CredenciaisDTO>(`${this.url}/auth`, userAuth);
  }

  insertUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.url}`, user);
  }

  updateUser(user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.url}`, user);
  }

  getUsersPagination(
    pageConfig: PageConfig
  ): Observable<HttpResponse<UserDTO[]>> {
    return this.http.get<UserDTO[]>(
      `${this.url}?page=${pageConfig.pageIndex}&size=${pageConfig.pageSize}&sortby=${pageConfig.sortBy}`,
      { observe: 'response' }
    );
  }

  deleteUser(id?: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  isLogado() {
    return !!localStorage.getItem('token');
  }
}
