import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginDTO } from '../../../models/DTOS/ILoginDTO';
import { IRegisterUser } from '../../../models/DTOS/IRegisterUser';
import { ILoginResponse } from '../../../models/responses/ILoginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);

  login(loginData: ILoginDTO): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>('/auth', loginData);
  }

  register(login: IRegisterUser): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>('/user', login)
  }

}
