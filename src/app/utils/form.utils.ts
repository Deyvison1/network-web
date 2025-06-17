import { FormControl, FormGroup, Validators } from '@angular/forms';

export class FormUtil {
  static buildForm(fields: string[] = [], requireds: string[] = []): FormGroup {
    const form = new FormGroup({});

    fields.forEach((p) => {
      if (requireds.indexOf(p) > -1) {
        form.addControl(p, new FormControl('', Validators.required));
      } else {
        form.addControl(p, new FormControl(''));
      }
    });
    return form;
  }
}
