import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CategorySearchDTO } from '../../../models/interfaces/category-search.dto';

@Component({
  selector: 'app-category-filter',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  standalone: true,
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  form: FormGroup;
  searchEvent = output<CategorySearchDTO>();
  clearEvent = output<void>();
  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [''],
      description: ['']
    });
  }

  clear() {
    this.form.reset();
    this.clearEvent.emit();
  }

  search() {
    const values: CategorySearchDTO = this.form.value;
    this.searchEvent.emit(values);
  }
}
