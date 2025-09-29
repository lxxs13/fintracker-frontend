import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategories, ICategoriesListResponse } from '../../../models/responses/ICategoriesListResponse';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private _http = inject(HttpClient);

  GetCategoriesByUserId(): Observable<ICategoriesListResponse> {
    return this._http.get<ICategoriesListResponse>('/categories');
  }

}
