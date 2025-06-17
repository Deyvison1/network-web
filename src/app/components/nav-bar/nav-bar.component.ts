import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../admin/login/login.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  private readonly dialogService = inject(MatDialog);
  nameApplication = 'Supreme Network Web';

  openDialog() {
    this.dialogService.open(LoginComponent, {
      width: '400px',
    });
  }
}