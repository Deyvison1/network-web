import { Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RoleDTO } from '../models/role.dto';
import { PageConfig } from '../models/interfaces/page.config';
import { RoleFilterDTO } from '../models/interfaces/role-filter.dto';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { PageResponseDTO } from '../models/interfaces/page-response.dto';
import { ActionTypeBodyDTO } from '../models/interfaces/action-type-body.dto';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends HttpService {
  private readonly urlApiRole = `${environment.urlApi}/roles`;

  private readonly roleUpdatedSignal =
    signal<ActionTypeBodyDTO<RoleDTO> | null>(null);
  readonly roleUpdates$ = this.roleUpdatedSignal.asReadonly();

  emitRoleUpdate(role: ActionTypeBodyDTO<RoleDTO>): void {
    this.roleUpdatedSignal.set(role);
  }

  getAll(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.urlApiRole}/get-all`);
  }

  getRolePagination(
    pageConfig: PageConfig,
    filters?: RoleFilterDTO
  ): Observable<HttpResponse<PageResponseDTO<RoleDTO[]>>> {
    const params = this.buildPaginationParams(pageConfig, filters);

    return this.http.get<PageResponseDTO<RoleDTO[]>>(`${this.urlApiRole}`, {
      params,
      observe: 'response',
    });
  }

  insert(roleDTO: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.urlApiRole, roleDTO);
  }

  update(uuid: string, roleDTO: RoleDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(`${this.urlApiRole}/${uuid}`, roleDTO);
  }

  delete(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApiRole}/${uuid}`);
  }

  // 🔒 Private utils
  private buildPaginationParams(
    pageConfig: PageConfig,
    filters?: RoleFilterDTO
  ): HttpParams {
    let params = new HttpParams()
      .set('page', pageConfig.pageIndex)
      .set('size', pageConfig.pageSize)
      .set('sort', pageConfig.sortBy);

    if (filters?.name) {
      params = params.set('name', filters.name);
    }

    if (filters?.description) {
      params = params.set('description', filters.description);
    }

    return params;
  }
}
