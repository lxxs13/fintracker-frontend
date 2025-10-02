import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITransactionDTO } from '../../../models/DTOS/ITransactionDTO';
import { Observable } from 'rxjs';
import { ITransactionsListResponse } from '../../../models/responses/ITransactionsListResponse';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _http = inject(HttpClient);

  GetTransactions(): Observable<ITransactionsListResponse> {
    return this._http.get<ITransactionsListResponse>('/transaction');
  }

  GetSummaryByMonth() {
    return this._http.get('/transaction/thisMonth');
  }

  GetAvailableToSpend(): Observable<number> {
    return this._http.get<number>('/account/summary');
  }

  CreateTransaction(transactionInfo: ITransactionDTO) {
    return this._http.post('/transaction', transactionInfo);
  }

}
