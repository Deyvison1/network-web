import { Component, inject } from '@angular/core';
import { CategoryListComponent } from './category-list/category-list.component';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from './category-form/category-form.component';
import { MatCardModule } from '@angular/material/card';
import { CategoryDTO } from '../../models/category.dto';

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

  openDialogCategory() {
    const dialog = this.dialogService.open(CategoryFormComponent, {
      width: '1000px',
    });

    dialog.beforeClosed().subscribe({
      next: (categoryDTO: CategoryDTO) => {
          alert('after');
        if (categoryDTO) {
          this.saveCategory(categoryDTO);
        }
      },
    });
  }

  saveCategory(category: CategoryDTO) {
    this.categoryService.insertCategory(category).subscribe(
      {
        next: (category: CategoryDTO) => {
          this.notificationService.notificationSimple('Categoria adicionada com sucesso!');
        }
      }
    );
  }
}
