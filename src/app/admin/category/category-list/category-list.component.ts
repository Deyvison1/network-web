import { NotificationService } from './../../../services/notification.service';
import { CategoryDTO } from './../../../models/category.dto';
import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import PageConfig from '../../../models/interfaces/page.config';
import { pageCommons } from '../../../consts/page.commons';
import { CategoryService } from '../../../services/category.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteDialogComponent } from '../../../components/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ActionType } from '../../../consts/enums/cction-type.enum';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly notificationService = inject(NotificationService);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;
  totalItens: number | string = '';
  @Input() set setDataSource(data: MatTableDataSource<CategoryDTO>) {
    if (data) this.dataSource = data;
  }

  public readonly ActionType = ActionType;
  private readonly dialogService = inject(MatDialog);

  dataSource: MatTableDataSource<CategoryDTO>;
  displayedColumns: string[] = ['name', 'description', 'actions'];
  openDialogCategoryEmitter = output<ActionTypeBodyDTO<CategoryDTO>>();

  refreshDataSource = output<PageConfig>();

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    const paginator: PageConfig = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortBy: '',
    };

    this.refreshDataSource.emit(paginator);
  }

  openDialogCategory(actionType: ActionType, category: CategoryDTO) {
    this.openDialogCategoryEmitter.emit({actionType: actionType, body: category});
  }

  openDialogDeleteCategory(uuid: string) {
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(uuid);
      }
    });
  }

  delete(uuid: string) {
    this.categoryService.deleteCategory(uuid).subscribe({
      next: () => {
        this.notificationService.notificationComplet(
          'Deletado com sucesso',
          'OK',
          5000
        );
        this.getCategories();
      },
    });
  }

  changePage() {
    this.getCategories();
  }

  changeSortBy(event: any) {}
}
