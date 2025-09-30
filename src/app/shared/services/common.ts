import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _messageService = inject(MessageService);

  showMessage(summary: string, detail: string, status: string) {
    this._messageService.add({
      closable: true,
      severity: 'success',
      summary,
      detail,
      life: 5000,
      styleClass: 'p-toast-message-success'
    });

  }

}
