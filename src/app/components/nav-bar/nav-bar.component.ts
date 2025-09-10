import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../admin/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import InformationsTokenDTO from '../../models/interfaces/informations-token.dto';
import { RouterService } from '../../services/router.service';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatDialogModule,
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
  private readonly dialogService = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(RouterService);
  private readonly roles: string[] = ['ADMIN', 'USER'];
  nameApplication = 'Supreme Network Web';
  isLoggedIn: boolean;
  userName: string;
  itensMenu: MenuItem[] = [];
  itensMenuSideBar: MenuItem[] = [];

  openedSubmenus: { [key: string]: boolean } = {};
  isSmallScreen = signal(false);

  ngOnInit(): void {
    this.verificationLoggedIn();
    this.initItensMenu();
    this.initItensMenuSideBar();
  }

  initItensMenu() {
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

  redirectionToUrl(url: string) {
    this.router.redirectionTo(url);
  }

  toggleSubmenu(menu: string) {
    this.openedSubmenus[menu] = !this.openedSubmenus[menu];
  }

  isSubmenuOpen(menu: string): boolean {
    return this.openedSubmenus[menu];
  }

  initItensMenuSideBar() {
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
      {
        icon: 'group',
        label: 'Usuários',
        tooltip: 'Controle dos Usuários',
        function: () => {
          this.redirectionToUrl('/user');
        },
        isSubmenu: true,
        children: [
          {
            label: 'Usuários',
            icon: 'group',
            tooltip: 'Gerenciar usuarios',
            function: () => this.redirectionToUrl('/user'),
          },
          {
            label: 'Papeis',
            icon: 'list',
            tooltip: 'Visualizar usuários',
            function: () => this.redirectionToUrl('/role'),
          },
        ],
      },
    ];
  }

  verificationLoggedIn() {
    this.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.getInformationToken();
    }
  }

  openDialog() {
    const dialog = this.dialogService.open(LoginComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((resp) => {
      this.verificationLoggedIn();
    });
  }

  redirectionToProfile() {
    this.router.redirectionTo('/profile');
  }

  getInformationToken() {
    const token: InformationsTokenDTO = this.authService.decodePayloadJWT();
    this.userName = token.sub;
  }

  getInformationCompletToken(): InformationsTokenDTO {
    return this.authService.decodePayloadJWT();
  }

  getIsLoggedIn() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.verificationLoggedIn();
  }
}
