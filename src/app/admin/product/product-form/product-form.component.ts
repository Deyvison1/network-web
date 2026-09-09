import { CommonModule, KeyValue } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
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
import { ApiResponseDTO } from '../../../models/interfaces/api-response.dto';
import { KeyValueDTO } from '../../../models/interfaces/key-value.dto';

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
export class ProductFormComponent implements OnInit {
  title: string = 'Produto';
  private readonly requiredsCommons = requiredsCommons;
  private readonly categoryService = inject(CategoryService);
  private readonly fields: string[] = [
    'id',
    'name',
    'speedDownload',
    'speedUpload',
    'taxaAdesao',
    'valueWifi',
    'value',
    'description',
    'categoryId',
  ];

  categories: KeyValueDTO[] = [];
  form: FormGroup;
  private readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  data = inject<ActionTypeBodyDTO<ProductDTO>>(MAT_DIALOG_DATA);

  editOrInsert: string = '';

  ngOnInit(): void {
    this.form = FormUtil.buildForm(
      this.fields,
      this.requiredsCommons.requiredsProduct,
    );
    this.getAllCaregories();

    this.inserOrEdit();
  }

  inserOrEdit() {
    if (this.data.actionType === ActionType.EDIT) {
      this.form.patchValue(this.data.body);
    }
  }

  getAllCaregories() {
    this.categoryService.getAllCategory().subscribe({
      next: (categories: ApiResponseDTO<KeyValueDTO[]>) => {
        this.categories = categories.data;
      },
    });
  }

  close(productDTO?: ProductDTO) {
    this.dialogRef.close(productDTO);
  }

  compareFn(c1: string | null, c2: string | null): boolean {
    return c1 === c2;
  }
  save() {
    const product = this.form.getRawValue();
    this.close(product);
  }
}
