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
import { ActionType } from '../../../consts/enums/action-type.enum';
import { MatCardModule } from '@angular/material/card';
import { ICategoryDTO } from '../../../models/interfaces/i-category.dto';
import { CategoryService } from '../../../services/category.service';
import { CategoryCompletDTO } from '../../../models/interfaces/category-complet.dto';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragAndDropComponent,
    ErroComponent,
    MatCardModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  private readonly requiredsCommons = requiredsCommons;
  private readonly categoryService = inject(CategoryService);
  private readonly dialogRef = inject(MatDialogRef<CategoryFormComponent>);
  data = inject<ActionTypeBodyDTO<string>>(MAT_DIALOG_DATA);
  categoryCompletSelected: CategoryCompletDTO;

  title: string = 'Adicionar Categoria';

  form: FormGroup;

  ngOnInit() {
    this.initForm();
    this.setTitle();
  }

  setTitle() {
    this.title = (this.data.body)? 'Atualizar Categoria' : 'Adicionar Categoria';
  }

  close(categoryDTO?: ICategoryDTO) {
    this.dialogRef.close(categoryDTO);
  }

  initForm() {
    this.form = FormUtil.buildForm(
      Object.keys(new CategoryDTO()),
      this.requiredsCommons.requiredsCategory
    );
    if (this.data.actionType === ActionType.EDIT && this.data.body) {
      this.categoryService.findByIdComplet(this.data.body).subscribe(
        {
          next: (categoryCompletDTO: CategoryCompletDTO) => {
            this.categoryCompletSelected = categoryCompletDTO;
            this.form.patchValue(this.categoryCompletSelected);
          }
        }
      );
    }
  }

  saveCategory() {
    const category: ICategoryDTO = this.form.value;
    this.close(category);
  }
}
