export interface ICategoriesListResponse {
  categoriesSpent:  ICategories[];
  categoriesIncome: ICategories[];
}

export interface ICategories {
  _id:          string;
  categoryName: string;
  iconLabel:    string;
  iconColor:    string;
}
