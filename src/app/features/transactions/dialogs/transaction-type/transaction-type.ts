import { DatePickerModule } from 'primeng/datepicker';
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
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TransactionService } from '../../services/transaction';
import { CategoriesService } from '../../../settings/services/categories';
import { ICategories, ICategoriesListResponse } from '../../../../models/responses/ICategoriesListResponse';
import { ITransactionDTO } from '../../../../models/DTOS/ITransactionDTO';
import { AccountService } from '../../../accounts/services/account';
import { CommonService } from '../../../../shared/services/common';

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
    InputNumberModule,
    InputTextModule,
    TextareaModule,
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
  private _commonService = inject(CommonService);

  balance: number | undefined;
  spentDate: Date | undefined;

  categoriesIncomesList: ICategories[] = [];
  categoriesSpendList: ICategories[] = [];
  accountsGroup: any[] = [];
  transactionTypes: any[] = [];
  selectedAccount: any;

  selectedCategory: ICategories | undefined;

  notes: string = '';

  tabIndexSelected: number = 0;

  dialogRef: DynamicDialogRef | undefined;

  value: string = '';
  desc: string = '';

  ngOnInit(): void {

    this.transactionTypes = this._commonService.stateOptions;

    this._categoryService.GetCategoriesByUserId().subscribe({
      next: (response: ICategoriesListResponse) => {
        const { categoriesIncome, categoriesSpent } = response;
        this.categoriesIncomesList = categoriesIncome;
        this.categoriesSpendList = categoriesSpent;
      }
    });

    this._accountsService.GetDebitCardsByUser().subscribe({
      next: (response) => {
        const { debitAccounts, creditAccounts } = response;

        this.accountsGroup.push({
          label: 'Cuentas de débito',
          items: debitAccounts.map((element) => element)
        });

        this.accountsGroup.push({
          label: 'Tarjetas de crédito',
          items: creditAccounts.map((element) => element)
        });

        this.accountsGroup = this.accountsGroup.map(group => ({
          ...group,
          items: group.items.map(({ accountName, ...rest }: any) => ({
            ...rest,
            label: accountName
          }))
        }));

      }
    })
  }

  categoryTypeList(): boolean {
    const allowed = ['spent', 'payment', 'purshaseMonthly'];
    return allowed.includes('spend');
  }

  saveChanges(): void {
    const body: ITransactionDTO = {
      balance: this.balance!,
      description: this.desc,
      transactionDate: this.spentDate!,
      categoryId: this.selectedCategory?._id!,
      accountId: this.selectedAccount?._id!,
      transactionType: this.categoryTypeList() ? 1 : 2,
      notes: this.notes,
    };

    this._transtactionService.CreateTransaction(body).subscribe({
      next: (response) => {
        if (response) {
          this._dialogService.close(true);
        }
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  nextStep(): void {
    if (this.tabIndexSelected == 1) this.saveChanges();

    this.tabIndexSelected = 1;

  }

  goBack(): void {
    if (this.tabIndexSelected === 1)
      this.tabIndexSelected = 0;
    else if (this.tabIndexSelected === 0)
      this._dialogService.close(false);
  }
}
