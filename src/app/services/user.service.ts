import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDTO } from '../models/user.dto';
import { HttpService } from './http.service';
import PageConfig from '../models/interfaces/page.config';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/users');

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

  findByLogin(login: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.url}/get-login/${login}`);
  }

  deleteUser(uuid: string) {
    return this.http.delete(`${this.url}/${uuid}`);
  }

  editUserPartial(user: UserDTO): Observable<UserDTO> {
    return this.http.patch(`${this.url}/${user.uuid}`, user);
  }
}
