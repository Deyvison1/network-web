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
import PageConfig from '../../models/interfaces/page.config';
import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ActionType } from '../../consts/enums/action-type.enum';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { ICategoryDTO } from '../../models/interfaces/i-category.dto';
import { CategoryCompletDTO } from '../../models/interfaces/category-complet.dto';
import { PageResponseDTO } from '../../models/interfaces/page-response.dto';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, CategoryListComponent, MatCardModule],
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

  findByIdComplet(uuid: string) {
    this.categoryService.findByIdComplet(uuid).subscribe({
      next: (category: CategoryCompletDTO) => {
      },
    });
  }

  refreshDataSource(pageConfig: PageConfig) {
    this.pageConfig = pageConfig;
    this.categoryService.getAllCategoryPage(pageConfig).subscribe({
      next: (categories: HttpResponse<PageResponseDTO<CategoryDTO[]>>) => {
        this.dataSource = new MatTableDataSource(categories.body.content);
        this.totalItens = categories.body.totalElements.toString();
      },
    });
  }

  editCategory(categoryDTO: ICategoryDTO) {
    this.categoryService.editCategory(categoryDTO).subscribe({
      next: (category: CategoryDTO) => {
        this.notificationService.notification(
          'Categoria atualizada com sucesso!',
          ActionTypeNotification.SUCCESS
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }

  saveCategory(category: ICategoryDTO) {
    this.categoryService.insertCategory(category).subscribe({
      next: (category: CategoryDTO) => {
        this.notificationService.notification(
          'Categoria adicionada com sucesso!',
          ActionTypeNotification.SUCCESS
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }
}
