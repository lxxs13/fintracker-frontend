import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SpeedDialModule } from 'primeng/speeddial';
import { MenuItem, MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { HeaderComponent } from '../../components/header/header';
import { ButtonModule } from 'primeng/button';
import { CommonService } from '../../../../shared/services/common';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TransactionTypeComponent } from '../../../transactions/dialogs/transaction-type/transaction-type';

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
export class MainPage implements OnInit {
  private _route = inject(Router);
  private _commonService = inject(CommonService);

  private _dialogService = inject(DialogService);
  dialogRef: DynamicDialogRef | undefined;

  currentRoute = signal<string>('');
  isTransactionPage = computed(() => this.currentRoute().includes('dashboard/transactions'));

  items: MenuItem[] = [];

  constructor() {
    this._route.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
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
        command: () => this.showDialog(option.label ,option.value),
      });
    });
  }

    showDialog(title: string, transactionType: string) {
      this.dialogRef = this._dialogService.open(TransactionTypeComponent, {
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

      this.dialogRef.onClose.subscribe((response) => {
        if (response) {
          this._commonService.showMessage('Transacción creada', 'La transacción se ha gaurdado correctamente', 'OK');
        }
      })
    }

}
