import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { ProductCategoryCompletDTO, ProductDTO } from '../models/product.dto';
import { PageConfig } from '../models/interfaces/page.config';
import { ProductFilterDTO } from '../models/interfaces/product-filter.dto';

import {
  ApiResponseDTO,
  PageApiResponseDTO,
} from '../models/interfaces/api-response.dto';

import { HttpService } from './http.service';
import { HttpParamsUtil } from '../utils/http-param.utils';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/products');

  getAllProductsPage(
    pageConfig: PageConfig,
    filters?: ProductFilterDTO,
  ): Observable<PageApiResponseDTO<ProductDTO[]>> {
    const body = {
      page: pageConfig.pageIndex,
      size: pageConfig.pageSize,
      sort: pageConfig.sortBy,

      ...filters,
    };

    return this.http.post<PageApiResponseDTO<ProductDTO[]>>(
      `${this.url}/search`,
      body,
    );
  }

  getByUUid(id: string): Observable<ApiResponseDTO<ProductDTO>> {
    return this.http.get<ApiResponseDTO<ProductDTO>>(`${this.url}/${id}`);
  }

  getAllProducts(): Observable<ApiResponseDTO<ProductCategoryCompletDTO[]>> {
    return this.http.get<ApiResponseDTO<ProductCategoryCompletDTO[]>>(`${this.url}/get-all`);
  }

  insertProduct(product: ProductDTO): Observable<ApiResponseDTO<ProductDTO>> {
    return this.http.post<ApiResponseDTO<ProductDTO>>(this.url, product);
  }

  editProduct(
    id: string,
    product: ProductDTO,
  ): Observable<ApiResponseDTO<ProductDTO>> {
    return this.http.put<ApiResponseDTO<ProductDTO>>(
      `${this.url}/${id}`,
      product,
    );
  }

  deleteProduct(id: string): Observable<ApiResponseDTO<void>> {
    return this.http.delete<ApiResponseDTO<void>>(`${this.url}/${id}`);
  }
}
