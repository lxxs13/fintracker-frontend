import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private _http = inject(HttpClient);

  GetSummary(): Observable<number> {
    return this._http.get<number>('/account/summary');
  }

}
