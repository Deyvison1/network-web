import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly matDialog = inject(MatDialog);
  private readonly routerService = inject(RouterService);

  totalCategory: string;

  sair() {
    localStorage.removeItem('token');
    this.redirectionToPath('/home');
  }



  getLengthCategory(lengthCategory: string) {
    this.totalCategory = lengthCategory;
  }

  redirectionToPath(path: string) {
    this.routerService.redirectionTo(path);
  }
}
