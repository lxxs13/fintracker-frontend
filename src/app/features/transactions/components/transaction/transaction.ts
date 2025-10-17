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
import { SplitButtonModule } from 'primeng/splitbutton';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
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
import { DataNotFoundComponent } from "../../../../shared/components/data-not-found/data-not-found";
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'fintracker-transaction-component',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    ButtonModule,
    SelectButtonModule,
    DatePickerModule,
    SplitButtonModule,
    AccordionModule,
    MenuModule,
    TooltipModule,
    SkeletonModule,
    SelectModule,
    MultiSelectModule,
    FloatLabelModule,
    IconColorClassPipe,
    DataNotFoundComponent,
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

  transactionTypes: any[] = [];

  rangeDates: Date[] = [];

  transactionTypeSelected: number = 0;

  totalTrasactions: number = 0;
  totalSpent: number = 0;
  cardPaymentsTotal: number = 0;
  transactionsTotal: number = 0;
  totalIncome: number = 0;

  isLoading: boolean = false;

  transactionItems: MenuItem[] = [];

  accountsGroup: any[] = [];
  selectedAccount: any;

  defaultDate: Date = new Date();

  ngOnInit(): void {
    this.getFilters();
    this.getTransactionsList();
    this.initTransacionTypesList();

    const today = new Date();
    const start = this._commonService.oneMonthAgoClamped(today);

    this.rangeDates = [start, today];
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  getAbsAmount = (amount: number) => {
    return Math.abs(amount)
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

    this._transactionService.getTransactions(filter).subscribe({
      next: (response: ITransactionsListResponse) => {
        const {
          totalDocuments,
          spentTotal,
          incomeTotal,
          cardPaymentsTotal,
          transactionsTotal,
          transactionList
        } = response;

        this.totalTrasactions = totalDocuments;
        this.totalSpent = spentTotal;
        this.totalIncome = incomeTotal;
        this.cardPaymentsTotal = cardPaymentsTotal;
        this.transactionsTotal = transactionsTotal;
        this.transactionList = transactionList;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
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
        const otherCategories: ICategories[] = categories.othersCategories ?? [];

        if (debitAccounts.length > 0) {
          this.accountsGroup.push({
            label: 'Cuentas de débito',
            items: debitAccounts.map((element) => element)
          });
        }

        if (creditAccounts.length > 0) {
          this.accountsGroup.push({
            label: 'Tarjetas de crédito',
            items: creditAccounts.map((element) => element)
          });
        }

        this.accountsGroup = this.accountsGroup.map(group => ({
          ...group,
          items: group.items.map(({ accountName, ...rest }: any) => ({
            ...rest,
            label: accountName
          }))
        }));

        this.categoriesFilter = [...categoriesSpent, ...categoriesIncome, ...otherCategories];
      }),
      catchError(() => {
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
      resizable: true,
      breakpoints: {
        // '320px': '98%',
        // '375px': '90%',
        // '425px': '90%',
        '768px': '90%',
        '1024px': '90vw'
      },
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

  filterData(): void {
    const { startDate, endDate } = this._commonService.getDates(this.rangeDates);

    const filters: ITransactionsFilterDTO = {
      startDate,
      endDate,
      accounts: this.selectedAccount,
      categories: this.categoryFilterSelected,
    };

    this.getTransactionsList(filters);
  }

}
