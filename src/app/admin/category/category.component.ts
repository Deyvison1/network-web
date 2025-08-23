import { Component, inject } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from './category-form/category-form.component';
import { MatCardModule } from '@angular/material/card';
import { CategoryDTO } from '../../models/category.dto';
import PageConfig from '../../models/interfaces/page.config';
import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { ActionType } from '../../consts/enums/cction-type.enum';
import { ActionTypeBodyDTO } from '../../models/interfaces/action-type-body.dto';

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

  dataSource: MatTableDataSource<CategoryDTO>;
  pageConfig: PageConfig;

  openDialogCategory(actionTypeBodyDTO: ActionTypeBodyDTO<CategoryDTO>) {
    const dialog = this.dialogService.open(CategoryFormComponent, {
      width: '1000px',
      data: actionTypeBodyDTO
    });

    this.findByIdComplet(actionTypeBodyDTO.body.uuid);

    dialog.beforeClosed().subscribe({
      next: (categoryDTO: CategoryDTO) => {
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
    this.categoryService.findByIdComplet(uuid).subscribe(
      {
        next: (category: CategoryDTO) => {
          console.log(category);
        }
      }
    );
  }

  refreshDataSource(pageConfig: PageConfig) {
    this.pageConfig = pageConfig;
    this.categoryService.getAllCategoryPage(pageConfig).subscribe({
      next: (categories: HttpResponse<CategoryDTO[]>) => {
        this.dataSource = new MatTableDataSource(categories.body);
      },
    });
  }

  editCategory(categoryDTO: CategoryDTO) {
    this.categoryService.editCategory(categoryDTO).subscribe({
      next: (category: CategoryDTO) => {
        this.notificationService.notificationSimple(
          'Categoria atualizada com sucesso!'
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }

  saveCategory(category: CategoryDTO) {
    this.categoryService.insertCategory(category).subscribe({
      next: (category: CategoryDTO) => {
        this.notificationService.notificationSimple(
          'Categoria adicionada com sucesso!'
        );
        this.refreshDataSource(this.pageConfig);
      },
    });
  }
}
