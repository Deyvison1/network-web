import {
  Component,
  inject,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { RoleDTO } from '../../../../models/role.dto';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthRoleDirective } from '../../../../directives/auth-role.directive';
import { CommonModule } from '@angular/common';
import { PageConfig } from '../../../../models/interfaces/page.config';
import { pageCommons } from '../../../../consts/page.commons';
import { RoleService } from '../../../../services/role.service';
import { NotificationService } from '../../../../services/notification.service';
import { DialogService } from '../../../../services/dialog.service';
import { ActionTypeBodyDTO } from '../../../../models/interfaces/action-type-body.dto';
import { RoleFormComponent } from '../role-form/role-form.component';
import { MatDialogRef } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../../../components/delete-dialog/delete-dialog.component';
import { ActionTypeNotification } from '../../../../consts/enums/action-type-notification.enum';
import { RoleFilterDTO } from '../../../../models/interfaces/role-filter.dto';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatPaginatorModule,
    AuthRoleDirective,
  ],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
})
export class RoleListComponent {
  private readonly roleService = inject(RoleService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogService = inject(DialogService);
  public readonly roles: string[] = ['ADMIN'];
  @ViewChild(MatSort, { static: true }) sort: Sort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;

  dataSource = input<MatTableDataSource<RoleDTO>>();
  totalItens = input<string>();
  saveEventEmmiter = output<ActionTypeBodyDTO<RoleDTO>>();
  refreshData = output<{
    pageConfig: PageConfig;
    filters: RoleFilterDTO;
  }>();

  displayedColumns: string[] = ['name', 'description', 'actions'];
  editOrInsert: string = '';

  openDialog(roleDTO?: RoleDTO) {
    this.dialogService.open(RoleFormComponent, {
      width: '1000px',
      data: {
        body: roleDTO,
      },
    });
  }

  closeDialog(dialogRef: MatDialogRef<RoleFormComponent>) {
    this.dialogService.close(dialogRef);
  }

  openDialogDeleteUser(uuid: string) {
    const dialogRef = this.dialogService.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(uuid);
      }
    });
  }

  delete(uuid: string) {
    this.roleService.delete(uuid).subscribe({
      next: () => {
        this.notificationService.notification(
          'Registro excluido com sucesso.',
          ActionTypeNotification.SUCCESS
        );
        this.getRoles();
      },
    });
  }

  changePage() {
    const sortBy = this.setSortBy(this.sort);
    this.getRoles(sortBy);
  }

  setSortBy(sort: Sort) {
    this.sort = sort;
    return !sort.direction ? '' : sort.active + ',' + sort.direction;
  }

  changeSortBy(sort: Sort) {
    this.sort = sort;
    const sortBy = this.setSortBy(sort);
    this.getRoles(sortBy);
  }

  getPageConfig(sort: string) {
    const paginator: PageConfig = {
      pageIndex: !this.paginator?.pageIndex
        ? this.pageCommons.pageIndex
        : this.paginator?.pageIndex,
      pageSize: !this.paginator.pageSize
        ? this.pageCommons.pageSize
        : this.paginator.pageSize,
      sortBy: sort ?? '',
    };
    return paginator;
  }

  getRoles(sort?: string) {
    this.refreshData.emit({
      pageConfig: this.getPageConfig(sort),
      filters: null,
    });
  }

  save(actionUserDTO: ActionTypeBodyDTO<RoleDTO>) {
    this.saveEventEmmiter.emit(actionUserDTO);
  }
}
