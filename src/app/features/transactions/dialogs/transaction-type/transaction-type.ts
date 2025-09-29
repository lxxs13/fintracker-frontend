import { DatePickerModule } from 'primeng/datepicker';
import { EditorModule } from 'primeng/editor';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabsModule } from 'primeng/tabs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TransactionService } from '../../services/transaction';
import { CategoriesService } from '../../../settings/services/categories';
import { ICategories, ICategoriesListResponse } from '../../../../models/responses/ICategoriesListResponse';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ITransactionDTO } from '../../../../models/DTOS/ITransactionDTO';
import { AccountService } from '../../../accounts/services/account';

@Component({
  selector: 'fintracker-transaction-type',
  imports: [
    FormsModule,
    SelectButtonModule,
    ButtonModule,
    TabsModule,
    DividerModule,
    FloatLabelModule,
    DatePickerModule,
    SelectModule,
    EditorModule,
    InputNumberModule,
    InputTextModule,
    CommonModule,
  ],
  templateUrl: './transaction-type.html',
  styleUrl: './transaction-type.css',
  providers: [DialogService]
})
export class TransactionTypeComponent implements OnInit {
  private _dialogService = inject(DynamicDialogRef);
  private _transtactionService = inject(TransactionService);
  private _categoryService = inject(CategoriesService);
  private _accountsService = inject(AccountService);

  balance: number | undefined;
  spentDate: Date | undefined;

  categoriesIncomesList: ICategories[] = [];
  categoriesSpendList: ICategories[] = [];

  selectedCategory: ICategories | undefined;

  notes: string = '';

  stateOptions: any[] = [
    { icon: 'pi-shopping-cart', label: 'Gasto', value: 'spent', desc: 'Registra una compra o un pago que hiciste, como supermercado, gasolina o restaurante.' },
    { icon: 'pi-receipt', label: 'Pago', value: 'payment', desc: 'Registra un pago que necesites hacer, como suscripciones, renta o servicios.' },
    { icon: 'pi-arrow-right', label: 'Ingreso', value: 'incomnig', desc: 'Registra tu salario, bonos, freelance u otros ingresos que recibas.' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Transferencia', value: 'transfer', desc: 'Registra movimientos entre cuentas, como transferencia de cuenta de cheques a ahorro.' },
    { icon: 'pi-arrow-circle-left', label: 'Reembolso', value: 'refound', desc: 'Registra un reembolso o una devolución que recibiste, como la devolución de un producto o cashback.' },
    { icon: 'pi-list-check', label: 'Compra a meses', value: 'purshaseMonthly', desc: 'Registra una compra a meses con tarjeta de crédito.' },
    { icon: 'pi-credit-card', label: 'Pago de tarjeta', value: 'cardPayment', desc: 'Registra un pago realizado a tu tarjeta de crédito.' },
  ];

  tabIndexSelected: number = 0;

  dialogRef: DynamicDialogRef | undefined;

  value: string = '';
  desc: string = '';

  ngOnInit(): void {
    this._categoryService.GetCategoriesByUserId().subscribe({
      next: (response: ICategoriesListResponse) => {
        const { categoriesIncome, categoriesSpent } = response;
        this.categoriesIncomesList = categoriesIncome;
        this.categoriesSpendList = categoriesSpent;
      }
    });

    this._accountsService.GetDebitCardsByUser().subscribe({
      next: (response) => {
        console.log(response)
      }
    })
  }

  categoryTypeList(): boolean {
    const allowed = ['spent', 'payment', 'purshaseMonthly'];
    return allowed.includes('spend'); // true si está, false si no
  }


  saveChanges(): void {
    const body: ITransactionDTO = {
      balance: this.balance!,
      notes: this.notes,
      transactionDate: this.spentDate!,
      description: this.desc,
      categoryId: this.selectedCategory?._id!,
    };

    this._transtactionService.CreateTransaction(body).subscribe({
      next: (response) => {
        console.log(response);

      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  nextStep(): void {
    this.tabIndexSelected = 1;
  }

  goBack(): void {
    if (this.tabIndexSelected === 1)
      this.tabIndexSelected = 0;
    else if (this.tabIndexSelected === 0)
      this._dialogService.close(false);
  }
}
