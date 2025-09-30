import { EAccountType } from "../../enums/AccountTypes";

export interface IDebitAccountDTO {
  balance: number;
  description: string;
  accountType: EAccountType;
}

export interface ICreditAccountDTO {
  balance: number;
  description: string;
  accountType: EAccountType;
  limitCreditCard: number;
  lastDigits: number;
  APR: number;
  statementCloseDay: number;
  paymentDay: number;
}