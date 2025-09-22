import { RoleFilterDTO } from './../../../models/interfaces/role-filter.dto';
import { CommonModule } from '@angular/common';
import { Component, effect, inject, OnInit } from '@angular/core';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleService } from '../../../services/role.service';
import { DialogService } from '../../../services/dialog.service';
import { PageConfig } from '../../../models/interfaces/page.config';
import { pageCommons } from '../../../consts/page.commons';
import { HttpResponse } from '@angular/common/http';
import { PageResponseDTO } from '../../../models/interfaces/page-response.dto';
import { RoleDTO } from '../../../models/role.dto';
import { MatTableDataSource } from '@angular/material/table';
import { RoleFilterComponent } from './role-filter/role-filter.component';
import { ActionTypeNotification } from '../../../consts/enums/action-type-notification.enum';
import { ActionTypeBodyDTO } from '../../../models/interfaces/action-type-body.dto';
import { ActionType } from '../../../consts/enums/action-type.enum';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, RoleListComponent, RoleFilterComponent],
  templateUrl: './role.component.html',
})
export class RoleComponent {
  private readonly roleService = inject(RoleService);
  private readonly dialogService = inject(DialogService);
  private readonly notificationService = inject(NotificationService);
  pageCommons: PageConfig = pageCommons;
  dataSource = new MatTableDataSource<RoleDTO>();
  totalItens: string;

  constructor() {
    effect(() => {
      const actionRole = this.roleService.roleUpdates$();
      if (actionRole) {
        this.save(actionRole);
      }
    });
  }

  refreshData(request: { pageConfig: PageConfig; filters?: RoleFilterDTO }) {
    this.roleService
      .getRolePagination(request.pageConfig, request.filters)
      .subscribe({
        next: (resp: HttpResponse<PageResponseDTO<RoleDTO[]>>) => {
          this.dataSource = new MatTableDataSource(resp.body.content);
          this.totalItens = resp.body.page.totalElements.toString();
        },
      });
  }

  search(filters?: RoleFilterDTO) {
    this.refreshData({ pageConfig: this.pageCommons, filters });
  }

  delete(userId: string) {
    this.roleService.delete(userId).subscribe({
      next: () => {
        this.refreshData({
          pageConfig: this.pageCommons,
        });
        this.notificationService.notification(
          'Deletado com sucesso',
          ActionTypeNotification.SUCCESS
        );
      },
    });
  }

  save(actionUserDTO: ActionTypeBodyDTO<RoleDTO>) {
    if (actionUserDTO.actionType === ActionType.INSERT) {
      this.add(actionUserDTO.body);
    } else {
      this.update(actionUserDTO.body);
    }
  }

  add(role: RoleDTO) {
    this.roleService.insert(role).subscribe({
      next: (res) => {
        this.notificationService.notification(
          'Cadastrado com sucesso',
          ActionTypeNotification.SUCCESS
        );
        this.close();
        this.refreshData({
          pageConfig: this.pageCommons,
        });
      },
    });
  }

  update(role: RoleDTO) {
    this.roleService.update(role.uuid, role).subscribe({
      next: (res) => {
        this.notificationService.notification(
          'Atualizado com sucesso',
          ActionTypeNotification.SUCCESS
        );
        this.close();
        this.refreshData({
          pageConfig: this.pageCommons,
        });
      },
    });
  }

  close() {
    this.dialogService.close();
  }
}
