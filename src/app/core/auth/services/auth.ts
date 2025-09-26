import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginDTO } from '../../../models/DTOS/ILoginDTO';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _http = inject(HttpClient);

  login(loginData: ILoginDTO): Observable<any> {
    return this._http.post('/auth', loginData);
  }

}
