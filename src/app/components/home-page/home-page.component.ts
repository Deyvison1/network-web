import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CompanyVisualizationComponent } from '../company-visualization/company-visualization.component';
import { ProductsComponent } from '../products/products.component';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../../models/product.dto';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    CompanyVisualizationComponent,
    ProductsComponent
  ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  private readonly productService = inject(ProductService);
  readonly aboutTheCompany: string = 'Sobre a Suprema Network';
  products: ProductDTO[] = [];

  ngOnInit(): void {
    this.getAll();  
  }

  getAll() {
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      complete: () => {},
      error: () => {}
    });
  }
}
