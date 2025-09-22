import { ResponseDTOPage } from './../models/interfaces/page-response.dto';
import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDTO } from '../models/product.dto';
import { HttpService } from './http.service';
import { PageConfig } from '../models/interfaces/page.config';
import { ProductFilterDTO } from '../models/interfaces/product-filter.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/products');

  getAllProductsPage(
    pageConfig: PageConfig,
    filters?: ProductFilterDTO
  ): Observable<HttpResponse<ResponseDTOPage<ProductDTO[]>>> {
    const params: HttpParams = this.buildPaginationParams(pageConfig, filters);

    return this.http.get<ResponseDTOPage<ProductDTO[]>>(
      `${this.url}`,
      {
        params,
        observe: 'response',
      }
    );
  }

  private buildPaginationParams(
    pageConfig: PageConfig,
    filters?: ProductFilterDTO
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

    if (filters?.value) {
      params = params.set('value', filters.value);
    }

    if (filters?.speedDownload) {
      params = params.set('speedDownload', filters.speedDownload);
    }

    if (filters?.speedUpload) {
      params = params.set('speedUpload', filters.speedUpload);
    }

    if (filters?.taxaAdesao) {
      params = params.set('taxaAdesao', filters.taxaAdesao);
    }

    if (filters?.valueWifi) {
      params = params.set('valueWifi', filters.valueWifi);
    }

    if (filters?.category) {
      params = params.set('category', filters.category);
    }

     if (filters?.created) {
      params = params.set('created', filters.created.toString());
    }

    return params;
  }

  getByUUid(uuid: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.url}/${uuid}`);
  }

  getAllProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.url}/get-all`);
  }

  insertProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.url}`, product);
  }

  editProduct(uuid: string, product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.url}/${uuid}`, product);
  }

  deleteProduct(uuid: string): Observable<ProductDTO> {
    return this.http.delete<ProductDTO>(`${this.url}/${uuid}`);
  }
}
