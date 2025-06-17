import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { RouterService } from '../../services/router.service';
import { LocalStorageService } from '../../services/local-storage.service';

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
  private readonly localStorageService = inject(LocalStorageService);

  totalCategory: string;

  sair() {
    this.localStorageService.clearAll();
    this.routerService.redirectionTo('home');
  }

  openDialogDeleteProduct(item?: any) {
    // const dialogRef = this.matDialog.open(UserComponent, {
    //   width: '900px',
    // });
    // dialogRef.afterClosed().subscribe((resp) => {
    //   if (resp) {
    //   }
    // });
  }

  getLengthCategory(lengthCategory: string) {
    this.totalCategory = lengthCategory;
  }

  redirecionarPagePrincipal() {
    this.routerService.redirectionTo('home');
  }
}
