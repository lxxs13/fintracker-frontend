import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ITransactionsOptions } from '../../models/ITransactionsOptionsDTO';
import { ETransactionType } from '../../enums/TransactionsTypes';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _messageService = inject(MessageService);

  stateOptions: ITransactionsOptions[] = [
    { icon: 'pi-shopping-cart', label: 'Gasto', value: 1, desc: 'Registra una compra o un pago que hiciste, como supermercado, gasolina o restaurante.' },
    // { icon: 'pi-receipt', label: 'Pago', value: 2, desc: 'Registra un pago que necesites hacer, como suscripciones, renta o servicios.' },
    { icon: 'pi-arrow-right', label: 'Ingreso', value: 3, desc: 'Registra tu salario, bonos, freelance u otros ingresos que recibas.' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Transferencia', value: 4, desc: 'Registra movimientos entre cuentas, como transferencia de cuenta de cheques a ahorro.' },
    // { icon: 'pi-arrow-circle-left', label: 'Reembolso', value: 5, desc: 'Registra un reembolso o una devolución que recibiste, como la devolución de un producto o cashback.' },
    // { icon: 'pi-list-check', label: 'Compra a meses', value: 6, desc: 'Registra una compra a meses con tarjeta de crédito.' },
    // { icon: 'pi-credit-card', label: 'Pago de tarjeta', value: 7, desc: 'Registra un pago realizado a tu tarjeta de crédito.' },
  ];

  periods = [
    { label: 'Semanal', value: 'weekly' },
    { label: 'Cada 2 semanas', value: 'biweekly' },
    { label: 'Cada mes', value: 'monthly' },
  ];

  esLocale = {
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
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

  tokenExpired = (token: string): boolean => {
    return (Math.floor((new Date).getTime() / 1000)) >= this.timeToExpire(token);
  }

  timeToExpire(token: string) {
    return (JSON.parse(atob(token.split('.')[1]))).exp;
  }

  showMessage(summary: string, detail: string, status: string) {
    this._messageService.add({
      closable: true,
      severity: status === 'OK' ? 'success' : 'error',
      summary,
      detail,
      life: 5000,
      styleClass: 'p-toast-message-success'
    });
  }

  categoryTypeList(type: number): boolean {
    const allowed = [ETransactionType.SPENT, ETransactionType.PAYMENT, ETransactionType.PURCHASE_MONTHLY];
    return allowed.includes(type);
  }

  getDates(rangeDates: Date[]): { startDate: string, endDate: string } {
    let dates = { startDate: '', endDate: '' };

    const start = rangeDates[0];
    const end = rangeDates[1] ? rangeDates[1] : rangeDates[0];

    const pad = (n: number) => n.toString().padStart(2, '0');

    const startYear = start.getFullYear();
    const startMonth = pad(start.getMonth() + 1);
    const startDay = pad(start.getDate());

    const endYear = end.getFullYear();
    const endMonth = pad(end.getMonth() + 1);
    const endDay = pad(end.getDate());

    dates.startDate = `${startYear}/${startMonth}/${startDay}T00:00:00.000Z`;
    dates.endDate = `${endYear}/${endMonth}/${endDay}T23:59:59.999Z`;

    return dates;
  }

}
