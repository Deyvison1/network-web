import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  private readonly verticalPosition: MatSnackBarVerticalPosition = 'top';

  notificationSimple(msg: string) {
    this.snackBar.open(msg, 'OK', {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ['green-snackbar']
    });
  }

  notificationComplet(msg: string, action: string, duration: number) {
    this.snackBar.open(msg, action, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
