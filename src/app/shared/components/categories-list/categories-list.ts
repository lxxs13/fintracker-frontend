import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconColorClassPipe } from '../../pipes/icon-color-class-pipe';
import { ICategories, ICategoriesListResponse } from '../../../models/responses/ICategoriesListResponse';
import { CategoriesService } from '../../../features/settings/services/categories';
import { CommonService } from '../../services/common';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'fintracker-categories-list',
  imports: [
    FormsModule,
    CommonModule,
    FloatLabelModule,
    SelectModule,
    IconColorClassPipe,
  ],
  templateUrl: './categories-list.html',
  styleUrl: './categories-list.css'
})
export class CategoriesListComponent implements OnInit {
  @Input() transactionType: string = '';
  @Output() selectedCategoryOutput: EventEmitter<ICategories> = new EventEmitter<ICategories>();

  private _categoryService = inject(CategoriesService);
  commonService = inject(CommonService);

  categoriesIncomesList: ICategories[] = [];
  categoriesSpendList: ICategories[] = [];

  selectedCategory: ICategories | undefined;

  ngOnInit(): void {
    this._categoryService.GetCategoriesByUserId().subscribe({
      next: (response: ICategoriesListResponse) => {
        const { categoriesIncome, categoriesSpent } = response;
        this.categoriesIncomesList = categoriesIncome;
        this.categoriesSpendList = categoriesSpent;
      }
    });

  }

}
