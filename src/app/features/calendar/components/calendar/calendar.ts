import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TransactionService } from '../../../transactions/services/transaction';
import { ITransactionItem } from '../../../../models/responses/ITransactionsListResponse';
import { IconColorClassPipe } from '../../../../shared/pipes/icon-color-class-pipe';
import { CommonService } from '../../../../shared/services/common';
import { ITransactionsFilterDTO } from '../../../../models/ITransactionsFilterDTO';
import { Transaction } from '../../../transactions/components/transaction/transaction';
import { AccountService } from '../../../accounts/services/account';
import { EAccountType, EAccountTypeMapperText } from '../../../../enums/AccountTypes';
import { IAccount, IAccountsListResponse } from '../../../../models/responses/IDebitAccountsResponse';

interface Tx {
  transactionDate: string | Date; // ISO o Date
  amount: number;                 // gasto (negativo) o positivo según tu modelo
  transactionType?: number;       // opcional: para filtrar solo gastos
}

@Component({
  selector: 'fintracker-calendar-component',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DatePickerModule,
    AccordionModule,
    CurrencyPipe,
    DatePipe,
    IconColorClassPipe,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit {
  private _transactionService = inject(TransactionService);
  private _accountService = inject(AccountService);

  commonService = inject(CommonService)

  transactionList: ITransactionItem[] = [];
  originalTransactionList: ITransactionItem[] = [];

  date: Date[] = [];
  lastDayOfMonth: Date | null = null;

  transactionsByDay: Map<string, ITransactionItem[]> = new Map();
  creditCardsBalance: number = 0;
  remappedCreditList: IAccount[] = [];
  accountsBalanceTotal: number = 0;
  remappedAccountsList: any;

  debitAccounts: IAccount[] = [];
  creditAccounts: IAccount[] = [];

  ngOnInit(): void {
    this.date?.push(new Date());
    this.lastDayOfMonth = new Date();
    this.updateLastDay({ year: this.lastDayOfMonth.getFullYear(), month: this.lastDayOfMonth.getMonth() + 1 });
    this.getTransactions();
  }

  updateLastDay(event: any) {
    this.lastDayOfMonth = new Date(event.year, event.month, 0);
    this.getTransactions();
    // this.getAccounts();
  }

  getAccounts() {
    this._accountService.GetDebitCardsByUser().subscribe({
      next: (response: IAccountsListResponse) => {
        const { debitAccounts, creditAccounts } = response;

        this.debitAccounts = debitAccounts;
        this.creditAccounts = creditAccounts;

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

  getTransactions(): void {
    const start = new Date(this.lastDayOfMonth!.getFullYear(), this.lastDayOfMonth!.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(this.lastDayOfMonth!.getFullYear(), this.lastDayOfMonth!.getMonth() + 1, 0, 23, 59, 59, 999);

    const { startDate, endDate } = this.commonService.getDates([start, end]);

    const filters: ITransactionsFilterDTO = { startDate, endDate };

    this._transactionService.getTransactions(filters).subscribe({
      next: (response) => {
        const { spentTotal, transactionList } = response;
        // this.totalTrasactions = total;
        // this.totalSpent = spentTotal;
        this.transactionList = transactionList;
        this.originalTransactionList = this.transactionList;

        this.groupTransactionsByDay();
      }
    })
  }

  groupTransactionsByDay() {
    this.transactionsByDay.clear();

    this.transactionList.forEach(transaction => {
      // Crear key en formato 'YYYY-MM-DD'
      const dateKey = new Date(transaction.transactionDate).toISOString().split('T')[0];

      if (!this.transactionsByDay.has(dateKey)) {
        this.transactionsByDay.set(dateKey, []);
      }

      this.transactionsByDay.get(dateKey)!.push(transaction);
    });
  }

  totalForCell(item: any): number {
    const year = item.year;
    const month = String(item.month + 1).padStart(2, '0');
    const day = String(item.day).padStart(2, '0');

    const dateKey = `${year}-${month}-${day}`;
    const dayTransactions = this.transactionsByDay.get(dateKey) || [];

    return dayTransactions.reduce((sum, transaction) => sum + this.commonService.getAbsAmount(transaction.amount), 0);
  }

  filterListBySelectedDay(event: Date) {
    const { startDate: selectedStartDay, endDate: selectedEndDay } = this.commonService.getDates([event]);

    this.transactionList = this.originalTransactionList.filter(element => {
      const transactionDate = new Date(element.transactionDate);
      transactionDate.setHours(0, 0, 0, 0);

      const initialDate = this.parseDDMMYYYY(selectedStartDay);
      initialDate.setHours(0, 0, 0, 0);

      const endDate = this.parseDDMMYYYY(selectedEndDay);
      endDate.setHours(23, 59, 59, 999);

      return transactionDate.getTime() >= initialDate.getTime() &&
        transactionDate.getTime() <= endDate.getTime();
    });
  }

  parseDDMMYYYY(dateStr: string): Date {
    const [ymd] = dateStr.split('T');
    const [year, month, day] = ymd.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  resetList(): void {
    this.transactionList = this.originalTransactionList;
  }

  reInitDate(): void {
    this.ngOnInit();
  }


}
