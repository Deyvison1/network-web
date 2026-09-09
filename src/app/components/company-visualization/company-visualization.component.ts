import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewQrCodeComponent } from '../view-qr-code/view-qr-code.component';

@Component({
  selector: 'app-company-visualization',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './company-visualization.component.html',
  styleUrl: './company-visualization.component.scss',
})
export class CompanyVisualizationComponent {
  private readonly matDialog = inject(MatDialog);
  aboutTheCompany = input('');

  readonly highlights = [
    { icon: 'fa-bolt', label: 'Fibra óptica' },
    { icon: 'fa-headset', label: 'Suporte técnico' },
    { icon: 'fa-wifi', label: 'Wi-Fi estável' },
  ];

  openModalQrCode(): void {
    this.matDialog.open(ViewQrCodeComponent, {
      width: '420px',
      maxWidth: '95vw',
      panelClass: 'app-dialog',
    });
  }
}
