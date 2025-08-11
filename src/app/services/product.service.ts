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
  ): Observable<HttpResponse<ProductDTO[]>> {
    return this.http.get<ProductDTO[]>(
      `${this.url}?page=${pageConfig.pageIndex}&size=${pageConfig.pageSize}`,
      { observe: 'response' }
    );
  }

  getAllProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(`${this.url}/get-all`);
  }

  insertProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(`${this.url}`, product);
  }

  editProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.url}`, product);
  }

  deleteProduct(productId: number): Observable<ProductDTO> {
    return this.http.delete<ProductDTO>(`${this.url}/${productId}`);
  }
}
