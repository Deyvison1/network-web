import {
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormUtil } from '../../../utils/form.utils';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { UserDTO } from '../../../models/user.dto';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErroComponent } from '../../../components/erro/erro.component';
import { RoleComponent } from '../role/role.component';

export interface Data {
  userSelected: UserDTO;
}

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    DragAndDropComponent,
    MatTooltipModule,
    ErroComponent,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly requiredsCommons = requiredsCommons;
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  private readonly dialogService = inject(MatDialog);
  data = inject<Data>(MAT_DIALOG_DATA);
  form: FormGroup;
  labelPassowrd: string = 'Senha';
  title: string = '';
  listRoles = [
    { role: 'ADMIN', view: 'Administrador' },
    { role: 'USER', view: 'Usuario' },
  ];

  saveEmitter = output<UserDTO>();

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new UserDTO()),
      this.requiredsCommons.requiredsUser
    );
    this.form
      .get('login')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
    this.form
      .get('senha')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
    this.addOrEdit();
  }

  ngOnInit(): void {
    this.initForm();
  }

  openRoleDialog() {
    const dialog = this.dialogService.open(RoleComponent, {
      width: '600px'
    });
  }

  addOrEdit() {
    if (this.data.userSelected) {
      this.form.patchValue(this.data.userSelected);
      this.title = 'Atualizar usuário';
      this.labelPassowrd = 'Nova senha';
    } else {
      this.labelPassowrd = 'Senha';
      this.title = 'Novo usuário';
      this.form.reset();
    }
  }

  save() {
    const userDTO: UserDTO = this.form.value;
    this.closedDialog(userDTO);
  }

  compareFn(c1: string, c2: string): boolean {
    return c1 === c2;
  }

  closedDialog(userDTO?: UserDTO) {
    this.dialogRef.close(userDTO);
  }
}
