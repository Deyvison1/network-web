import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDTO } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Sort, MatSortModule, MatSort } from '@angular/material/sort';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { UserFormComponent } from './user-form/user-form.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import PageConfig from '../../models/interfaces/page.config';
import { pageCommons } from '../../consts/page.commons';
import { AuthRoleDirective } from '../../directives/auth-role.directive';

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
    AuthRoleDirective,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogService = inject(MatDialog);
  public readonly roles: string[] = ['ADMIN'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;

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

  ngOnInit(): void {
    this.setPagination();
    this.getUsers();
  }

  changeSortBy(sort: Sort) {
    const sortBy = !sort.direction
      ? 'createdAt'
      : sort.active + ',' + sort.direction;
    this.getUsers(sortBy);
  }

  getUsers(sortBy?: string) {
    const paginator: PageConfig = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize,
      sortBy: !sortBy ? this.pageCommons.sortBy : sortBy,
    };
    this.userService.getUsersPagination(paginator).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp.body);
        this.totalItens = resp.headers.get('X_TOTAL_COUNT');
      },
      complete: () => {},
    });
  }

  setPagination() {
    const paginator: PageConfig = this.pageCommons;
    if (!this.paginator.pageIndex) {
      this.paginator.pageIndex = paginator.pageIndex;
    }
    if (!this.paginator.pageSize) {
      this.paginator.pageSize = paginator.pageSize;
    }
  }

  delete(userId: string) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.getUsers();
        this.notificationService.notificationComplet(
          'Deletado com sucesso',
          'OK',
          5000
        );
      },
    });
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

  save(userDTO: UserDTO) {
    if (userDTO.uuid) {
      this.updateUser(userDTO);
    } else {
      this.addUser(userDTO);
    }
  }

  openDialogDeleteUser(uuid: string) {
    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(uuid);
        this.getUsers();
      }
    });
  }

  addUser(user: UserDTO) {
    this.userService.insertUser(user).subscribe({
      next: (res) => {
        this.getUsers();
        this.notificationService.notificationComplet(
          'Cadastrado com sucesso',
          'OK',
          5000
        );
      },
    });
  }

  changePage() {
    this.getUsers();
  }

  updateUser(user: UserDTO) {
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.getUsers();
        this.notificationService.notificationComplet(
          'Atualizado comm sucesso!',
          'OK',
          5000
        );
      },
    });
  }
}
