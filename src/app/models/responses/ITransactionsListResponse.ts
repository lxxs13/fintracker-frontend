import { ICategories } from "./ICategoriesListResponse";
import { IAccount } from "./IDebitAccountsResponse";

export interface ITransactionsListResponse {
  totalDocuments:     number;
  spentTotal:         number;
  incomeTotal:        number;
  transactionsTotal:  number;
  cardPaymentsTotal:  number;
  transactionList:    ITransactionList[];
}

export interface ITransactionList {
  _id:             string;
  categoryId:      string;
  accountId:       string;
  balance:         number;
  amount:          number;
  description:     string;
  transactionDate: Date;
  account:         IAccount;
  category:        ICategories;
}
