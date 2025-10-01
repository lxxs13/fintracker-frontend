export interface ITransactionDTO {
  balance: number;
  description: string;
  transactionDate: Date;
  categoryId: string;
  notes: string;
  accountId: string;
  transactionType: number;
}
