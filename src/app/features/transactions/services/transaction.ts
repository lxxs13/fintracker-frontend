import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ITransactionDTO } from '../../../models/DTOS/ITransactionDTO';
import { Observable } from 'rxjs';
import { ITransactionsListResponse } from '../../../models/responses/ITransactionsListResponse';
import { ITransactionsFilterDTO } from '../../../models/ITransactionsFilterDTO';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private _http = inject(HttpClient);

  getTransactions(filter?: ITransactionsFilterDTO): Observable<ITransactionsListResponse> {
    let httpParams = new HttpParams();

    if(filter?.startDate && filter?.endDate) {
      httpParams = httpParams.set('startDate', filter.startDate);
      httpParams = httpParams.set('endDate', filter.endDate);
    }

    return this._http.get<ITransactionsListResponse>(`/transaction?${httpParams.toString()}`);
  }

  getSummaryByMonth() {
    return this._http.get('/transaction/thisMonth');
  }

  //FIX: REVISAR POR QUÉ LLAMO AL ENDPOINT DE ACCOUNT
  getAvailableToSpend(): Observable<number> {
    return this._http.get<number>('/account/summary');
  }

  createIncomeSpentTransaction(transactionInfo: ITransactionDTO) {
    return this._http.post('/transaction/incomeSpentTransaction', transactionInfo);
  }

  createTransferTransaction(transactionInfo: ITransactionDTO) {
    return this._http.post('/transaction/createTransferTransaction', transactionInfo);
  }

}
