export interface ICategoriesListResponse {
  categoriesSpent:  ICategories[];
  categoriesIncome: ICategories[];
  othersCategories: ICategories[];
}

export interface ICategories {
  _id?:          string;
  categoryId?:   string;
  categoryName:  string;
  iconLabel:     string;
  iconColor:     string;
  totalSpent ?:   number;
  totalTransactions?: number;
  txCount?: number;
}
