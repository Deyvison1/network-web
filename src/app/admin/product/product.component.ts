import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';

import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../services/notification.service';

import { PageConfig } from '../../models/interfaces/page.config';
import { ProductDTO } from '../../models/product.dto';
import { ProductFilterDTO } from '../../models/interfaces/product-filter.dto';
import { ActionTypeBodyDTO } from '../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../consts/enums/action-type.enum';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { pageCommons } from '../../consts/page.commons';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    ProductFilterComponent,
    MatIconModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private readonly service = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  totalItens = 0;
  dataSource = new MatTableDataSource<ProductDTO>([]);
  pageConfig: PageConfig = { ...pageCommons };
  private currentFilters?: ProductFilterDTO;

  getAllProducts(pageConfig: PageConfig, filters = this.currentFilters): void {
    this.pageConfig = pageConfig;

    this.service.getAllProductsPage(pageConfig, filters).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp.data ?? []);
        this.totalItens = resp.total ?? 0;
      },
    });
  }

  clear(): void {
    this.currentFilters = undefined;
    this.getAllProducts({ ...pageCommons });
  }

  search(filters: ProductFilterDTO): void {
    this.currentFilters = filters;
    this.getAllProducts({ ...this.pageConfig, pageIndex: 0 }, filters);
  }

  openDialogDeleteProduct(id: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '420px',
      panelClass: 'app-dialog',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.delete(id);
      }
    });
  }

  openNewProduct(): void {
    this.openDialogProduct({
      actionType: ActionType.INSERT,
      body: null,
    });
  }

  async openDialogProduct(
    action: ActionTypeBodyDTO<ProductDTO | null>,
  ): Promise<void> {
    try {
      let product: ProductDTO | undefined;

      if (action.actionType === ActionType.EDIT && action.body?.id) {
        const response = await firstValueFrom(
          this.service.getByUUid(action.body.id),
        );
        product = response.data;
      }

      const dialog = this.dialog.open(ProductFormComponent, {
        width: '920px',
        maxWidth: '95vw',
        panelClass: 'app-dialog',
        data: {
          actionType: action.actionType,
          body: product,
        },
      });

      dialog.afterClosed().subscribe((result?: ProductDTO) => {
        if (result) {
          this.save(result, action.actionType);
        }
      });
    } catch (error) {
      console.log(error);
      this.notificationService.notification(
        NotificationService.getError(error),
        ActionTypeNotification.ERRO,
      );
    }
  }

  private save(product: ProductDTO, actionType: ActionType): void {
    if (actionType === ActionType.INSERT) {
      this.insertProduct(product);
      return;
    }

    this.updateProduct(product);
  }

  private updateProduct(product: ProductDTO): void {
    this.service.editProduct(product.id, product).subscribe({
      next: () => {
        this.notificationService.notification(
          'Produto atualizado com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.getAllProducts({ ...pageCommons });
      },
    });
  }

  private insertProduct(product: ProductDTO): void {
    this.service.insertProduct(product).subscribe({
      next: () => {
        this.notificationService.notification(
          'Produto cadastrado com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.getAllProducts({ ...pageCommons });
      },
    });
  }

  private delete(id: string): void {
    this.service.deleteProduct(id).subscribe({
      complete: () => {
        this.notificationService.notification(
          'Produto excluído com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.getAllProducts({ ...pageCommons });
      },
    });
  }
}
