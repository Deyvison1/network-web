import { MatDialogRef } from '@angular/material/dialog';

export interface DataDialog<T> {
  body: T;
  dialog: MatDialogRef<T>;
}
