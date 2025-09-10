import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DragAndDropComponent } from '../../../../components/drag-and-drop/drag-and-drop.component';
import { ErroComponent } from '../../../../components/erro/erro.component';
import { RoleService } from '../../../../services/role.service';
import { NotificationService } from '../../../../services/notification.service';
import { requiredsCommons } from '../../../../consts/requireds.commons';
import { FormUtil } from '../../../../utils/form.utils';
import { RoleDTO } from '../../../../models/role.dto';
import { ActionTypeNotification } from '../../../../consts/enums/action-type-notification.enum';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    ErroComponent,
    DragAndDropComponent
  ],
  templateUrl: './role-form.component.html',
  styleUrl: './role-form.component.scss',
})
export class RoleFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<RoleFormComponent>);
  private readonly roleService = inject(RoleService);
  private readonly notificationService = inject(NotificationService);
  private readonly requiredsCommons = requiredsCommons;
  title: string = 'Papel do Usuário';
  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new RoleDTO()),
      this.requiredsCommons.requiredRole
    );
    this.form
      .get('name')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
    this.form
      .get('description')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
  }

  close(isSuccess?: boolean) {
    this.dialogRef.close(isSuccess);
  }

  save() {
    const roleDTO: RoleDTO = this.form.getRawValue();
    this.roleService.save(roleDTO).subscribe({
      next: (resp) => {
        this.close(true);
        this.notificationService.notification(
          'Registro salvo com sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
      error: (err) => {
        this.close(false);
      },
    });
  }
}
