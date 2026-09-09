import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { ErroComponent } from '../../../components/erro/erro.component';
import { FormUtil } from '../../../utils/form.utils';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { ActionType } from '../../../consts/enums/action-type.enum';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { ICategoryDTO } from '../../../models/interfaces/icategory.dto';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragAndDropComponent, ErroComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly dialogRef = inject(MatDialogRef<CategoryFormComponent>);
  private readonly fields = requiredsCommons.fieldsCategory;

  readonly data = inject<ActionTypeBodyDTO<string>>(MAT_DIALOG_DATA);
  form!: FormGroup;
  title = 'Adicionar categoria';

  ngOnInit(): void {
    this.form = FormUtil.buildForm(this.fields, requiredsCommons.requiredsCategory);
    this.title = this.data.body ? 'Atualizar categoria' : 'Adicionar categoria';

    if (this.data.actionType === ActionType.EDIT && this.data.body) {
      this.categoryService.findByIdComplet(this.data.body).subscribe({
        next: (response) => this.form.patchValue(response.data),
      });
    }
  }

  close(category?: ICategoryDTO): void {
    this.dialogRef.close(category);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.close(this.form.value);
  }
}
