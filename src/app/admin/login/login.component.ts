import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { RouterService } from '../../services/router.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragAndDropComponent } from '../../components/drag-and-drop/drag-and-drop.component';
import { FormUtil } from '../../utils/form.utils';
import { LoginDTO } from '../../models/login.dto';
import { requiredsCommons } from '../../consts/requireds.commons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    DragAndDropComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef);
  private readonly router = inject(RouterService);
  readonly authService = inject(AuthService);
  private readonly requiredsCommons = requiredsCommons;

  titleDialog: string = 'Login';
  form: FormGroup;

  ngOnInit(): void {
    this.form = FormUtil.buildForm(
      Object.keys(new LoginDTO()),
      this.requiredsCommons.requiredLogin
    );
  }

  notification(msg: string) {
    this.notificationService.notificationSimple(msg);
  }

  redirectionTo(router: string) {
    if (router != '') {
      this.router.redirectionTo(router);
      this.cancel();
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  btnEntrar() {
    this.cancel();
  }

  verificationLogin() {
    const req: LoginDTO = this.form.value;

    this.authService.login(req).subscribe({
      complete: () => {},
      next: (res) => {
        if (res.body.accessToken) {
          localStorage.setItem('token', res.body.accessToken);
          this.notification('Logado com sucesso.');
          this.redirectionTo('home-admin');
        }
        this.cancel();
      },
      error: (err) => {
        if (err.status == 401) {
          this.notification('Usuario e(ou) senha invalido.');
        }
        this.cancel();
      },
    });
  }
}
