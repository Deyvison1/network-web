import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../models/category.dto';
import { HttpService } from './http.service';
import PageConfig from '../models/interfaces/page.config';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends HttpService {
  private readonly urlApiCategory = environment.urlApi.concat('/categories');

  getAllCategoryPage(
    pageConfig: PageConfig
  ): Observable<HttpResponse<CategoryDTO[]>> {
    return this.http.get<CategoryDTO[]>(
      `${this.urlApiCategory}?page=${pageConfig.pageIndex}&size=${pageConfig.pageSize}`,
      { observe: 'response' }
    );
  }

  getAllCategory(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.urlApiCategory}/get-all`);
  }

  findByIdComplet(uuid: string): Observable<CategoryDTO> {
    return this.http.get(`${this.urlApiCategory}/${uuid}`);
  }

  insertCategory(category: CategoryDTO) {
    return this.http.post<CategoryDTO>(`${this.urlApiCategory}`, category);
  }

  editCategory(category: CategoryDTO) {
    return this.http.put<CategoryDTO>(`${this.urlApiCategory}`, category);
  }

  deleteCategory(uuid: string) {
    return this.http.delete(`${this.urlApiCategory}/${uuid}`);
  }
}
