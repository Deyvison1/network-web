import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CompanyVisualizationComponent } from '../company-visualization/company-visualization.component';
import { ProductsComponent } from '../products/products.component';
import { ProductService } from '../../services/product.service';
import { ProductCategoryCompletDTO } from '../../models/product.dto';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, CompanyVisualizationComponent, ProductsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  private readonly productService = inject(ProductService);

  readonly aboutTheCompany = 'Sobre a Suprema Network';
  products: ProductCategoryCompletDTO[] = [];

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        this.products = resp.data ?? [];
      },
    });
  }
}
