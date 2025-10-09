import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';
import { filter, Subject } from 'rxjs';
import { HeaderComponent } from '../../components/header/header';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../../../shared/services/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransactionTypeComponent } from '../../../transactions/dialogs/transaction-type/transaction-type';
import { SessionExpired } from '../../../../shared/dialogs/session-expired/session-expired';

export enum IdleUserTimes {
  IdleTime = 3000,
  CountdownTime = 5000
}

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
  providers: [DialogService],
})
export class MainPage implements OnInit, OnDestroy {
  private _route = inject(Router);
  private _commonService = inject(CommonService);
  private _dialogService = inject(DialogService);

  dialogMenuRef: DynamicDialogRef | undefined;
  dialogSessionExpiredRef: DynamicDialogRef | undefined;

  isDialogOpen: boolean = false;

  currentRoute = signal<string>('');
  isTransactionPage = computed(() => this.currentRoute().includes('dashboard/transactions'));

  items: MenuItem[] = [];

  private countdownId: any;
  private countdownValue: number = 0;

  userInactive: Subject<boolean> = new Subject();

  constructor() {
    this._route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute.set(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.dialogSessionExpiredRef?.close();
  }

  ngOnInit() {
    this.getStateOptions();
    this.startCountdown();
  }

  getStateOptions(): void {
    this._commonService.stateOptions.forEach(option => {
      this.items.push({
        label: option.label,
        icon: option.icon,
        command: () => this.showMenuOption(option.label, option.value),
      });
    });
  }

  showMenuOption(title: string, transactionType: string) {
    this.dialogMenuRef = this._dialogService.open(TransactionTypeComponent, {
      modal: false,
      closable: true,
      maximizable: true,
      draggable: true,
      maskStyleClass: 'backdrop-blur-sm',
      width: '50rem',
      header: `Agregar ${title.toLocaleLowerCase()}`,
      data: {
        transactionType,
      },
    });

    this.dialogMenuRef.onClose.subscribe((response) => {
      if (response) {
        this._commonService.showMessage('Transacción creada', 'La transacción se ha gaurdado correctamente', 'OK');
      }
    })
  }

  startCountdown(): void {
    const sessionTime = localStorage.getItem('token');

    this.countdownValue = this._commonService.timeToExpire(sessionTime!) - Math.floor((new Date).getTime() / 1000);
    this.countdownId = setInterval(() => {
      this.countdownValue--;

      if(!this.isDialogOpen && this.countdownValue <= 10){
        this.isDialogOpen = true;
        this.showEspiresDialog();
      }

      if (this.countdownValue <= 0) {
        clearInterval(this.countdownId);
        this.userInactive.next(true);
        this._route.navigateByUrl('');
      }
    }, 1000);
  }

  showEspiresDialog(): void {
    this.dialogSessionExpiredRef = this._dialogService.open(SessionExpired, {
      header: 'Tu sesión está por expirar',
      modal: true,
      closable: true,
      focusOnShow: false,
      breakpoints: {
        // '320px': '98%',
        // '375px': '90%',
        // '425px': '90%',
        '768px': '90%',
        '1024px': '90vw'
      }
    })
  }



}
