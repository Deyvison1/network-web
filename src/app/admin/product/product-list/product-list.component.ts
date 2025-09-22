import { CommonModule } from '@angular/common';
import {
  Component,
  input,
  Input,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActionType } from '../../../consts/enums/action-type.enum';
import { ProductDTO } from '../../../models/product.dto';
import { PageConfig } from '../../../models/interfaces/page.config';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { pageCommons } from '../../../consts/page.commons';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule
],
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  totalItens = input();
  dataSource: MatTableDataSource<ProductDTO>;
  @ViewChild(MatSort, { static: true }) sort: Sort;
  pageCommons: PageConfig = pageCommons;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['name', 'description', 'actions'];
  public readonly ActionType = ActionType;
  refreshDataSource = output<PageConfig>();
  openDialogProductEmitter = output<ActionTypeBodyDTO<ProductDTO>>();
  openDialogDeleteProductEmitter = output<ActionTypeBodyDTO<string>>();

  @Input() set setDataSource(data: MatTableDataSource<ProductDTO>) {
    if (data) this.dataSource = data;
  }

  ngOnInit(): void {
    this.getProdutcs();
  }

  getProdutcs(sortBy?: string) {
    const paginator: PageConfig = {
      pageIndex: this.paginator.pageIndex,
      pageSize: !this.paginator.pageSize ? 5 : this.paginator.pageSize,
      sortBy: !sortBy ? this.pageCommons.sortBy : sortBy,
    };
    this.refreshDataSource.emit(paginator);
  }

  changePage() {
    const sortBy = this.setSortBy(this.sort);
    this.getProdutcs(sortBy);
  }

  setSortBy(sort: Sort) {
    this.sort = sort;
    return !sort.direction ? 'created' : sort.active + ',' + sort.direction;
  }

  changeSortBy(sort: Sort) {
    this.sort = sort;
    const sortBy = this.setSortBy(sort);
    this.getProdutcs(sortBy);
  }

  openDialogProduct(actionType: ActionType, productDTO: ProductDTO) {
    this.openDialogProductEmitter.emit({
      actionType: actionType,
      body: productDTO,
    });
  }

  openDialogDeleteProduct(uuid: string) {
    this.openDialogDeleteProductEmitter.emit({
      actionType: ActionType.DELETE,
      body: uuid,
    });
  }
}
