import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormUtil } from '../../../utils/form.utils';
import { CategoryDTO } from '../../../models/category.dto';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { ErroComponent } from '../../../components/erro/erro.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragAndDropComponent, ErroComponent],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly requiredsCommons = requiredsCommons;
  private readonly dialogRef = inject(MatDialogRef<CategoryFormComponent>);

  title: string = 'Adicionar Categoria';

  form: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  close(categoryDTO?: CategoryDTO) {
    this.dialogRef.close(categoryDTO);
  }

  initForm() {
    this.form = FormUtil.buildForm(Object.keys(new CategoryDTO()), this.requiredsCommons.requiredsCategory);
  }

  saveCategory() {
    const category: CategoryDTO = this.form.value;
    this.close(category);
  }
}
