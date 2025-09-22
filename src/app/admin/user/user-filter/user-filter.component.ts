import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  MatOptionModule,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ErroComponent } from '../../../components/erro/erro.component';
import { RoleService } from '../../../services/role.service';
import { NotificationService } from '../../../services/notification.service';
import { RoleDTO } from '../../../models/role.dto';
import { UserFilterDTO } from '../../../models/interfaces/user-filter.dto';

@Component({
  selector: 'app-user-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTooltipModule,
    ErroComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-filter.component.html',
  styleUrl: './user-filter.component.scss',
})
export class UserFilterComponent implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly notificationService = inject(NotificationService);
  form: FormGroup;
  fb = inject(FormBuilder);

  roles: RoleDTO[] = [];
  searchEvent = output<UserFilterDTO>();

  ngOnInit(): void {
    this.initForm();
    this.getRoles();
  }

  initForm() {
    this.form = this.fb.group({
      nick: [],
      roles: [],
      created: [],
    });
  }

  search() {
    let uuids: string[] = [];
    let nick = this.form.controls['nick'].value;
    let created = this.form.controls['created'].value;
    const rolesSelected: RoleDTO[] = this.form.controls['roles'].value;
    uuids = rolesSelected?.length ? rolesSelected.map((role) => role.uuid) : [];
    this.getUsers({
      nick: nick,
      uuids: uuids,
      created: created,
    });
  }

  getUsers(filters?: UserFilterDTO) {
    let filtersValidate: UserFilterDTO = {
      nick: filters?.nick,
      uuids: filters?.uuids,
      created: filters?.created,
    };
    this.searchEvent.emit(filtersValidate);
  }

  limpar() {
    this.form.reset();
    this.getUsers();
  }

  getRoles() {
    this.roleService.getAll().subscribe({
      next: (rolesDTO: RoleDTO[]) => {
        this.roles = rolesDTO;
      },
    });
  }

  getSelectedRolesLabel(): string {
    const selected: RoleDTO[] = this.form.get('roles')?.value;
    if (!selected || selected.length === 0) {
      return 'Nenhum papel selecionado';
    }

    if (selected.length <= 2) {
      // Se tem até 2 itens, mostra todos separados por vírgula
      return selected.map((r) => r.name).join(', ');
    }

    // Se tem mais que 2, mostra o primeiro e depois "... +X"
    return `${selected[0].name}... +${selected.length - 1}`;
  }

  getSelectedRolesMatTooltip() {
    const rolesSelected: RoleDTO[] = this.form?.controls['roles'].value;
    if (this.form.controls['roles'].value && rolesSelected.length > 2) {
      const namesRolesSelected: string[] = rolesSelected.map((r) => r.name);
      let rolesFormat: string = namesRolesSelected.join(', ');
      return rolesFormat;
    }
    return '';
  }
}
