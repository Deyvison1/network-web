import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {
  private readonly router = inject(RouterService);

  redirectionTo(path: string) {
    this.router.redirectionTo(path);
  }
}
