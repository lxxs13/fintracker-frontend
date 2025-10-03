import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _messageService = inject(MessageService);

  stateOptions: any[] = [
    { icon: 'pi-shopping-cart', label: 'Gasto', value: 'spent', desc: 'Registra una compra o un pago que hiciste, como supermercado, gasolina o restaurante.' },
    { icon: 'pi-receipt', label: 'Pago', value: 'payment', desc: 'Registra un pago que necesites hacer, como suscripciones, renta o servicios.' },
    { icon: 'pi-arrow-right', label: 'Ingreso', value: 'incomnig', desc: 'Registra tu salario, bonos, freelance u otros ingresos que recibas.' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Transferencia', value: 'transfer', desc: 'Registra movimientos entre cuentas, como transferencia de cuenta de cheques a ahorro.' },
    { icon: 'pi-arrow-circle-left', label: 'Reembolso', value: 'refound', desc: 'Registra un reembolso o una devolución que recibiste, como la devolución de un producto o cashback.' },
    { icon: 'pi-list-check', label: 'Compra a meses', value: 'purshaseMonthly', desc: 'Registra una compra a meses con tarjeta de crédito.' },
    { icon: 'pi-credit-card', label: 'Pago de tarjeta', value: 'cardPayment', desc: 'Registra un pago realizado a tu tarjeta de crédito.' },
  ];

  esLocale = {
    dayNames: ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],
    dayNamesShort: ['dom','lun','mar','mié','jue','vie','sáb'],
    dayNamesMin: ['D','L','M','X','J','V','S'],
    monthNames: [
      'enero','febrero','marzo','abril','mayo','junio',
      'julio','agosto','septiembre','octubre','noviembre','diciembre'
    ],
    monthNamesShort: ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    weekHeader: 'Sm',
    firstDayOfWeek: 1,
    dateFormat: 'dd/mm/yy'
  };

  welcomeMessages: string[] = [
    'Es un placer tenerte con nosotros, ',
    'Hola, ',
    'Que bueno verte, ',
    'Bienvenido, ',
  ];

  periodOfTime = [
    { id: 1, title: 'Esta semana' },
    { id: 2, title: 'Este mes' },
    { id: 3, title: 'Este año' },
  ];

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

  categoryTypeList(type: string): boolean {
    const allowed = ['spent', 'payment', 'purshaseMonthly'];
    return allowed.includes(type);
  }

}
