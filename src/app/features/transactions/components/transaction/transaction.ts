import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, map, catchError, of } from 'rxjs';
import { TransactionTypeComponent } from '../../dialogs/transaction-type/transaction-type';
import { TransactionService } from '../../services/transaction';
import { ITransactionList, ITransactionsListResponse } from '../../../../models/responses/ITransactionsListResponse';
import { IconColorClassPipe } from '../../../../shared/pipes/icon-color-class-pipe';
import { CategoriesService } from '../../../settings/services/categories';
import { AccountService } from '../../../accounts/services/account';
import { CommonService } from '../../../../shared/services/common';
import { ICategories } from '../../../../models/responses/ICategoriesListResponse';
import { IAccount } from '../../../../models/responses/IDebitAccountsResponse';

@Component({
  selector: 'fintracker-transaction-component',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    ButtonModule,
    SelectButtonModule,
    DatePickerModule,
    AccordionModule,
    IconColorClassPipe,
  ],
  templateUrl: './transaction.html',
  styleUrl: './transaction.css',
  providers: [DialogService]
})
export class Transaction implements OnDestroy, OnInit {
  private _dialogService = inject(DialogService);
  private _transactionService = inject(TransactionService);
  private _categoriesServices = inject(CategoriesService);
  private _accountsService = inject(AccountService);
  private _commonService = inject(CommonService)

  dialogRef: DynamicDialogRef | undefined;

  transactionList: ITransactionList[] = [];

  categoriesFilter: ICategories[] = []
  categoryFilterSelected: any;

  debitAccountsFilter: IAccount[] = []
  debitAccountSelected: any;

  creditAccoutsFilter: IAccount[] = []
  creditAccountSelected: any;

  rangeDates: Date[] = [];

  totalTrasactions: number = 0;
  totalSpent: number = 0;

  ngOnInit(): void {
    this.getFilters();
    this.getTransactionsList();

    const today = new Date();
    const start = this.oneMonthAgoClamped(today);

    this.rangeDates = [start, today];
  }

  getTransactionsList(): void {
    this._transactionService.GetTransactions().subscribe({
      next: (response: ITransactionsListResponse) => {
        const { total, spentTotal, transactionList } = response;
        this.totalTrasactions = total;
        this.totalSpent = spentTotal;
        this.transactionList = transactionList;
      },
      error: (err) => {
        console.error(err);

      }
    });
  }

  getFilters(): void {
    forkJoin({
      accounts: this._accountsService.GetDebitCardsByUser(),
      categories: this._categoriesServices.GetCategoriesByUserId(),
    }).pipe(
      map(({ accounts, categories }) => {
        const debitAccounts: IAccount[] = accounts?.debitAccounts ?? [];
        const creditAccounts: IAccount[] = accounts?.creditAccounts ?? [];
        const categoriesIncome: ICategories[] = categories?.categoriesIncome ?? [];
        const categoriesSpent: ICategories[] = categories?.categoriesSpent ?? [];

        this.categoriesFilter = [...categoriesSpent, ...categoriesIncome];

        this.debitAccountsFilter = debitAccounts;
        this.creditAccoutsFilter = creditAccounts;

      }),
      catchError(err => {
        return of([]);
      }),
    ).subscribe();
  }

  ngOnDestroy(): void {

  }

  showDialog() {
    this.dialogRef = this._dialogService.open(TransactionTypeComponent, {
      modal: true,
      closable: true,
      maximizable: true,
      draggable: true,
      width: '50rem',
      header: 'Agregar transacción'
    });

    this.dialogRef.onClose.subscribe((response) => {
      if (response) {
        this._commonService.showMessage('Transacción creada', 'La tarnsacción se ha gaurdado correctamente', 'OK');
        this.getTransactionsList();
      }
    })
  }

  oneMonthAgoClamped(ref: Date): Date {
    const d = new Date(ref);
    const day = d.getDate();

    d.setDate(1);
    d.setMonth(d.getMonth() - 1);

    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    d.setDate(Math.min(day, lastDay));

    return d;
  }

  filterData(): void {
    console.log(this.debitAccountSelected)
  }
}
