import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { CategoryDTO } from '../models/category.dto';
import { PageConfig } from '../models/interfaces/page.config';
import { ICategoryDTO } from '../models/interfaces/icategory.dto';
import { CategoryCompletDTO } from '../models/interfaces/category-complet.dto';
import { CategorySearchDTO } from '../models/interfaces/category-search.dto';
import { KeyValueDTO } from '../models/interfaces/key-value.dto';

import {
  ApiResponseDTO,
  PageApiResponseDTO,
} from '../models/interfaces/api-response.dto';

import { HttpService } from './http.service';
import { HttpParamsUtil } from '../utils/http-param.utils';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends HttpService {

  private readonly urlApiCategory =
    environment.urlApi.concat('/categories');

  getAllCategoryPage(
    pageConfig: PageConfig,
    filters?: CategorySearchDTO,
  ): Observable<PageApiResponseDTO<CategoryDTO[]>> {

    let params = HttpParamsUtil.pagination(
      pageConfig.pageIndex,
      pageConfig.pageSize,
      pageConfig.sortBy,
    );

    params = HttpParamsUtil.addAll(params, {
      name: filters?.name,
      description: filters?.description,
    });

    return this.http.get<PageApiResponseDTO<CategoryDTO[]>>(
      this.urlApiCategory,
      { params },
    );
  }

  getAllCategory(): Observable<ApiResponseDTO<KeyValueDTO[]>> {

    return this.http.get<ApiResponseDTO<KeyValueDTO[]>>(
      `${this.urlApiCategory}/get-all`,
    );
  }

  findByIdComplet(
    id: string,
  ): Observable<ApiResponseDTO<CategoryCompletDTO>> {

    return this.http.get<ApiResponseDTO<CategoryCompletDTO>>(
      `${this.urlApiCategory}/${id}`,
    );
  }

  insertCategory(
    categoryDTO: ICategoryDTO,
  ): Observable<ApiResponseDTO<CategoryDTO>> {

    return this.http.post<ApiResponseDTO<CategoryDTO>>(
      this.urlApiCategory,
      categoryDTO,
    );
  }

  editCategory(
    category: CategoryDTO,
  ): Observable<ApiResponseDTO<CategoryDTO>> {

    return this.http.put<ApiResponseDTO<CategoryDTO>>(
      this.urlApiCategory,
      category,
    );
  }

  deleteCategory(
    id: string,
  ): Observable<ApiResponseDTO<void>> {

    return this.http.delete<ApiResponseDTO<void>>(
      `${this.urlApiCategory}/${id}`,
    );
  }
}