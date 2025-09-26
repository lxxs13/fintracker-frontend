import { EAccountType } from "../../enums/AccountTypes";

export interface IDebitAccountDTO {
  balance: number;
  description: string;
  accountType: EAccountType;
}
