import { IDebitAccountsResponse } from "../models/responses/IDebitAccountsResponse";

export enum EAccountType {
    EFECTIVO = 1,
    CHEQUES,
    AHORROS,
    CREDITO,
}

export interface IDebitAccountGroup {
  type: string;
  totalBalance: number;
  accounts: IDebitAccountsResponse[];
}

export const EAccountTypeMapperText: Record<EAccountType, string> = {
  [EAccountType.EFECTIVO]: 'Efectivo',
  [EAccountType.CHEQUES]: 'Cheques',
  [EAccountType.AHORROS]: 'Ahorros',
  [EAccountType.CREDITO]: 'Crédito',
};
