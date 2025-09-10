import { PageResponseDTO } from './../models/interfaces/page-response.dto';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductDTO } from '../models/product.dto';
import { HttpService } from './http.service';
import PageConfig from '../models/interfaces/page.config';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends HttpService {
  private readonly url: string = environment.urlApi.concat('/products');

  getAllProductsPage(
    pageConfig: PageConfig
  ): Observable<HttpResponse<PageResponseDTO<ProductDTO[]>>> {
    return this.http.get<PageResponseDTO<ProductDTO[]>>(
      `${this.url}?page=${pageConfig.pageIndex}&size=${pageConfig.pageSize}&sort=${pageConfig.sortBy}`,
      { observe: 'response' }
    );
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
