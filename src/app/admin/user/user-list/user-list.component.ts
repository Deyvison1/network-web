import { Component, inject, input, output, ViewChild } from '@angular/core';
import { DeleteDialogComponent } from '../../../components/delete-dialog/delete-dialog.component';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { AuthRoleDirective } from '../../../directives/auth-role.directive';
import { pageCommons } from '../../../consts/page.commons';
import { UserDTO } from '../../../models/user.dto';
import { UserFormComponent } from '../user-form/user-form.component';
import { ActionTypeNotification } from '../../../consts/enums/action-type-notification.enum';
import { DialogService } from '../../../services/dialog.service';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { PageConfig } from '../../../models/interfaces/page.config';

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
  private readonly dialogService = inject(DialogService);
  public readonly roles: string[] = ['ADMIN'];
  @ViewChild(MatSort, { static: true }) sort: Sort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  pageCommons: PageConfig = pageCommons;

  dataSource = input<MatTableDataSource<UserDTO>>();
  totalItens = input<string>();
  saveEventEmmiter = output<ActionTypeBodyDTO<UserDTO>>();
  refreshData = output<void>();

  displayedColumns: string[] = [
    'nick',
    'roles',
    'created',
    'updated',
    'actions',
  ];
  editOrInsert: string = '';

  openDialog(userDTO?: UserDTO) {
    if (userDTO) userDTO.password = '';
    this.dialogService.open(UserFormComponent, {
      width: '1000px',
      data: {
        body: userDTO,
      },
    });
  }

  closeDialog(dialogRef: MatDialogRef<UserFormComponent>) {
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
    this.userService.deleteUser(uuid).subscribe({
      next: () => {
        this.notificationService.notification(
          'Registro excluido com sucesso.',
          ActionTypeNotification.SUCCESS
        );
        this.getUsers();
      },
    });
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

  getUsers(sort?: string) {
    this.refreshData.emit();
  }

  save(actionUserDTO: ActionTypeBodyDTO<UserDTO>) {
    this.saveEventEmmiter.emit(actionUserDTO);
  }
}
