import { IAccount } from "../models/responses/IDebitAccountsResponse";

export enum EAccountType {
    EFECTIVO = 1,
    CHEQUES,
    AHORROS,
    CREDITO,
}

export interface IDebitAccountGroup {
  type: string;
  totalBalance: number;
  accounts: IAccount[];
}

export const EAccountTypeMapperText: Record<EAccountType, string> = {
  [EAccountType.EFECTIVO]: 'Efectivo',
  [EAccountType.CHEQUES]: 'Cheques',
  [EAccountType.AHORROS]: 'Ahorros',
  [EAccountType.CREDITO]: 'Crédito',
};
