import { Component, inject } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { PageConfig } from '../../models/interfaces/page.config';
import { ProductDTO } from '../../models/product.dto';
import { HttpResponse } from '@angular/common/http';
import { ActionTypeBodyDTO } from '../../models/interfaces/action-type-body.dto';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from './product-form/product-form.component';
import { firstValueFrom } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { MatTableDataSource } from '@angular/material/table';
import { ActionType } from '../../consts/enums/action-type.enum';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { ResponseDTOPage } from '../../models/interfaces/page-response.dto';
import { ProductFilterComponent } from "./product-filter/product-filter.component";
import { ProductFilterDTO } from '../../models/interfaces/product-filter.dto';

@Component({
  selector: 'app-product',
  imports: [CommonModule, ProductListComponent, ProductFilterComponent],
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  private readonly service = inject(ProductService);
  private readonly dialogService = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  totalItens: string;
  dataSource: MatTableDataSource<ProductDTO>;
  pageConfig: PageConfig;

  getAllProducts(pageConfig: PageConfig, filters?: ProductFilterDTO) {
    this.pageConfig = pageConfig;
    this.service.getAllProductsPage(pageConfig, filters).subscribe({
      next: (resp: HttpResponse<ResponseDTOPage<ProductDTO[]>>) => {
        this.dataSource = new MatTableDataSource(resp.body.content);
        this.totalItens = resp.body.totalElements.toString();
      },
    });
  }

  clear() {
    this.getAllProducts(this.pageConfig);
  }

  search(filters: ProductFilterDTO) {
    this.getAllProducts(this.pageConfig, filters);
  }

  openDialogDeleteProduct(actionTypeBodyDTO: ActionTypeBodyDTO<string>) {
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {});
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(actionTypeBodyDTO.body);
      }
    });
  }

  delete(uuid: string) {
    this.service.deleteProduct(uuid).subscribe({
      complete: () => {
        this.notificationService.notification(
          'Registro deletado com sucesso',
          ActionTypeNotification.SUCCESS
        );
        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'created,desc',
        });
      },
    });
  }

  async openDialogProduct(actionTypeBodyDTO: ActionTypeBodyDTO<ProductDTO>) {
    try {
      // Aguarda o retorno do produto
      let productDTO: ProductDTO;
      if (actionTypeBodyDTO.actionType === ActionType.EDIT) {
        productDTO = await firstValueFrom(
          this.service.getByUUid(actionTypeBodyDTO.body.uuid)
        );
      }
      const actionTypeBody: ActionTypeBodyDTO<ProductDTO> = {
        actionType: actionTypeBodyDTO.actionType,
        body: productDTO,
      };
      // Só abre o diálogo depois que o produto estiver disponível
      const dialog = this.dialogService.open(ProductFormComponent, {
        width: '2000px',
        data: actionTypeBody,
        // você pode passar o productDTO aqui se quiser
      });

      dialog.beforeClosed().subscribe({
        next: (productDTO: ProductDTO) => {
          if (productDTO) {
            this.save(productDTO, actionTypeBodyDTO.actionType);
          }
        },
      });
    } catch (error) {
      this.notificationService.notification(
        this.setMessageErro(error),
        ActionTypeNotification.ERRO
      );
    }
  }

  save(productDTO: ProductDTO, actionType: ActionType) {
    if (actionType === ActionType.INSERT) {
      this.inserProduct(productDTO);
    } else {
      this.updateProduct(productDTO);
    }
  }

  updateProduct(product: ProductDTO) {
    this.service.editProduct(product.uuid, product).subscribe({
      next: (productDTO: ProductDTO) => {
        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'created,desc',
        });
        this.notificationService.notification(
          'Sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }

  inserProduct(product: ProductDTO) {
    this.service.insertProduct(product).subscribe({
      next: (productDTO: ProductDTO) => {
        this.getAllProducts({
          pageIndex: 0,
          pageSize: 5,
          sortBy: 'created,desc',
        });
        this.notificationService.notification(
          'Sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }

  setMessageErro(error: any) {
    return NotificationService.getError(error);
  }
}
