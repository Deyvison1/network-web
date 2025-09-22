import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErroComponent } from '../../../../components/erro/erro.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from '../../../../services/notification.service';
import { RoleFilterDTO } from '../../../../models/interfaces/role-filter.dto';

@Component({
  selector: 'app-role-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './role-filter.component.html',
  styleUrl: './role-filter.component.scss',
})
export class RoleFilterComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  form: FormGroup;
  fb = inject(FormBuilder);

  searchEvent = output<RoleFilterDTO>();

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [],
      description: [],
    });
  }

  search() {
    const filters: RoleFilterDTO = this.form.value;
    this.searchEvent.emit(filters);
  }

  limpar() {
    this.form.reset();
    this.search();
  }
}
