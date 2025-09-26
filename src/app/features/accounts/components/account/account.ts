import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { AccountService } from '../../services/account';
import { IDebitAccountsResponse } from '../../../../models/responses/IDebitAccountsResponse';
import { EAccountType, EAccountTypeMapperText, IDebitAccountGroup } from '../../../../enums/AccountTypes';
import { AddEditCardAccountComponent } from '../../dialogs/add-edit-card-account/add-edit-card-account';

@Component({
  selector: 'fintracker-account-component',
  imports: [
    CardModule,
    DividerModule,
    TabsModule,
    ButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './account.html',
  providers: [
    DialogService
  ]
})
export class AccountComponent implements OnInit {
  private _dialogService = inject(DialogService);
  private _accountService = inject(AccountService);

  selectedTab: number = 0;
  balanceTotal: number = 0;

  dialogRef: DynamicDialogRef | undefined;

  remappedList: IDebitAccountGroup[] = [];

  ngOnInit(): void {
    this.getDebitsCard();
  }

  getDebitsCard(): void {
    this.remappedList = [];
    this._accountService.GetDebitCardsByUser().subscribe({
      next: (response: IDebitAccountsResponse[]) => {
        const result = Object.groupBy(response, ({ accountType }) => accountType);

        for (const key in result) {
          const typedKey = Number(key) as EAccountType;
          const mappedKey = EAccountTypeMapperText[typedKey];
          const accounts = result[key];

          if (mappedKey && accounts) {
            const totalBalance = accounts.reduce((sum, accounts) => sum + accounts.balance, 0);

            this.balanceTotal += totalBalance;

            this.remappedList.push({
              type: mappedKey,
              accounts,
              totalBalance,
            });
          }
        }
      }
    });
  }

  show(action: string, type: number) {
    const header = type === 0 ? 'cuenta de débito' : 'tarjeta de crédito';

    this.dialogRef = this._dialogService.open(AddEditCardAccountComponent, {
      modal: true,
      closable: true,
      maximizable: true,
      draggable: true,
      width: '50rem',
      header: `${action} ${header}`,
      data: {
        action,
        type,
      }
    });

    this.dialogRef.onClose.subscribe((response) => {
      if (response) this.getDebitsCard();
    })
  }

}
