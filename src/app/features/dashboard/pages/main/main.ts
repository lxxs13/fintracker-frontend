import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { HeaderComponent } from '../../components/header/header';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../../../shared/services/common';

@Component({
  selector: 'fintracker-main',
  imports: [
    HeaderComponent,
    RouterOutlet,
    SpeedDialModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './main.html',
})
export class MainPage implements OnInit {
  private _route = inject(Router);
  private _commonService = inject(CommonService);

  currentRoute = signal<string>('');
  isTransactionPage = computed(() => this.currentRoute().includes('dashboard/transactions'));

  items: MenuItem[] = [];

  constructor() {
    this._route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(event);

        this.currentRoute.set(event.urlAfterRedirects);
      });
  }

  ngOnInit() {
    this.getStateOptions();
  }

  getStateOptions(): void {
    this._commonService.stateOptions.forEach(option => {
      this.items.push({
        label: option.label,
        icon: option.icon,
      });
    });
  }

}
