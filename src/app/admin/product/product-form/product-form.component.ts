import { CommonModule, KeyValue } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { DragAndDropComponent } from '../../../components/drag-and-drop/drag-and-drop.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CategoryDTO } from '../../../models/category.dto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormUtil } from '../../../utils/form.utils';
import { ProductDTO } from '../../../models/product.dto';
import { requiredsCommons } from '../../../consts/requireds.commons';
import { ErroComponent } from '../../../components/erro/erro.component';
import { CategoryService } from '../../../services/category.service';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../../consts/enums/action-type.enum';

@Component({
  selector: 'app-product-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragAndDropComponent,
    ErroComponent,
  ],
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  title: string = 'Produto';
  private readonly requiredsCommons = requiredsCommons;
  private readonly categoryService = inject(CategoryService);

  categories: CategoryDTO[] = [];
  form: FormGroup;
  private readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  data = inject<ActionTypeBodyDTO<ProductDTO>>(MAT_DIALOG_DATA);

  editOrInsert: string = '';
  ngOnInit(): void {
    this.getAllCaregories();
    this.form = FormUtil.buildForm(
      Object.keys(new ProductDTO()),
      this.requiredsCommons.requiredsProduct
    );
    this.inserOrEdit();
  }

  inserOrEdit() {
    if(this.data.actionType === ActionType.EDIT) {
      this.form.patchValue(this.data.body);
    }
  }

  getAllCaregories() {
    this.categoryService.getAllCategory().subscribe(
      {
        next: (categories: CategoryDTO[]) => {
          this.categories = categories;
        }
      }
    );
  }

  close(productDTO?: ProductDTO) {
    this.dialogRef.close(productDTO);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  save() {
    const product = this.form.getRawValue();
    this.close(product);
  }
}
