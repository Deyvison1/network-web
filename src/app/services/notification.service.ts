import { HttpErrorResponse } from '@angular/common/http';
import { ActionTypeNotification } from './../consts/enums/action-type-notification.enum';
import { inject, Injectable } from '@angular/core';

import { ActiveToast, IndividualConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly toastr = inject(ToastrService);

  notification(
    message: string,
    actionTypeNotification: ActionTypeNotification,
    title?: string
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
          'Falha ao chamar o notificação. Não foi identificado nenhum parametro sobre o tipo de notificação.'
        , 'Falha');
        break;
    }
  }

  static getError(error: any) {
    let errorMessage = 'Erro desconhecido';

    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'string') {
        // Quando o backend retorna um texto simples como mensagem de erro
        errorMessage = error.error;
      } else if (error.error?.message) {
        // Quando o backend retorna um objeto com uma propriedade `message`
        errorMessage = error.error.message;
      } else {
        // Fallback para status + statusText
        errorMessage = `Erro ${error.status}: ${error.statusText}`;
      }
    }
    return errorMessage;
  }
}
