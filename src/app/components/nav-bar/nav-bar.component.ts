import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { environment } from '../../../environments/environment';
import { KeycloakService } from '../../services/keycloak.service';

interface MenuItem {
  icon: string;
  label: string;
  tooltip: string;
  path: string;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatTooltipModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  @ViewChild('drawer') drawer?: MatSidenav;

  private readonly keycloakService = inject(KeycloakService);
  private readonly env = environment;

  readonly nameApplication = 'Supreme Network';
  isLoggedIn = false;
  userName = '';

  readonly menuItems: MenuItem[] = [
    {
      icon: 'home',
      label: 'Início',
      tooltip: 'Página inicial',
      path: '/home',
    },
    {
      icon: 'add_shopping_cart',
      label: 'Produtos',
      tooltip: 'Controle dos planos',
      path: '/product',
    },
    {
      icon: 'category',
      label: 'Categorias',
      tooltip: 'Controle das categorias',
      path: '/category',
    },
  ];

  ngOnInit(): void {
    this.isLoggedIn = this.keycloakService.isLoggedIn();
    this.userName = this.keycloakService.getUserProfile()?.username ?? '';
  }

  closeDrawer(): void {
    this.drawer?.close();
  }

  openProfile(): void {
    globalThis.location.href = this.env.keycloakConfig.urlAccount;
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
