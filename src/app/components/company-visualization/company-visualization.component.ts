import { Component, inject, input, InputSignal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ViewQrCodeComponent } from '../view-qr-code/view-qr-code.component';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-visualization',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatCardModule],
  templateUrl: './company-visualization.component.html',
  styleUrl: './company-visualization.component.scss',
})
export class CompanyVisualizationComponent {
  private readonly matDialog = inject(MatDialog);
  aboutTheCompany: InputSignal<string> = input('');

  openModalQrCode() {
    this.matDialog.open(ViewQrCodeComponent, {
      width: '800',
      height: '800',
    });
  }
}
