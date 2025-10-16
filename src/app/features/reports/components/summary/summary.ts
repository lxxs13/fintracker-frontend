import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { DatePickerModule } from 'primeng/datepicker';
import { TransactionService } from '../../../transactions/services/transaction';
import { IconColorClassPipe } from '../../../../shared/pipes/icon-color-class-pipe';
import { ICategories } from '../../../../models/responses/ICategoriesListResponse';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CategoriesListComponent } from "../../../../shared/components/categories-list/categories-list";
import { FloatLabelModule } from 'primeng/floatlabel';
import { DataNotFoundComponent } from "../../../../shared/components/data-not-found/data-not-found";

@Component({
  selector: 'fintracker-summary',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    CurrencyPipe,
    ButtonModule,
    ProgressBarModule,
    FloatLabelModule,
    DatePickerModule,
    IconColorClassPipe,
    DataNotFoundComponent
],
  templateUrl: './summary.html',
})
export class SummaryComponent implements OnInit {
  private _transactionService = inject(TransactionService);

  thisMonth: ICategories[] = [];

  selectedMonth: Date[] | undefined;

  ngOnInit(): void {
    this.getSummaryByMonth();
  }

  getSummaryByMonth(): void {
    this._transactionService.getSummaryByMonth().subscribe({
      next: (response: any) => {
        this.thisMonth = response.byCategory;
        console.log(response);

    }});
  }

  filterData(): void {
    console.log(this.selectedMonth);
  }

}
