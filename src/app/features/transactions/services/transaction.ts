import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITransactionDTO } from '../../../models/DTOS/ITransactionDTO';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _http = inject(HttpClient);

  CreateTransaction(transactionInfo: ITransactionDTO) {
    return this._http.post('transaction', transactionInfo);
  }

}
