export interface IAccountsListResponse {
  debitAccounts:  IAccount[];
  creditAccounts: IAccount[];
}

export interface IAccount {
  _id:            string;
  accountName:    string;
  accountType:    number;
  currentBalance: number;
  card?:          ICard;
}

export interface ICard {
  _id:               string;
  accountId:         string;
  creditCardLimit:   number;
  lastDigits:        string;
  APR:               number;
  statementCloseDay: number;
  paymentDay:        number;
}
