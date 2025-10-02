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

  GetTransactions(filter?: ITransactionsFilterDTO): Observable<ITransactionsListResponse> {
    let httpParams = new HttpParams();

    if(filter?.startDate && filter?.endDate) {
      httpParams = httpParams.set('startDate', filter.startDate);
      httpParams = httpParams.set('endDate', filter.endDate);
    }

    return this._http.get<ITransactionsListResponse>(`/transaction?${httpParams.toString()}`);
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
