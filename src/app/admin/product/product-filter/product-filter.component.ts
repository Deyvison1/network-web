import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';

import { ProductFilterDTO } from '../../../models/interfaces/product-filter.dto';
import { KeyValueDTO } from '../../../models/interfaces/key-value.dto';
import { CategoryService } from '../../../services/category.service';
import { NgxCurrencyDirective } from 'ngx-currency';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatExpansionModule,
    NgxCurrencyDirective
  ],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
})
export class ProductFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoryService = inject(CategoryService);

  form!: FormGroup;
  categories: KeyValueDTO[] = [];
  searchEvent = output<ProductFilterDTO>();
  clearEvent = output<void>();
  panelOpenState = signal(false);

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      categoryId: [null],
      description: [''],
      speedDownload: [''],
      speedUpload: [''],
      valueWifi: [''],
      value: [''],
      taxaAdesao: [''],
      creationDate: [''],
    });

    this.categoryService.getAllCategory().subscribe({
      next: (resp) => {
        this.categories = resp.data ?? [];
      },
    });
  }

  search(): void {
    this.searchEvent.emit(this.form.value);
  }

  clear(): void {
    this.form.reset();
    this.clearEvent.emit();
  }

}
