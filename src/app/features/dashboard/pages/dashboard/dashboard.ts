import { Component } from '@angular/core';
import { DashboardComponent } from '../../components/dashboard/dashboard';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'fintracker-dashboard',
  imports: [
    DashboardComponent,
    ToastModule,
  ],
  templateUrl: './dashboard.html',
  providers: []
})
export class DashboardPage {

}
