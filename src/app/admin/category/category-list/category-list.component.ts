import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CategoryDTO } from '../../../models/category.dto';
import { PageConfig } from '../../../models/interfaces/page.config';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../../consts/enums/action-type.enum';
import { buildSortBy, pageCommons } from '../../../consts/page.commons';
import { AuthRoleDirective } from '../../../directives/auth-role.directive';

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
    AuthRoleDirective,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  readonly ActionType = ActionType;
  readonly displayedColumns = ['name', 'description', 'actions'];

  totalItens = input(0);
  dataSource = input.required<MatTableDataSource<CategoryDTO>>();

  openDialogCategory = output<ActionTypeBodyDTO<string>>();
  refreshDataSource = output<PageConfig>();
  deleteCategory = output<string>();

  ngOnInit(): void {
    this.emitPage();
  }

  changePage(): void {
    this.emitPage(buildSortBy(this.sort));
  }

  changeSortBy(sort: Sort): void {
    this.emitPage(buildSortBy(sort));
  }

  openForm(actionType: ActionType, category?: CategoryDTO): void {
    this.openDialogCategory.emit({
      actionType,
      body: category?.id ?? '',
    });
  }

  private emitPage(sortBy?: string): void {
    this.refreshDataSource.emit({
      pageIndex: this.paginator?.pageIndex ?? pageCommons.pageIndex,
      pageSize: this.paginator?.pageSize || pageCommons.pageSize,
      sortBy: sortBy || pageCommons.sortBy,
    });
  }
}
