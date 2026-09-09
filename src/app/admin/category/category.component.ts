import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';

import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';

import { CategoryDTO } from '../../models/category.dto';
import { ICategoryDTO } from '../../models/interfaces/icategory.dto';
import { CategorySearchDTO } from '../../models/interfaces/category-search.dto';
import { PageConfig } from '../../models/interfaces/page.config';
import { ActionTypeBodyDTO } from '../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../consts/enums/action-type.enum';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { pageCommons } from '../../consts/page.commons';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CategoryListComponent, CategoryFilterComponent, MatIconModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);

  totalItens = 0;
  dataSource = new MatTableDataSource<CategoryDTO>([]);
  pageConfig: PageConfig = { ...pageCommons };
  private currentFilters?: CategorySearchDTO;

  search(filters: CategorySearchDTO): void {
    this.currentFilters = filters;
    this.refreshDataSource({ ...this.pageConfig, pageIndex: 0 }, filters);
  }

  clear(): void {
    this.currentFilters = undefined;
    this.refreshDataSource({ ...pageCommons });
  }

  refreshDataSource(pageConfig: PageConfig, filters = this.currentFilters): void {
    this.pageConfig = pageConfig;

    this.categoryService.getAllCategoryPage(pageConfig, filters).subscribe({
      next: (categories) => {
        this.dataSource = new MatTableDataSource(categories.data ?? []);
        this.totalItens = categories.total ?? 0;
      },
    });
  }

  openNewCategory() {
    this.openDialogCategory({
      actionType: ActionType.INSERT,
      body: null,
    });
  }

  openDialogCategory(action: ActionTypeBodyDTO<string>): void {
    const dialog = this.dialog.open(CategoryFormComponent, {
      width: '720px',
      maxWidth: '95vw',
      panelClass: 'app-dialog',
      data: action,
    });

    dialog.afterClosed().subscribe((category?: ICategoryDTO) => {
      if (!category) {
        return;
      }

      if (action.actionType === ActionType.INSERT) {
        this.saveCategory(category);
        return;
      }

      this.editCategory(category);
    });
  }

  openDialogDeleteCategory(id: string): void {
    const dialog = this.dialog.open(DeleteDialogComponent, {
      width: '420px',
      panelClass: 'app-dialog',
    });

    dialog.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteCategory(id);
      }
    });
  }

  private editCategory(category: ICategoryDTO): void {
    this.categoryService.editCategory(category).subscribe({
      next: () => {
        this.notificationService.notification(
          'Categoria atualizada com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }

  private saveCategory(category: ICategoryDTO): void {
    this.categoryService.insertCategory(category).subscribe({
      next: () => {
        this.notificationService.notification(
          'Categoria adicionada com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }

  private deleteCategory(id: string): void {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.notificationService.notification(
          'Categoria excluída com sucesso!',
          ActionTypeNotification.SUCCESS,
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }
}
