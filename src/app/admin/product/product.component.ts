import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
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
import {
  ApiResponseDTO,
  PageApiResponseDTO,
} from '../../models/interfaces/api-response.dto';
import { ActionTypeBodyDTO } from '../../models/interfaces/action-type-body.dto';

import { ActionType } from '../../consts/enums/action-type.enum';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductFilterComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private readonly service = inject(ProductService);
  private readonly dialogService = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  totalItens = '0';

  dataSource = new MatTableDataSource<ProductDTO>();

  pageConfig: PageConfig = {
    pageIndex: 0,
    pageSize: 5,
    sortBy: 'creationDate,desc',
  };

  getAllProducts(pageConfig: PageConfig, filters?: ProductFilterDTO): void {
    this.pageConfig = pageConfig;

    this.service.getAllProductsPage(pageConfig, filters).subscribe({
      next: (resp: PageApiResponseDTO<ProductDTO[]>) => {
        this.dataSource = new MatTableDataSource<ProductDTO>(resp.data ?? []);

        this.totalItens = resp.total?.toString() ?? '0';
      },
    });
  }

  clear(): void {
    this.getAllProducts(this.pageConfig);
  }

  search(filters: ProductFilterDTO): void {
    this.getAllProducts(this.pageConfig, filters);
  }

  openDialogDeleteProduct(actionTypeBodyDTO: ActionTypeBodyDTO<string>): void {
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      width: '400px',
      data: actionTypeBodyDTO,
    });

    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(actionTypeBodyDTO.body);
      }
    });
  }

  delete(id: string): void {
    this.service.deleteProduct(id).subscribe({
      complete: () => {
        this.notificationService.notification(
          'Registro deletado com sucesso',
          ActionTypeNotification.SUCCESS,
        );

        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'creationDate,desc',
        });
      },
    });
  }

  async openDialogProduct(
    actionTypeBodyDTO: ActionTypeBodyDTO<ProductDTO>,
  ): Promise<void> {
    try {
      let productDTO: ProductDTO | undefined;

      if (actionTypeBodyDTO.actionType === ActionType.EDIT) {
        const response = await firstValueFrom(
          this.service.getByUUid(actionTypeBodyDTO.body.id),
        );

        productDTO = response.data;
      }

      const actionTypeBody: ActionTypeBodyDTO<ProductDTO | undefined> = {
        actionType: actionTypeBodyDTO.actionType,
        body: productDTO,
      };

      const dialog = this.dialogService.open(ProductFormComponent, {
        width: '900px',
        maxWidth: '95vw',
        data: actionTypeBody,
      });

      dialog.beforeClosed().subscribe({
        next: (product: ProductDTO | undefined) => {
          if (product) {
            this.save(product, actionTypeBodyDTO.actionType);
          }
        },
      });
    } catch (error) {
      console.log(error);

      this.notificationService.notification(
        this.setMessageErro(error),
        ActionTypeNotification.ERRO,
      );
    }
  }

  save(productDTO: ProductDTO, actionType: ActionType): void {
    if (actionType === ActionType.INSERT) {
      this.insertProduct(productDTO);
      return;
    }

    this.updateProduct(productDTO);
  }

  updateProduct(product: ProductDTO): void {
    this.service.editProduct(product.id, product).subscribe({
      next: (response: ApiResponseDTO<ProductDTO>) => {
        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'creationDate,desc',
        });

        this.notificationService.notification(
          'Sucesso',
          ActionTypeNotification.SUCCESS,
        );
      },
    });
  }

  insertProduct(product: ProductDTO): void {
    this.service.insertProduct(product).subscribe({
      next: (response: ApiResponseDTO<ProductDTO>) => {
        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'creationDate,desc',
        });

        this.notificationService.notification(
          'Sucesso',
          ActionTypeNotification.SUCCESS,
        );
      },
    });
  }

  setMessageErro(error: unknown): string {
    return NotificationService.getError(error);
  }
}
