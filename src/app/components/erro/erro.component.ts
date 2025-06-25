import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-erro',
  imports: [],
  templateUrl: './erro.component.html',
  styleUrl: './erro.component.scss',
})
export class ErroComponent {
  @Input() set setControl(control: AbstractControl) {
    if (control) this.control = control;
  }
  control: AbstractControl;
}
