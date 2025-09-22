import {
  PageResponseDTO,
  ResponseDTOPage,
} from './../models/interfaces/page-response.dto';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CategoryDTO } from '../models/category.dto';
import { HttpService } from './http.service';
import { PageConfig } from '../models/interfaces/page.config';
import { ICategoryDTO } from '../models/interfaces/i-category.dto';
import { CategoryCompletDTO } from '../models/interfaces/category-complet.dto';
import { CategorySearchDTO } from '../models/interfaces/category-search.dto';
import { Filter } from '../models/interfaces/filter.dto';
@Injectable({
  providedIn: 'root',
})
export class CategoryService extends HttpService {
  private readonly urlApiCategory = environment.urlApi.concat('/categories');

  getAllCategoryPage(
    pageConfig: PageConfig,
    filters?: CategorySearchDTO
  ): Observable<HttpResponse<ResponseDTOPage<CategoryDTO[]>>> {
    const params: HttpParams = this.buildPaginationParams(pageConfig, filters);

    return this.http.get<ResponseDTOPage<CategoryDTO[]>>(
      `${this.urlApiCategory}`,
      {
        params,
        observe: 'response',
      }
    );
  }

  private buildPaginationParams(
    pageConfig: PageConfig,
    filters?: CategorySearchDTO
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
