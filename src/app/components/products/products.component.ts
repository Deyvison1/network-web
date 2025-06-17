import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ProductDTO } from '../../models/product.dto';
import { ProductService } from '../../services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { ViewQrCodeComponent } from '../view-qr-code/view-qr-code.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly dialogService = inject(MatDialog);
  products: ProductDTO[] = [];

  ngOnInit(): void {
    this.getAll();
  }

  openModalViewQrCode() {
    this.dialogService.open(ViewQrCodeComponent, {
      width: '800',
      height: '800',
    });
  }

  getAll() {
    this.productService.getAllProducts().subscribe({
      next: (resp) => {
        this.products = resp;
      },
      error: () => {},
      complete: () => {},
    });
  }
}
