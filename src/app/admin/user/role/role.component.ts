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
  private readonly requiredsCommons = requiredsCommons;
  title: string =  'Papel do Usuário';
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
      .get('sigla')
      .addValidators([Validators.minLength(4), Validators.maxLength(20)]);
  }

  close() {
    this.dialogRef.close();
  }

  save() {}
}
