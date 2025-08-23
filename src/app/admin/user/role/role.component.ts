import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtil } from '../../../utils/form.utils';
import { RoleDTO } from '../../../models/role.dto';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { ErroComponent } from '../../../components/erro/erro.component';
import { RoleService } from '../../../services/role.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    DragAndDropComponent,
    ErroComponent,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss',
})
export class RoleComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<RoleComponent>);
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
        this.notificationService.notificationComplet(
          'Registro salvo com sucesso',
          'OK',
          5000
        );
      },
      error: (err) => {
        this.close(false);
      },
    });
  }
}
