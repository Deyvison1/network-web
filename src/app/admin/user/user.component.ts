import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { UserFormComponent } from './user-form/user-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import PageConfig from '../../models/interfaces/page.config';
import { pageCommons } from '../../consts/page.commons';
import { AuthRoleDirective } from '../../directives/auth-role.directive';
import { ActionTypeNotification } from '../../consts/enums/action-type-notification.enum';
import { HttpResponse } from '@angular/common/http';
import { PageResponseDTO } from '../../models/interfaces/page-response.dto';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';
import { UserFilterDTO } from '../../models/interfaces/user-filter.dto';
import { UserListComponent } from './user-list/user-list.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatPaginatorModule,
    UserFilterComponent,
    UserListComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  public readonly roles: string[] = ['ADMIN'];
  @ViewChild(MatSort, { static: true }) sort: Sort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;
  filters: UserFilterDTO;
  dataSource = new MatTableDataSource<UserDTO>();
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

  constructor() {
    effect(() => {
      const actionUser = this.userService.onUserUpdate();
      if(actionUser) {
        this.save(actionUser.body);
      }
    },);
  }

  search(userFilter: UserFilterDTO) {
    this.getUsers('', userFilter);
  }

  getUsers(sortBy?: string, filters?: UserFilterDTO) {
    const paginator: PageConfig = {
      pageIndex: !this.paginator?.pageIndex
        ? this.pageCommons.pageIndex
        : this.paginator?.pageIndex,
      pageSize: !this.paginator?.pageSize
        ? this.pageCommons.pageSize
        : this.paginator?.pageIndex,
      sortBy: !sortBy ? 'created' : sortBy,
    };
    this.userService.getUsersPagination(paginator, filters).subscribe({
      next: (resp: HttpResponse<PageResponseDTO<UserDTO[]>>) => {
        this.dataSource = new MatTableDataSource(resp.body.content);
        this.totalItens = resp.body.totalElements.toString();
      },
    });
  }


  delete(userId: string) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.getUsers();
        this.notificationService.notification(
          'Deletado com sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }

  save(userDTO: UserDTO) {
    if (userDTO.uuid) {
      this.updateUser(userDTO);
    } else {
      this.addUser(userDTO);
    }
  }

  addUser(user: UserDTO) {
    this.userService.insertUser(user).subscribe({
      next: (res) => {
        this.getUsers();
        this.notificationService.notification(
          'Cadastrado com sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }

  updateUser(user: UserDTO) {
    this.userService.updateUser(user.uuid, user).subscribe({
      next: () => {
        this.getUsers();
        this.notificationService.notification(
          'Atualizado comm sucesso!',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }
}
