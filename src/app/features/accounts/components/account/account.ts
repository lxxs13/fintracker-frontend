import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { AccountService } from '../../services/account';
import { IAccount, IAccountsListResponse } from '../../../../models/responses/IDebitAccountsResponse';
import { EAccountType, EAccountTypeMapperText, IDebitAccountGroup } from '../../../../enums/AccountTypes';
import { AddEditCardAccountComponent } from '../../dialogs/add-edit-card-account/add-edit-card-account';
import { CommonService } from '../../../../shared/services/common';
import { DataNotFoundComponent } from "../../../../shared/components/data-not-found/data-not-found";

@Component({
  selector: 'fintracker-account-component',
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    TabsModule,
    ButtonModule,
    ProgressBarModule,
    CurrencyPipe,
    DataNotFoundComponent
],
  templateUrl: './account.html',
  providers: [
    DialogService
  ]
})
export class AccountComponent implements OnInit {
  private _dialogService = inject(DialogService);
  private _accountService = inject(AccountService);
  private _commonService = inject(CommonService);

  selectedTab: number = 0;
  accountsBalanceTotal: number = 0;
  creditCardsBalance: number = 0;

  dialogRef: DynamicDialogRef | undefined;

  remappedAccountsList: IDebitAccountGroup[] = [];
  remappedCreditList: IAccount[] = [];

  ngOnInit(): void {
    this.getDebitsCard();
  }

  getDebitsCard(): void {
    this.remappedAccountsList = [];
    this.accountsBalanceTotal = 0;

    this._accountService.GetDebitCardsByUser().subscribe({
      next: (response: IAccountsListResponse) => {
        const { debitAccounts, creditAccounts } = response;

        const balanceCreditCards = creditAccounts.reduce((sum, creditAccounts) => sum + creditAccounts.currentBalance, 0);
        this.creditCardsBalance = balanceCreditCards;

        this.remappedCreditList = creditAccounts;

        const result = Object.groupBy(debitAccounts, ({ accountType }) => accountType);

        for (const key in result) {
          const typedKey = Number(key) as EAccountType;
          const mappedKey = EAccountTypeMapperText[typedKey];
          const accounts = result[key];

          if (mappedKey && accounts) {
            const totalBalance = accounts.reduce((sum, accounts) => sum + accounts.currentBalance, 0);

            this.accountsBalanceTotal += totalBalance;

            this.remappedAccountsList.push({
              type: mappedKey,
              accounts,
              totalBalance,
            });
          }
        }
      }
    });
  }

  show(action: string, type: number, item?: IAccount) {
    const header = type === 0 ? 'cuenta de débito' : 'tarjeta de crédito';

    this.dialogRef = this._dialogService.open(AddEditCardAccountComponent, {
      modal: true,
      closable: true,
      maximizable: true,
      draggable: true,
      width: '75rem',
      breakpoints: {
        '1199px': '75vw',
        '575px': '90vw'
      },
      header: `${action} ${header}`,
      data: {
        action,
        type,
        item,
      }
    });

    this.dialogRef.onClose.subscribe((response) => {
      if (response)
        this.getDebitsCard();
    })
  }

  getProgessValue(currentBalance: number, creditLimitCard: number) {
    //FIX: se recalcula en cada cambio del front
    return Math.round((currentBalance * 100) / creditLimitCard);
  }

  styleVars(card: IAccount) {
    const percentage = this.getProgessValue(card.currentBalance, card.card?.creditCardLimit!);

    if (percentage < 50) return { '--p-progressbar-value-background': 'oklch(72.3% 0.219 149.579)', '--p-progressbar-background': 'oklch(92.5% 0.084 155.995 / 0.2' };
    if (percentage < 80) return { '--p-progressbar-value-background': 'oklch(79.5% 0.184 86.047)', '--p-progressbar-background': 'oklch(94.5% 0.129 101.54 / 0.2)' };
    return { '--p-progressbar-value-background': 'oklch(63.7% 0.237 25.331)', '--p-progressbar-background': 'oklch(88.5% 0.062 18.334 / 0.2)' };
  }

}
