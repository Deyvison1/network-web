import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-qr-code',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './view-qr-code.component.html',
  styleUrl: './view-qr-code.component.scss',
})
export class ViewQrCodeComponent {
  constructor(private readonly dialogRef: MatDialogRef<ViewQrCodeComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
