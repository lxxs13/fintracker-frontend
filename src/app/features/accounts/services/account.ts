import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDebitAccountsResponse } from '../../../models/responses/IDebitAccountsResponse';
import { IDebitAccountDTO } from '../../../models/DTOS/ICardDTO';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private _http = inject(HttpClient);

  GetDebitCardsByUser(): Observable<IDebitAccountsResponse[]> {
    return this._http.get<IDebitAccountsResponse[]>('/account');
  }

  CreateDebitCard(body: IDebitAccountDTO): Observable<boolean> {
    return this._http.post<boolean>('/account', body);
  }

}
