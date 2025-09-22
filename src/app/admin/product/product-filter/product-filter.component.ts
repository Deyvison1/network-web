import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductFilterDTO } from '../../../models/interfaces/product-filter.dto';

@Component({
  selector: 'app-product-filter',
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
    MatExpansionModule,
  ],
  providers: [CurrencyPipe], // ✅ aqui está a correção
  standalone: true,
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly currencyPipe: CurrencyPipe = inject(CurrencyPipe);
  readonly panelOpenState = signal(false);
  searchEvent = output<ProductFilterDTO>();
  clearEvent = output<void>();
  formattedAmount: string;
  rawAmount: number;
  form: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [''],
      category: [],
      description: [''],
      speedDownload: [],
      speedUpload: [],
      valueWifi: [],
      value: [],
      taxaAdesao: [],
      created: []
    });
  }

  normalizePrice(nameField: string) {
    const price = this.form.get(nameField)?.value;

    if (price !== null && price !== undefined) {
      // Força para 2 casas decimais e transforma de volta em número
      const normalized = +parseFloat(price).toFixed(2);

      this.form.get(nameField)?.setValue(normalized, { emitEvent: false });
    }
  }

  search() {
    const filters: ProductFilterDTO = this.form.value;
    this.searchEvent.emit(filters);
  }

  clear() {
    this.form.reset();
    this.clearEvent.emit();
  }

  transformAmount(value: string, filed: string) {
    if (value) {
      // Convert formatted string back to a number for internal use
      this.rawAmount = parseFloat(value.replace(/[^0-9.-]+/g, ''));

      const valueTransform = this.currencyPipe.transform(
        this.rawAmount,
        'BRL', // ✅ moeda brasileira
        'symbol', // ✅ usa "R$" como símbolo
        '1.2-2', // ✅ casas decimais
        'pt-BR'
      );

      this.form.controls[filed].setValue(valueTransform);
    }
  }
}
