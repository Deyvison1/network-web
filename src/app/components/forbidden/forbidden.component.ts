import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss',
})
export class ForbiddenComponent {
  private readonly router = inject(RouterService);

  goHome(): void {
    this.router.redirectionTo('/home');
  }
}
