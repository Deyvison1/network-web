import { PageResponseDTO } from './../models/interfaces/page-response.dto';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../models/category.dto';
import { HttpService } from './http.service';
import PageConfig from '../models/interfaces/page.config';
import { ICategoryDTO } from '../models/interfaces/i-category.dto';
import { CategoryCompletDTO } from '../models/interfaces/category-complet.dto';
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends HttpService {
  private readonly urlApiCategory = environment.urlApi.concat('/categories');

  getAllCategoryPage(
    pageConfig: PageConfig
  ): Observable<HttpResponse<PageResponseDTO<CategoryDTO[]>>> {
    return this.http.get<PageResponseDTO<CategoryDTO[]>>(
      `${this.urlApiCategory}?page=${pageConfig.pageIndex}&size=${pageConfig.pageSize}&sort=${pageConfig.sortBy}`,
      { observe: 'response' }
    );
  }

  getAllCategory(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${this.urlApiCategory}/get-all`);
  }

  findByIdComplet(uuid: string): Observable<CategoryCompletDTO> {
    return this.http.get<CategoryCompletDTO>(`${this.urlApiCategory}/${uuid}`);
  }

  insertCategory(categoryDTO: ICategoryDTO) {
    return this.http.post<CategoryDTO>(`${this.urlApiCategory}`, categoryDTO);
  }

  editCategory(category: CategoryDTO) {
    return this.http.put<CategoryDTO>(`${this.urlApiCategory}`, category);
  }

  deleteCategory(uuid: string) {
    return this.http.delete(`${this.urlApiCategory}/${uuid}`);
  }
}
