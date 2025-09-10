import { Component, inject, input, output, ViewChild } from '@angular/core';
import { DeleteDialogComponent } from '../../../components/delete-dialog/delete-dialog.component';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthRoleDirective } from '../../../directives/auth-role.directive';
import { UserFilterComponent } from '../../../components/user-filter/user-filter.component';
import PageConfig from '../../../models/interfaces/page.config';
import { pageCommons } from '../../../consts/page.commons';
import { UserDTO } from '../../../models/user.dto';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActionTypeNotification } from '../../../consts/enums/action-type-notification.enum';

@Component({
  selector: 'app-user-list',
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
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogService = inject(MatDialog);
  public readonly roles: string[] = ['ADMIN'];
  @ViewChild(MatSort, { static: true }) sort: Sort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;

  dataSource = input<MatTableDataSource<UserDTO>>();
  saveEventEmmiter = output<UserDTO>();
  refreshData = output<void>();

  displayedColumns: string[] = [
    'nick',
    'roles',
    'created',
    'updated',
    'actions',
  ];
  editOrInsert: string = '';
  totalItens: string;

  listRoles = [
    { role: 'ADMIN', view: 'Administrador' },
    { role: 'USER', view: 'Usuario' },
  ];

  openDialogDeleteUser(uuid: string) {
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
    this.userService.deleteUser(uuid).subscribe(
      {next: () => {
        this.notificationService.notification('Registro excluido com sucesso.', ActionTypeNotification.SUCCESS);
      }}
    );
  }

  changePage() {
    const sortBy = this.setSortBy(this.sort);
    this.getUsers(sortBy);
  }

  setSortBy(sort: Sort) {
    this.sort = sort;
    return !sort.direction ? 'created' : sort.active + ',' + sort.direction;
  }

  changeSortBy(sort: Sort) {
    this.sort = sort;
    const sortBy = this.setSortBy(sort);
    this.getUsers(sortBy);
  }

  setPagination() {
    if (this.dataSource().data.length) {
      const paginator: PageConfig = this.pageCommons;
      if (!this.paginator.pageIndex) {
        this.paginator.pageIndex = paginator.pageIndex;
      }
      if (!this.paginator.pageSize) {
        this.paginator.pageSize = paginator.pageSize;
      }
    }
  }

  getUsers(sort: string) {
    this.refreshData.emit();
  }

  openDialog(userDTO?: UserDTO) {
    if (userDTO) userDTO.password = '';
    const dialog = this.dialogService.open(UserFormComponent, {
      width: '1000px',
      data: {
        userSelected: userDTO,
      },
    });
    

    dialog.afterClosed().subscribe((resp) => {
      if (resp) {
        this.save(resp);
      }
    });
  }

  save(userDTO?: UserDTO) {
    this.saveEventEmmiter.emit(userDTO);
  }
}
