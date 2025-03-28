import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoSeachersResponse } from '../../../interfaces/info-searcher';
import { SearchCriteria } from '../../../interfaces/search-criteria';

@Injectable({
  providedIn: 'root'
})
export class SearcherSidebarService {

  private apiUrl = environment.backendGN;

  constructor(private http: HttpClient) { }

  getSearchCriteria(): SearchCriteria[] {
    return [
      {name: 'AcreditadoNumCuen', label: 'ID de Crédito', type: 'number'},
      {name: 'AcreditadoNum', label: 'No. de Acreditado', type: 'number'},
      {name: 'AcreditadoIdenti', label: 'Identificación', type: 'string'}
    ];
  }

  getInformationUser(filter: string, info: string): Observable<infoSeachersResponse> {
    const url = `${this.apiUrl}/WS_Acreditados`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP",
      [filter]: info
    }
    return this.http.post<infoSeachersResponse>(url, gn, { headers });
  }
}
