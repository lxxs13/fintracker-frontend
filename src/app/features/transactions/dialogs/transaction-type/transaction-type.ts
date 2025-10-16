import { DatePickerModule } from 'primeng/datepicker';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TransactionService } from '../../services/transaction';
import { ICategories } from '../../../../models/responses/ICategoriesListResponse';
import { ITransactionDTO } from '../../../../models/DTOS/ITransactionDTO';
import { AccountService } from '../../../accounts/services/account';
import { CommonService } from '../../../../shared/services/common';
import { CategoriesListComponent } from '../../../../shared/components/categories-list/categories-list';
import { ETransactionType } from '../../../../enums/TransactionsTypes';

@Component({
  selector: 'fintracker-transaction-type',
  imports: [
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    DividerModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    CategoriesListComponent,
    ToggleSwitchModule,
  ],
  templateUrl: './transaction-type.html',
  providers: [DialogService]
})
export class TransactionTypeComponent implements OnInit {
  private _dialogService = inject(DynamicDialogRef);
  private _transtactionService = inject(TransactionService);
  private _commonService = inject(CommonService);
  private _accountsService = inject(AccountService);
  private _dialogConfig = inject(DynamicDialogConfig);

  balance: number | undefined;
  spentDate: Date | undefined;

  accountsGroup: any[] = [];
  selectedAccount: any;
  selectedAccountDestiny: any;

  options = this._commonService.stateOptions;

  selectedCategory: ICategories | undefined;

  dialogRef: DynamicDialogRef | undefined;

  notes: string = '';
  value: string = '';
  desc: string = '';

  transactionType: number = 0;

  isRecurring: boolean = false;

  recurringPeriods = this._commonService.periods;
  selectedRecurringPeriod: any;

  ngOnInit(): void {
    this.spentDate = new Date();
    this.transactionType = this._dialogConfig.data.transactionType;

    this._accountsService.GetDebitCardsByUser().subscribe({
      next: (response) => {
        const { debitAccounts, creditAccounts } = response;

        this.accountsGroup.push({
          label: 'Cuentas de débito',
          items: debitAccounts.map((element) => element)
        });

        this.accountsGroup.push({
          label: 'Tarjetas de crédito',
          items: creditAccounts.map((element) => element)
        });

        this.accountsGroup = this.accountsGroup.map(group => ({
          ...group,
          items: group.items.map(({ accountName, ...rest }: any) => ({
            ...rest,
            label: accountName
          }))
        }));
      }
    });
  }

  closeDialog(): void {
    this._dialogService.close(false);
  }

  saveChanges(): void {
    switch (this.transactionType) {
      case ETransactionType.INCOME:
      case ETransactionType.SPENT:
        this.createIncomeSpentTransfer();
        break;
      case ETransactionType.TRANSFER:
        this.createTransferTransaction();
        break;
    }
  }

  createIncomeSpentTransfer(): void {
    const body: ITransactionDTO = {
      balance: this.balance!,
      description: this.desc,
      transactionDate: this.spentDate!,
      categoryId: this.selectedCategory?._id!,
      accountId: this.selectedAccount?._id!,
      transactionType: this.transactionType,
      notes: this.notes,
    };

    this._transtactionService.createIncomeSpentTransaction(body).subscribe({
      next: (response) => {
        if (response) {
          this._dialogService.close(true);
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  createTransferTransaction(): void {
    const body: ITransactionDTO = {
      balance: this.balance!,
      description: this.desc,
      transactionDate: this.spentDate!,
      categoryId: this.selectedCategory?._id!,
      originAccount: this.selectedAccount?._id!,
      destinyAccount: this.selectedAccountDestiny._id!,
      transactionType: this.transactionType,
      notes: this.notes,
    };

    this._transtactionService.createTransferTransaction(body).subscribe({
      next: (response) => {
        if (response) {
          this._dialogService.close(true);
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  get ETransactionType(): typeof ETransactionType {
    return ETransactionType;
  }
}
