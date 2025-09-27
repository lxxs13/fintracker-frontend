import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TransactionDetailComponent } from "../../components/transaction-detail/transaction-detail";

@Component({
  selector: 'fintracker-transaction-type',
  imports: [
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    TabsModule,
    DividerModule,
    ScrollPanelModule,
    TransactionDetailComponent
],
  templateUrl: './transaction-type.html',
  styleUrl: './transaction-type.css',
  providers: [DialogService]
})
export class TransactionType {
  private _dialogService = inject(DynamicDialogRef);

  stateOptions: any[] = [
    { icon: 'pi-shopping-cart', label: 'Gasto', value: 'spent', desc: 'Registra una compra o un pago que hiciste, como supermercado, gasolina o restaurante.' },
    { icon: 'pi-receipt', label: 'Pago', value: 'payment', desc: 'Registra un pago que necesites hacer, como suscripciones, renta o servicios.' },
    { icon: 'pi-arrow-right', label: 'Ingreso', value: 'incomnig', desc: 'Registra tu salario, bonos, freelance u otros ingresos que recibas.' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Transferencia', value: 'transfer', desc: 'Registra movimientos entre cuentas, como transferencia de cuenta de cheques a ahorro.' },
    { icon: 'pi-arrow-circle-left', label: 'Reembolso', value: 'refound', desc: 'Registra un reembolso o una devolución que recibiste, como la devolución de un producto o cashback.' },
    { icon: 'pi-list-check', label: 'Compra a meses', value: 'purshaseMonthly', desc: 'Registra una compra a meses con tarjeta de crédito.' },
    { icon: 'pi-credit-card', label: 'Pago de tarjeta', value: 'cardPayment', desc: 'Registra un pago realizado a tu tarjeta de crédito.' },
  ];

  tabIndexSelected: number = 0;

  dialogRef: DynamicDialogRef | undefined;

  value: string = '';

  saveChanges(): void {

  }

  nextStep(): void {
    this.tabIndexSelected = 1;
  }

  goBack(): void {
    if (this.tabIndexSelected === 1)
      this.tabIndexSelected = 0;
    else if (this.tabIndexSelected === 0)
      this._dialogService.close(false);
  }
}
