import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAccountsListResponse } from '../../../models/responses/IDebitAccountsResponse';
import { ICreditAccountDTO, IDebitAccountDTO } from '../../../models/DTOS/ICardDTO';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _http = inject(HttpClient);

  GetDebitCardsByUser(): Observable<IAccountsListResponse> {
    return this._http.get<IAccountsListResponse>('/account');
  }

  CreateDebitCard(body: IDebitAccountDTO): Observable<boolean> {
    return this._http.post<boolean>('/account/debit', body);
  }

  UpdateDebitCard(id: string, body: IDebitAccountDTO): Observable<boolean> {
    return this._http.put<boolean>(`/account/debit/${id}`, body);
  }

  UpdateCreditCard(id: string, body: ICreditAccountDTO): Observable<boolean> {
    return this._http.put<boolean>(`/account/debit/${id}`, body);
  }

  CreateCreditCard(body: ICreditAccountDTO): Observable<boolean> {
    return this._http.post<boolean>('/account/credit', body);
  }

  DeleteAccount(id: string): Observable<boolean> {
    return this._http.delete<boolean>(`/account/${id}`);
  }

}
