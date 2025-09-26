import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ToolbarModule } from 'primeng/toolbar'
import { DividerModule } from "primeng/divider";
import { DashboardService } from '../../services/dashboard';

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
    CurrencyPipe,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private _dasboardService = inject(DashboardService);

  welcomeMessages: string[] = [
    'Es un placer tenerte con nosotros, ',
    'Hola, ',
    'Que bueno verte, ',
    'Bienvenido, ',
  ];

  periodOfTime = [
    { id: 1, title: 'Esta semana' },
    { id: 2, title: 'Este mes' },
    { id: 3, title: 'Este año' },
  ];

  randomIndex: number = 0;
  periodSelected: number = 0;
  currentBalance: number = 0;

  usernameLogged: string = '';

  ngOnInit(): void {
    this.getSummary();

    if (this.periodOfTime.length > 0) this.periodSelected = this.periodOfTime[0].id;

    this.randomIndex = Math.floor(Math.random() * this.welcomeMessages.length) ?? 0;
    this.usernameLogged = localStorage.getItem('userName') ?? 'N/D';
  }

  getSummary(): void {
    this._dasboardService.GetSummary().subscribe({
      next: (response: number) => {
        this.currentBalance = response;
      }
    })
  }

}
