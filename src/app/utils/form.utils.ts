import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

export class FormUtil {
  static buildForm(fields: string[] = [], requireds: string[] = []): FormGroup {
    const form = new FormGroup({});

    fields.forEach((field) => {
      const validators = requireds.includes(field) ? [Validators.required] : [];
      form.addControl(field, new FormControl('', validators));
    });

    return form;
  }

  static isInvalid(control: AbstractControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }
}