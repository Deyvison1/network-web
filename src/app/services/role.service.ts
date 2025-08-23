import { Injectable } from "@angular/core";
import { HttpService } from "./http.service";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { RoleDTO } from "../models/role.dto";



@Injectable({
  providedIn: 'root',
})
export class RoleService extends HttpService {
  private readonly urlApiRole = environment.urlApi.concat('/roles');

  getAllRoles(): Observable<RoleDTO[]> {
    return this.http.get<RoleDTO[]>(`${this.urlApiRole}`);
  }

  save(roleDTO: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(`${this.urlApiRole}`, roleDTO);
  }
}