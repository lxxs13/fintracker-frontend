import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TabsModule } from 'primeng/tabs'
import { CategoriesService } from '../../services/categories';
import { ICategories, ICategoriesListResponse } from '../../../../models/responses/ICategoriesListResponse';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { IconColorClassPipe } from '../../../../shared/pipes/icon-color-class-pipe';


@Component({
  selector: 'fintracker-categories',
  imports: [
    FormsModule,
    CommonModule,
    CardModule,
    ScrollPanelModule,
    TabsModule,
    DividerModule,
    SelectButtonModule,
    IconColorClassPipe,
  ],
  templateUrl: './categories.html',
})
export class CategoriesComponent implements OnInit {
  private _categoryService = inject(CategoriesService);
  selectedIndexTab: number = 0;

  spentList: ICategories[] = [];
  selectedSpend: ICategories | undefined;

  incomesList: ICategories[] = [];
  selectedIncome: ICategories | undefined;


  ngOnInit(): void {
    this._categoryService.GetCategoriesByUserId().subscribe({
      // next: ((response: ICategoriesListResponse) => {
      //   const { categoriesSpent, categoriesIncome } = response;

      //   this.spentList = categoriesSpent;
      //   this.incomesList = categoriesIncome;
      // }),
      // error: (err) => console.error(err)
    })
  }

}
