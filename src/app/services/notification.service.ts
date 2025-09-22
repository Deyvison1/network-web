import { HttpErrorResponse } from '@angular/common/http';
import { ActionTypeNotification } from './../consts/enums/action-type-notification.enum';
import { inject, Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  notification(
    message: string,
    actionTypeNotification: ActionTypeNotification
  ) {
    switch (actionTypeNotification) {
      case ActionTypeNotification.ERRO:
        this.toastr.error(message, 'Aconteceu algo inesperado.');
        break;
      case ActionTypeNotification.SUCCESS:
        this.toastr.success(message);
        break;
      case ActionTypeNotification.INFO:
        this.toastr.info(message, 'Informação');
        break;
      case ActionTypeNotification.WARNING:
        this.toastr.warning(message, 'Aviso');
        break;
      default:
        this.toastr.warning(
          'Falha ao chamar o notificação. Não foi identificado nenhum parametro sobre o tipo de notificação.',
          'Falha'
        );
        break;
    }
  }

  static getError(error: any): string {
    let errorMessage = 'Erro desconhecido';

    if (error instanceof HttpErrorResponse) {
      if (typeof error.error === 'string') {
        // Backend retornou uma string simples
        errorMessage = error.error;
      } else if (Array.isArray(error.error)) {
        // Backend retornou uma lista de mensagens (string[])
        errorMessage = error.error.join('\n');
      } else if (error.error?.errors && Array.isArray(error.error.errors)) {
        // Backend retornou objeto com lista de erros (ex: { errors: [...] })
        errorMessage = error.error.errors.join('\n');
      } else if (error.error?.message) {
        // Objeto com uma mensagem padrão
        errorMessage = error.error.message;
      } else {
        // Fallback para status + statusText
        errorMessage = `Erro ${error.status}: ${error.statusText}`;
      }
    }

    return errorMessage;
  }
}
