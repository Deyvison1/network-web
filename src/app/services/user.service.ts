import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDTO } from '../models/user.dto';
import { HttpService } from './http.service';
import { PageConfig } from '../models/interfaces/page.config';
import { PageResponseDTO } from '../models/interfaces/page-response.dto';
import { UserFilterDTO } from '../models/interfaces/user-filter.dto';
import { ActionTypeBodyDTO } from '../models/interfaces/action-type-body.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/users');
  private readonly userUpdatedSignal =
    signal<ActionTypeBodyDTO<UserDTO> | null>(null);
  readonly userUpdates$ = this.userUpdatedSignal.asReadonly();

  emitUserUpdate(user: ActionTypeBodyDTO<UserDTO>) {
    this.userUpdatedSignal.set(user);
  }

  insertUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.url}`, user);
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.url}/${userId}`, user);
  }

  updateNickAndPasswordUser(
    userId: string,
    user: UserDTO
  ): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.url}/${userId}`, {
      nick: user.nick,
      password: user.password,
    });
  }

  getUsersPagination(
    pageConfig: PageConfig,
    filters?: UserFilterDTO
  ): Observable<HttpResponse<PageResponseDTO<UserDTO[]>>> {
    const params: HttpParams = this.buildPaginationParams(pageConfig, filters);

    return this.http.get<PageResponseDTO<UserDTO[]>>(`${this.url}`, {
      params,
      observe: 'response',
    });
  }

  findByLogin(login: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.url}/get-login/${login}`);
  }

  deleteUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${uuid}`);
  }

  editUserPartial(user: UserDTO): Observable<UserDTO> {
    return this.http.patch(`${this.url}/${user.uuid}`, user);
  }

  // 🔒 Private utils
  private buildPaginationParams(
    pageConfig: PageConfig,
    filters?: UserFilterDTO
  ): HttpParams {
    let params = new HttpParams()
      .set('page', pageConfig.pageIndex)
      .set('size', pageConfig.pageSize)
      .set('sort', pageConfig.sortBy);

    if (filters?.nick) {
      params = params.set('nick', filters.nick);
    }

    if (filters?.created) {
      params = params.set('created', filters.created.toString());
    }
    filters.uuids?.forEach((roleId: string) => {
      params = params.append('uuids', roleId);
    });

    return params;
  }
}
