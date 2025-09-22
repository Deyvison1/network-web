import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogRef: MatDialogRef<any> | null = null;
  private readonly dialog = inject(MatDialog);

  open<TComponent, TData = any, TResult = any>(
    component: ComponentType<TComponent>,
    config?: MatDialogConfig<TData>
  ): MatDialogRef<TComponent, TResult> {
    this.dialogRef = this.dialog.open<TComponent, TData, TResult>(
      component,
      config
    );
    return this.dialogRef;
  }

  close<TResult = any>(result?: TResult) {
    if (this.dialogRef) {
      this.dialogRef.close(result);
      this.dialogRef = null;
    }
  }

  closeAll() {
    this.dialog.closeAll();
    this.dialogRef = null;
  }
}
