import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CategorySearchDTO } from '../../../models/interfaces/category-search.dto';

@Component({
  selector: 'app-category-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss',
})
export class CategoryFilterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  searchEvent = output<CategorySearchDTO>();
  clearEvent = output<void>();

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      description: [''],
    });
  }

  clear(): void {
    this.form.reset();
    this.clearEvent.emit();
  }

  search(): void {
    this.searchEvent.emit(this.form.value);
  }
}
