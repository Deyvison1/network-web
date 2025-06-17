import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { RouterService } from '../../services/router.service';
import { UserAuthService } from '../../services/user-auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CredenciaisDTO } from '../../models/credentials';
import { DragAndDropComponent } from "../../utils/drag-and-drop/drag-and-drop.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    DragAndDropComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly router = inject(RouterService);
  private readonly authService = inject(UserAuthService);
  titleDialog: string = 'Login';

  model: any = {};

  isLogado(): boolean {
    if (this.localStorageService.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  notification(msg: string) {
    this.notificationService.notificationSimple(msg);
  }

  redirectionTo(router: string) {
    if (router != '') {
      this.router.redirectionTo(router);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  btnEntrar() {
    this.cancel();
  }

  verificationLogin() {
    const req: CredenciaisDTO = {
      login: this.model.name,
      senha: this.model.senha,
    };

    this.authService.getToken(req).subscribe({
      complete: () => {},
      next: (res) => {
        if (res.token) {
          this.localStorageService.setItem('token', res.token);
          this.notification('Logado com sucesso.');
          this.redirectionTo('home-admin');
        }
      },
      error: (err) => {
        if (err.status == 401) {
          this.notification('Usuario e(ou) senha invalido.');
        }
      },
    });
    this.cancel();
  }
}
