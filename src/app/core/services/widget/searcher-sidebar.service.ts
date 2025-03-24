import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoSeachersResponse } from '../../../interfaces/info-searcher';

@Injectable({
  providedIn: 'root'
})
export class SearcherSidebarService {

  private apiUrl = environment.backendGN;

  constructor(private http: HttpClient) { }

  getSearchCriteria(): any[] {
    return [
      {name: 'Acreditado_Id', label: 'ID de Crédito'},
      {name: 'AcreditadoNum', label: 'No. de Acreditado'},
      {name: 'AcreditadoIdenti', label: 'Identificación'}
    ];
  }

  getInformationUser(filter: string, info: string): Observable<infoSeachersResponse> {
    console.log('llega al servicio');
    const url = `${this.apiUrl}WS_Acreditados`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP",
      filter: info
    }
    return this.http.post<infoSeachersResponse>(url, gn, { headers });
  }
}
