import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ProductDTO } from '../../models/product.dto';
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
  private readonly dialogService = inject(MatDialog);
  @Input() products: ProductDTO[] = [];
  

  constructor() {
  }
  openModalViewQrCode() {
    this.dialogService.open(ViewQrCodeComponent, {
      width: '800',
      height: '800',
    });
  }
}
