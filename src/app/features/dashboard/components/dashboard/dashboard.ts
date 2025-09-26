import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar'

@Component({
  selector: 'fintracker-dashboard-component',
  imports: [
    ToolbarModule,
    CardModule,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit{
  welcomeMessages: string[] = [
    'Es un placer tenerte con nosotros, ',
    'Hola, ',
    'Que bueno verte, ',
    'Bienvenido, ',
  ];

  randomIndex: number = 0;

  usernameLogged: string = '';

  ngOnInit(): void {
    this.randomIndex = Math.floor(Math.random() * this.welcomeMessages.length) ?? 0;
    this.usernameLogged = localStorage.getItem('userName') ?? 'N/D';
  }

}
