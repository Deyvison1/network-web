import { CategorySearchDTO } from './../../models/interfaces/category-search.dto';
import { ActionTypeBodyDTO } from './../../models/interfaces/action-type-body.dto';
import { NotificationService } from './../../services/notification.service';
import { Component, inject } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from './category-form/category-form.component';
import { MatCardModule } from '@angular/material/card';
import { CategoryDTO } from '../../models/category.dto';
import { PageConfig } from '../../models/interfaces/page.config';
import { MatTableDataSource } from '@angular/material/table';
import { ActionType } from '../../consts/enums/action-type.enum';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { ICategoryDTO } from '../../models/interfaces/icategory.dto';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import {
  ApiResponseDTO,
  PageApiResponseDTO,
} from '../../models/interfaces/api-response.dto';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    MatCardModule,
    CategoryFilterComponent,
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogService = inject(MatDialog);
  totalItens: string;

  dataSource: MatTableDataSource<CategoryDTO>;
  pageConfig: PageConfig;

  openDialogCategory(actionTypeBodyDTO: ActionTypeBodyDTO<string>) {
    const dialog = this.dialogService.open(CategoryFormComponent, {
      width: '1000px',
      data: actionTypeBodyDTO,
    });

    dialog.beforeClosed().subscribe({
      next: (categoryDTO: ICategoryDTO) => {
        if (categoryDTO) {
          if (actionTypeBodyDTO.actionType == ActionType.INSERT) {
            this.saveCategory(categoryDTO);
          } else {
            this.editCategory(categoryDTO);
          }
        }
      },
    });
  }

  clear() {
    this.refreshDataSource(this.pageConfig);
  }

  search(modelSearch: CategorySearchDTO) {
    this.refreshDataSource(this.pageConfig, modelSearch);
  }

  refreshDataSource(pageConfig: PageConfig, filters?: CategorySearchDTO) {
    this.pageConfig = pageConfig;
    this.categoryService.getAllCategoryPage(pageConfig, filters).subscribe({
      next: (categories: PageApiResponseDTO<CategoryDTO[]>) => {
        this.dataSource = new MatTableDataSource(categories.data);
        this.totalItens = categories.total.toString();
      },
    });
  }

  editCategory(categoryDTO: ICategoryDTO) {
    this.categoryService.editCategory(categoryDTO).subscribe({
      next: (category: ApiResponseDTO<CategoryDTO>) => {
        this.notificationService.notification(
          'Categoria atualizada com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }

  saveCategory(category: ICategoryDTO) {
    this.categoryService.insertCategory(category).subscribe({
      next: (category: ApiResponseDTO<CategoryDTO>) => {
        this.notificationService.notification(
          'Categoria adicionada com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }
}
