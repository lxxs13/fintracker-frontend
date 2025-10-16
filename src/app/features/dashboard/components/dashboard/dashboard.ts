import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar'
import { DividerModule } from "primeng/divider";
import { CarouselModule } from 'primeng/carousel';
import { TransactionService } from '../../../transactions/services/transaction';
import { CommonService } from '../../../../shared/services/common';
import { IconColorClassPipe } from "../../../../shared/pipes/icon-color-class-pipe";
import { ISummaryCard } from '../../../../models/ISummaryDTO';

@Component({
  selector: 'fintracker-dashboard-component',
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    CardModule,
    SelectModule,
    FloatLabelModule,
    DividerModule,
    CarouselModule,
    CurrencyPipe,
    IconColorClassPipe
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  public commonService = inject(CommonService);
  private _transactionService = inject(TransactionService);

  randomIndex: number = 0;
  periodSelected: number = 0;
  currentBalance: number = 0;

  usernameLogged: string = '';

  thisMonth: ISummaryCard[] = [
    { type: 'general', title: 'Gastos generales', icon: 'shopping_bag', subTitle: 'Gastos principales', totalSpend: 0, items: [] },
    { type: 'card', title: 'Gastos con tarjeta', icon: 'credit_card', subTitle: 'Gastos principales', topCategory: { categoryName: 'Comida', total: 1370 } },
    { type: 'income', title: 'Ingresos recibidos', icon: 'attach_money', subTitle: 'Próximo', upcoming: 'Nómina · 10 Oct' },
    { type: 'cashflow', title: 'Flujo de efectivo', icon: 'money_range', subTitle: 'Resumen', balanceIn: 9000, balanceOut: 7230 },
  ];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
    { breakpoint: '768px',  numVisible: 1, numScroll: 1 },
    { breakpoint: '560px',  numVisible: 1, numScroll: 1 },
  ];

  ngOnInit(): void {
    this.getSummaryByMonth();
    this.getAvailableToSpend();

    this.periodSelected = this.commonService.periodOfTime[0]?.id ?? null;
    this.randomIndex = Math.floor(Math.random() * this.commonService.welcomeMessages.length);
    this.usernameLogged = localStorage.getItem('userName') || 'N/D';
  }

  getAvailableToSpend(): void {
    this._transactionService.getAvailableToSpend().subscribe({
      next: (response) => {
        this.currentBalance = response;
      }
    });
  }

  getSummaryByMonth(): void {
    this._transactionService.getSummaryByMonth().subscribe({
      next: (response: any) => {

        this.thisMonth = this.thisMonth.map(card =>
          card.type === 'general'
            ? { ...card, items: response.byCategory, totalSpend: response.totalSpend }
            : card
        );
      }
    });
  }

}
