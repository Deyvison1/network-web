import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RouterService } from '../../services/router.service';
import { KeycloakService } from '../../services/keycloak.service';
import { environment } from '../../../environments/environment';

interface SimpleMenuItem {
  icon: string;
  label: string;
  tooltip?: string;
  function(): void;
}

interface SubMenuItem extends SimpleMenuItem {
  isSubmenu: true;
  children: SimpleMenuItem[];
}

type MenuItem = SimpleMenuItem | SubMenuItem;

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    RouterOutlet,
    MatTooltipModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  private readonly keycloakService = inject(KeycloakService);
  private readonly router = inject(RouterService);
  private readonly env = environment;

  nameApplication = 'Supreme Network Web';

  isLoggedIn = false;
  userName = '';

  itensMenu: MenuItem[] = [];
  itensMenuSideBar: MenuItem[] = [];

  openedSubmenus: { [key: string]: boolean } = {};

  isSmallScreen = signal(false);

  ngOnInit(): void {
    this.verificationLoggedIn();
    this.initItensMenu();
    this.initItensMenuSideBar();
  }

  initItensMenu(): void {
    this.itensMenu = [
      {
        icon: 'account_circle',
        label: 'Perfil',
        function: () => {
          this.redirectionToProfile();
        },
      },
      {
        icon: 'logout',
        label: 'Sair',
        function: () => {
          this.logout();
        },
      },
    ];
  }

  isSubmenuItem(item: MenuItem): item is SubMenuItem {
    return 'children' in item && Array.isArray(item.children);
  }

  redirectionToUrl(url: string): void {
    this.router.redirectionTo(url);
  }

  toggleSubmenu(menu: string): void {
    this.openedSubmenus[menu] = !this.openedSubmenus[menu];
  }

  isSubmenuOpen(menu: string): boolean {
    return this.openedSubmenus[menu];
  }

  initItensMenuSideBar(): void {
    this.itensMenuSideBar = [
      {
        icon: 'add_shopping_cart',
        label: 'Produtos',
        tooltip: 'Controle dos Planos',
        function: () => {
          this.redirectionToUrl('/product');
        },
      },
      {
        icon: 'category',
        label: 'Categorias',
        tooltip: 'Controle das Categorias',
        function: () => {
          this.redirectionToUrl('/category');
        },
      },
    ];
  }

  verificationLoggedIn(): void {
    this.getIsLoggedIn();

    if (this.isLoggedIn) {
      this.getInformationToken();
    }
  }

  redirectionToProfile(): void {
    globalThis.location.href = this.env.keycloakConfig.urlAccount;
  }

  getInformationToken(): void {
    const profile = this.keycloakService.getUserProfile();

    this.userName = profile?.username ?? '';
  }

  getInformationCompletToken() {
    return this.keycloakService.getDecodedToken();
  }

  getIsLoggedIn(): void {
    this.isLoggedIn = this.keycloakService.isLoggedIn();
  }

  login(): void {
    this.keycloakService.login();
  }

  logout(): void {
    this.keycloakService.logout();
  }
}
