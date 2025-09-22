import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DragAndDropComponent } from '../../../../components/drag-and-drop/drag-and-drop.component';
import { ErroComponent } from '../../../../components/erro/erro.component';
import { RoleService } from '../../../../services/role.service';
import { NotificationService } from '../../../../services/notification.service';
import { requiredsCommons } from '../../../../consts/requireds.commons';
import { FormUtil } from '../../../../utils/form.utils';
import { RoleDTO } from '../../../../models/role.dto';
import { ActionType } from '../../../../consts/enums/action-type.enum';
import { Data } from '../../../../models/interfaces/data.dto';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    ErroComponent,
    DragAndDropComponent,
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
})
export class RoleFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<RoleFormComponent>);
  private readonly roleService = inject(RoleService);
  private readonly notificationService = inject(NotificationService);
  private readonly requiredsCommons = requiredsCommons;
  data = inject<Data<RoleDTO>>(MAT_DIALOG_DATA);
  title: string = 'Papel do Usuário';
  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.addOrEdit();
  }

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new RoleDTO()),
      this.requiredsCommons.requiredRole
    );
  }

  addOrEdit() {
    if(this.data.body) {
      this.form.patchValue(this.data.body);
    }
  }

  close(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  save() {
    const roleDTO: RoleDTO = this.form.getRawValue();
    let actionType = !this.data.body ? ActionType.INSERT : ActionType.EDIT;
    this.roleService.emitRoleUpdate({
      actionType: actionType,
      body: roleDTO,
    });
  }
}
