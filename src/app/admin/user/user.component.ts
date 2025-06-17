import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DragAndDropComponent } from '../../utils/drag-and-drop/drag-and-drop.component';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDTO } from '../../models/user.dto';
import { UserAuthService } from '../../services/user-auth.service';
import { NotificationService } from '../../services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { FormUtil } from '../../utils/form.utils';
import { requiredsCommons } from '../../consts/requireds.commons';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragAndDropComponent,
    MatTableModule,
    MatSortModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  private readonly userService = inject(UserAuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialog = inject(MatDialog);
  private readonly requiredsCommons = requiredsCommons;
  private readonly _liveAnnouncer = inject(LiveAnnouncer);

  form: FormGroup;
  usersDataSource: UserDTO[] = [];
  displayedColumns: string[] = ['login', 'role', 'createdAt', 'updatedAt'];
  openForm: boolean = false;
  editOrInsert: string = '';

  listRoles = [
    { role: 'ADMIN', view: 'Administrador' },
    { role: 'USER', view: 'Usuario' },
  ];

  ngOnInit(): void {
    this.form = FormUtil.buildForm(
      Object.keys(new UserDTO()),
      this.requiredsCommons.requiredsUser
    );
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (res) => {
        this.usersDataSource = res;
      },
      (err) => {}
    );
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  openFormMethod() {
    if (!this.openForm) {
      this.openForm = true;
    }
  }

  delete(userId?: number) {
    this.userService.deleteUser(userId).subscribe({
      complete: () => {
        this.getUsers();
      },
      next: () => {
        this.notificationService.notificationComplet(
          'Deletado com sucesso',
          'OK',
          5000
        );
      },
      error: (err) => {
        this.notificationService.notificationComplet(
          'Falha ao deletar!',
          'OK',
          5000
        );
      },
    });
  }

  save() {
    const values = this.form.value;
    if (values.id) {
      this.updateUser(values);
    } else {
      this.addUser(values);
    }
  }

  addUser(user: UserDTO) {
    this.userService.insertUser(user).subscribe({
      next: (res) => {
        this.notificationService.notificationComplet(
          'Cadastrado com sucesso',
          'OK',
          5000
        );
        this.getUsers();
      },
      error: (err) => {
        this.notificationService.notificationComplet(
          'Cadastro de usuario falhou!',
          'OK',
          5000
        );
      },
      complete: () => {},
    });
    this.defaultFormAdd();
  }

  editOrInsertMehtod(data?: UserDTO) {
    if (data) {
      this.openForm = true;
      this.editOrInsert = 'edit';
      this.form.patchValue(data);
    } else {
      this.editOrInsert = 'insert';
      this.openForm = true;
      this.form.reset();
    }
  }

  openDialogDeleteUser(userId?: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp) {
        this.delete(userId);
        this.getUsers();
      }
    });
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
      error: () => {
        this.notificationService.notificationComplet(
          'Atualização de usuario falhou!',
          'OK',
          5000
        );
      },
      complete: () => {},
    });
    this.defaultFormAdd();
  }

  defaultFormAdd() {
    this.form.reset();
    this.openForm = false;
  }
}
