import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TransactionType } from '../../dialogs/transaction-type/transaction-type';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'fintracker-transaction-component',
  imports: [
    CardModule,
    ButtonModule
  ],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
  providers: [DialogService]
})
export class Transaction {
  private _dialogService = inject(DialogService);
  dialogRef: DynamicDialogRef | undefined;

  showDialog() {
    this.dialogRef = this._dialogService.open(TransactionType, {
          modal: true,
          closable: true,
          maximizable: true,
          draggable: true,
          width: '50rem',
          header: 'Agregar transacción'
        });

        this.dialogRef.onClose.subscribe((response) => {

        })
  }
}
