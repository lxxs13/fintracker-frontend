import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { AccordionModule } from 'primeng/accordion';
import { TransactionService } from '../../../transactions/services/transaction';
import { ITransactionList } from '../../../../models/responses/ITransactionsListResponse';
import { IconColorClassPipe } from '../../../../shared/pipes/icon-color-class-pipe';
import { CommonService } from '../../../../shared/services/common';
import { ITransactionsFilterDTO } from '../../../../models/ITransactionsFilterDTO';

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
  styleUrl: './calendar.css'
})
export class CalendarComponent implements OnInit {
  private _transactionService = inject(TransactionService);
  private _commonService = inject(CommonService)

  transactionList: ITransactionList[] = [];
  originalTransactionList: ITransactionList[] = [];

  date: Date[] = [];
  lastDayOfMonth: Date | null = null;

  ngOnInit(): void {
    this.date?.push(new Date());
    this.lastDayOfMonth = new Date();
    this.updateLastDay({ year: this.lastDayOfMonth.getFullYear(), month: this.lastDayOfMonth.getMonth() + 1 });
    this.getTransactions();
  }

  updateLastDay(event: any) {
    this.lastDayOfMonth = new Date(event.year, event.month, 0);
    this.getTransactions();
  }

  getTransactions(): void {
    const start = new Date(this.lastDayOfMonth!.getFullYear(), this.lastDayOfMonth!.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(this.lastDayOfMonth!.getFullYear(), this.lastDayOfMonth!.getMonth() + 1, 0, 23, 59, 59, 999);

    const { startDate, endDate } = this._commonService.getDates([start, end]);

    const filters: ITransactionsFilterDTO = { startDate, endDate };

    this._transactionService.GetTransactions(filters).subscribe({
      next: (response) => {
        const { total, spentTotal, transactionList } = response;
        // this.totalTrasactions = total;
        // this.totalSpent = spentTotal;
        this.transactionList = transactionList;
        this.originalTransactionList = this.transactionList;
      }
    })
  }

  filterListBySelectedDay(event: Date) {
    const { startDate: selectedStartDay, endDate: selectedEndDay } = this._commonService.getDates([event]);
    this.transactionList = this.originalTransactionList.filter(element => {
      const transactionDate = new Date(element.transactionDate).getTime();

      const initalDate = this.parseDDMMYYYY(selectedStartDay).getTime();;
      const endDate = this.parseDDMMYYYY(selectedEndDay).getTime();


      return transactionDate >= initalDate && transactionDate <= endDate;
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

  totalForCell(date: Date): number {

    return 543345;
  }
}
