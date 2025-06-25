import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserAuthService } from '../../services/user-auth.service';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserDTO } from '../../models/user.dto';
import { NotificationService } from '../../services/notification.service';
import { ErroComponent } from '../../components/erro/erro.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    ErroComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly userService = inject(UserAuthService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  form: FormGroup;
  userName: string = '';
  isActiveEditForm: boolean = false;

  ngOnInit(): void {
    this.findByLogin();
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      id: [],
      login: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      senha: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
    });
  }

  editProfile() {
    this.isActiveEditForm = !this.isActiveEditForm;
    if (this.isActiveEditForm) {
      this.form.enable();
    } else {
      this.form.disable();
    }
  }

  save() {
    const user: UserDTO = this.form.value;
    this.userService.editUserPartial(user).subscribe({
      next: (resp) => {
        this.editProfile();
        this.notificationService.notificationSimple(
          'Usuário atualizado com sucesso!'
        );
      },
    });
  }

  findByLogin() {
    const userName = this.authService.decodePayloadJWT().sub;
    this.userName = userName;
    this.userService.findByLogin(userName).subscribe({
      next: (resp) => {
        this.form.patchValue({
          login: resp.login,
          id: resp.id,
        });
        this.form.disable();
      },
    });
  }
}
