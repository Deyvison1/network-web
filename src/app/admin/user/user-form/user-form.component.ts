import { Component, OnInit, inject, output } from '@angular/core';
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

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErroComponent } from '../../../components/erro/erro.component';
import { RoleFormComponent } from '../role/role-form/role-form.component';
import { RoleDTO } from '../../../models/role.dto';
import { RoleService } from '../../../services/role.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { UserService } from '../../../services/user.service';
import { ActionType } from '../../../consts/enums/action-type.enum';

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
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  private readonly requiredsCommons = requiredsCommons;
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  private readonly dialogService = inject(MatDialog);
  private readonly roleService = inject(RoleService);
  private readonly userService = inject(UserService);
  data = inject<Data>(MAT_DIALOG_DATA);
  form: FormGroup;
  labelPassowrd: string = 'Senha';
  title: string = '';
  listRoles: RoleDTO[] = [];
  displaySelectedRoles: [];
  saveEmitter = output<UserDTO>();
  readonly userCurrentPasswordControl = new FormControl(false);

  ngOnInit(): void {
    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new UserDTO()),
      this.requiredsCommons.requiredsUser
    );
    this.form
      .get('nick')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
    this.form
      .get('password')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
    this.addOrEdit();
  }

  getRoles() {
    this.roleService.getAllRoles().subscribe({
      next: (rolesDTO: RoleDTO[]) => {
        this.listRoles = rolesDTO;
      },
    });
  }

  openRoleDialog() {
    const dialog = this.dialogService.open(RoleFormComponent, {
      width: '600px',
    });

    dialog.afterClosed().subscribe((resp) => {
      if (resp) {
        this.getRoles();
      }
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
    const userDTO: UserDTO = this.form.getRawValue();
    this.userService.emitUserUpdate({
      actionType: ActionType.INSERT,
      body: userDTO
    });
  }

  compareFn(role1: RoleDTO, role2: RoleDTO): boolean {
    return role1 && role2 ? role1.uuid === role2.uuid : role1 === role2;
  }

  closedDialog(userDTO?: UserDTO) {
    this.dialogRef.close(userDTO);
  }

  getSelectedRolesLabel(): string {
    const selected: RoleDTO[] = this.form.get('roles')?.value;
    if (!selected || selected.length === 0) {
      return 'Nenhum papel selecionado';
    }

    if (selected.length <= 2) {
      // Se tem até 2 itens, mostra todos separados por vírgula
      return selected.map((r) => r.name).join(', ');
    }

    // Se tem mais que 2, mostra o primeiro e depois "... +X"
    return `${selected[0].name}... +${selected.length - 1}`;
  }

  getSelectedRolesMatTooltip() {
    const rolesSelected: RoleDTO[] = this.form?.controls['roles'].value;
    if (this.form.controls['roles'].value && rolesSelected.length > 2) {
      const namesRolesSelected: string[] = rolesSelected.map((r) => r.name);
      let rolesFormat: string = namesRolesSelected.join(', ');
      return rolesFormat;
    }
    return '';
  }
}
