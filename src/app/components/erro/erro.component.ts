import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-erro',
  standalone: true,
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.scss',
})
export class ErroComponent {
  control: AbstractControl | null = null;

  @Input() set setControl(control: AbstractControl | null) {
    this.control = control;
  }
}
