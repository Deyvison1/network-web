import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../../admin/login/login.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import InformationsTokenDTO from '../../models/interfaces/informations-token.dto';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  private readonly dialogService = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly router = inject(RouterService);
  nameApplication = 'Supreme Network Web';
  isLoggedIn: boolean;
  userName: string;

  ngOnInit(): void {
    this.verificationLoggedIn();
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

    dialog.afterClosed().subscribe(
      (resp) => {
        this.verificationLoggedIn();
      }
    );
  }

  redirectionToProfile() {
    this.router.redirectionTo('/user');
  }

  getInformationToken() {
    const token: InformationsTokenDTO = this.authService.decodePayloadJWT();
    this.userName = token.sub;
  }

  getIsLoggedIn() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.verificationLoggedIn();
  }
}
