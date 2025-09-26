import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'
import { FloatLabelModule } from 'primeng/floatlabel'
import { IDebitAccountDTO } from '../../../../models/DTOS/ICardDTO';
import { AccountService } from '../../services/account';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'fintracker-add-edit-card-account',
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    DividerModule,
    ButtonModule,
    SelectModule,
    FloatLabelModule,
  ],
  templateUrl: './add-edit-card-account.html',
  styleUrl: './add-edit-card-account.css',
  providers: []
})
export class AddEditCardAccountComponent implements OnInit {

  private _accountService = inject(AccountService);
  private _dialogService = inject(DynamicDialogRef);
  private _config = inject(DynamicDialogConfig);

  accountsType = [
    {
      id: 1,
      name: 'Efectivo',
    },
    {
      id: 2,
      name: 'Cheques',
    },
    {
      id: 3,
      name: 'Ahorro',
    },
  ];

  balance: number | undefined;
  lastDigits: number | undefined;
  creditCardLimit: number | undefined;
  APR: number | undefined;
  paymentDueDay: number | undefined;
  statementCloseDay: number | undefined;
  selectedAccountType: string = '';
  description: string = '';
  action: string = '';
  type: number = 0;

  ngOnInit(): void {
    const { action, type } = this._config.data;
    this.action = action;
    this.type = type;
  }

  saveChanges(): void {
    if(this.type === 0) this.saveDebitCard();
  }

  saveDebitCard(): void {
    if (!this.balance) return;

    if (!this.accountsType) return;

    const body: IDebitAccountDTO = {
      balance: this.balance,
      description: this.description,
      accountType: +this.selectedAccountType
    };

    this._accountService.CreateDebitCard(body).subscribe({
      next: (response) => {
        this._dialogService.close(true);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}