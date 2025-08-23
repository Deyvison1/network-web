import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormUtil } from '../../../utils/form.utils';
import { CategoryDTO } from '../../../models/category.dto';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { ErroComponent } from '../../../components/erro/erro.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../../consts/enums/cction-type.enum';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragAndDropComponent,
    ErroComponent,
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly requiredsCommons = requiredsCommons;
  private readonly dialogRef = inject(MatDialogRef<CategoryFormComponent>);
  data = inject<ActionTypeBodyDTO<CategoryDTO>>(MAT_DIALOG_DATA);

  title: string = 'Adicionar Categoria';

  form: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  close(categoryDTO?: CategoryDTO) {
    this.dialogRef.close(categoryDTO);
  }

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new CategoryDTO()),
      this.requiredsCommons.requiredsCategory
    );
    if (this.data.actionType === ActionType.EDIT && this.data.body) {
      this.form.patchValue(this.data.body);
    }
  }

  saveCategory() {
    const category: CategoryDTO = this.form.value;
    this.close(category);
  }
}
