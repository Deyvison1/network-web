import { HttpResponse } from '@angular/common/http';
import { CategoryDTO } from './../../../models/category.dto';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, output, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import PageConfig from '../../../models/interfaces/page.config';
import { pageCommons } from '../../../consts/page.commons';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;
  totalItens: number | string = '';
  @Input() set setDataSource(data: CategoryDTO[]) {
    if (data) this.dataSource = new MatTableDataSource(data);
  }

  dataSource: MatTableDataSource<CategoryDTO>;
  displayedColumns: string[] = ['name', 'description', 'actions'];
  openDialogCategoryEmitter = output<void>();

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    const paginator: PageConfig = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortBy: '',
    };
    this.categoryService.getAllCategoryPage(paginator).subscribe({
      next: (categories: HttpResponse<CategoryDTO[]>) => {
        this.dataSource = new MatTableDataSource(categories.body);
      },
    });
  }

  openDialogCategory() {
    this.openDialogCategoryEmitter.emit();
  }

  openDialogDeleteCategory(event: any) {}

  changePage() {
    this.getCategories();
  }

  changeSortBy(event: any) {}
}
