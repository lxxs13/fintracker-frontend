import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select'
import { FloatLabelModule } from 'primeng/floatlabel'
import { InputOtpModule } from 'primeng/inputotp';
import { ICreditAccountDTO, IDebitAccountDTO } from '../../../../models/DTOS/ICardDTO';
import { AccountService } from '../../services/account';
import { EAccountType } from '../../../../enums/AccountTypes';
import { IAccount } from '../../../../models/responses/IDebitAccountsResponse';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../shared/services/common';

@Component({
  selector: 'fintracker-add-edit-card-account',
  imports: [
    FormsModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    DividerModule,
    ButtonModule,
    SelectModule,
    FloatLabelModule,
    InputNumberModule,
    InputOtpModule,
    ConfirmPopupModule,
  ],
  templateUrl: './add-edit-card-account.html',
  styleUrl: './add-edit-card-account.css',
  providers: [ConfirmationService]
})
export class AddEditCardAccountComponent implements OnInit {
  private _confirmationService = inject(ConfirmationService);
  private _accountService = inject(AccountService);
  private _config = inject(DynamicDialogConfig);
  private _commonService = inject(CommonService);

  public dialogService = inject(DynamicDialogRef);

  accountsType = [
    {
      id: 1,
      name: 'Efectivo',
    },
    {
      id: 2,
      name: 'Cheques',
    },
    {
      id: 3,
      name: 'Ahorro',
    },
  ];

  balance: number | undefined;
  lastDigits: number | undefined;
  creditCardLimit: number | undefined;
  APR: number | undefined;
  paymentDueDay: number | undefined;
  statementCloseDay: number | undefined;
  selectedAccountType: number = 0;
  description: string = '';
  action: string = '';
  type: number = 0;

  item: IAccount | undefined;

  ngOnInit(): void {
    const { action, type, item } = this._config.data;

    this.action = action;
    this.type = type;
    this.item = item;

    if (this.action === 'Editar' && this.item)
      this.loadDataInForm();
  }

  loadDataInForm(): void {
    const {
      accountName,
      accountType,
      currentBalance,
      card
    } = this.item as IAccount;

    this.balance = currentBalance;
    this.description = accountName;
    this.selectedAccountType = accountType;

    if (!card) return;

    const {
      APR,
      accountId,
      creditCardLimit,
      lastDigits,
      paymentDay,
      statementCloseDay
    } = card;

    this.APR = APR;
    this.creditCardLimit = creditCardLimit;
    this.lastDigits = +lastDigits;
    this.paymentDueDay = paymentDay;
    this.statementCloseDay = statementCloseDay;
  }

  saveChanges(): void {
    if (this.type === 0) {
      this.item?._id ? this.updateDebitCard() : this.saveDebitCard();
    } else if (this.type === 1) {
      this.item?._id ? this.updateCreditCard() : this.saveCreditCard();
    }
  }

  saveCreditCard(): void {
    const body: ICreditAccountDTO = {
      balance: this.balance ?? 0,
      description: this.description,
      accountType: EAccountType.CREDITO,
      lastDigits: +this.lastDigits!,
      APR: this.APR!,
      limitCreditCard: this.creditCardLimit!,
      paymentDay: this.paymentDueDay!,
      statementCloseDay: this.statementCloseDay!,
    };

    this._accountService.CreateCreditCard(body).subscribe({
      next: (response) => {
        if (!response) return; //FIX: AGREGAR MENSAJES DE ERROR

        this._commonService.showMessage('Cuenta creada con éxito', 'La cuenta de débito se ha agregado correctamente', 'ok');

        this.dialogService.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  saveDebitCard(): void {
    if (!this.balance) return;

    if (!this.accountsType) return;

    const body: IDebitAccountDTO = {
      balance: this.balance,
      description: this.description,
      accountType: +this.selectedAccountType
    };

    this._accountService.CreateDebitCard(body).subscribe({
      next: (response) => {
        if (!response) return; //FIX: AGREGAR MENSAJES DE ERROR

        this._commonService.showMessage('Cuenta creada con éxito', 'La cuenta de débito se ha agregado correctamente', 'ok');

        this.dialogService.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateDebitCard(): void {
    if (!this.balance) return;

    if (!this.accountsType) return;

    if (!this.item?._id) return;

    const body: IDebitAccountDTO = {
      balance: this.balance,
      description: this.description,
      accountType: +this.selectedAccountType
    };

    this._accountService.UpdateDebitCard(this.item._id, body).subscribe({
      next: (response) => {
        if (!response) return; //FIX: AGREGAR MENSAJES DE ERROR

        this._commonService.showMessage('Cuenta actualizada con éxito', 'La cuenta de débito se ha agregado correctamente', 'ok');

        this.dialogService.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  updateCreditCard(): void {
    if (!this.balance) return;

    if (!this.accountsType) return;

    if (!this.item?._id) return;

    const body: ICreditAccountDTO = {
      balance: this.balance,
      description: this.description,
      accountType: +this.selectedAccountType,
      APR: this.APR!,
      lastDigits: this.lastDigits!,
      limitCreditCard: this.creditCardLimit!,
      paymentDay: this.paymentDueDay!,
      statementCloseDay: this.statementCloseDay!,
    };

    this._accountService.UpdateCreditCard(this.item._id, body).subscribe({
      next: (response) => {
        if (!response) return; //FIX: AGREGAR MENSAJES DE ERROR

        this._commonService.showMessage('Cuenta actualizada con éxito', 'La cuenta de débito se ha agregado correctamente', 'ok');

        this.dialogService.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  showDialogDelete(event: Event): void {
    this._confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: '¿Deseas eliminar esta cuenta?',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sí, eliminar.',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.handleDeleteItem();
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
      },
    });
  }

  handleDeleteItem(): void {
    if (!this.item?._id) {
      this._commonService.showMessage(
        'Error al obtener la información de la cuenta',
        'No se ha logrado obtener el ID de la cuenta.',
        'ERROR');

      return;
    }

    this._accountService.DeleteAccount(this.item._id).subscribe({
      next: (response: boolean) => {
        if (!response) {
          this._commonService.showMessage(
            'Error al obtener la información de la cuenta',
            'No se ha logrado obtener el ID de la cuenta.',
            'ERROR');

          return;
        }

        this._commonService.showMessage(
          'Cuenta eliminada',
          'La cuenta se ha eliminado correctamente.',
          'OK');

        this.dialogService.close(true);
      },
      error: (err) => {
        this._commonService.showMessage(
          'Error en la operación',
          err.error.message,
          'ERROR');

        return;
      }
    })
  }
}
