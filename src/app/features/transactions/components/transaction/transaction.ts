import { ITransactionsFilterDTO } from './../../../../models/ITransactionsFilterDTO';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AccordionModule } from 'primeng/accordion';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin, map, catchError, of, finalize } from 'rxjs';
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
    MenuModule,
    TooltipModule,
    SkeletonModule,
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

  transactionTypes: any[] = [];

  rangeDates: Date[] = [];

  transactionTypeSelected: string = '';

  totalTrasactions: number = 0;
  totalSpent: number = 0;

  isLoading: boolean = false;

  transactionItems: MenuItem[] = [];

  ngOnInit(): void {
    this.getFilters();
    this.getTransactionsList();
    this.initTransacionTypesList();

    const today = new Date();
    const start = this.oneMonthAgoClamped(today);

    this.rangeDates = [start, today];
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  initTransacionTypesList(): void {
    this._commonService.stateOptions.forEach(option => {
      this.transactionItems.push({
        desc: option.desc,
        icon: option.icon,
        label: option.label,
        command: () => {
          this.transactionTypeSelected = option.value;
          this.showDialog()
        },
      })
    });
  }

  getTransactionsList(filter?: ITransactionsFilterDTO): void {
    this.isLoading = true;

    this._transactionService.GetTransactions(filter).subscribe({
      next: (response: ITransactionsListResponse) => {
        const { total, spentTotal, transactionList } = response;
        this.totalTrasactions = total;
        this.totalSpent = spentTotal;
        this.transactionList = transactionList;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        setTimeout(() => {
          this.isLoading = false;
        }, 625);
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

  showDialog() {
    this.dialogRef = this._dialogService.open(TransactionTypeComponent, {
      modal: true,
      // maskStyleClass: 'backdrop-blur-sm',
      closable: true,
      maximizable: true,
      draggable: true,
      width: '50rem',
      header: 'Agregar transacción',
      data: {
        transactionType: this.transactionTypeSelected
      },
    });

    this.dialogRef.onClose.subscribe((response) => {
      if (response) {
        this._commonService.showMessage('Transacción creada', 'La transacción se ha gaurdado correctamente', 'OK');
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
    const { startDate, endDate } = this.getDates();

    const filters: ITransactionsFilterDTO = {
      startDate,
      endDate,
    }

    this.getTransactionsList(filters);
  }

  getDates(): { startDate: string, endDate: string } {
    let dates = { startDate: '', endDate: '' };

    const start = this.rangeDates[0];
    const end = this.rangeDates[1];

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
