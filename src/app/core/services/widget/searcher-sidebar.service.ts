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

  getSearchCriteria(): string[] {
    return [
      "ID de Crédito",
      "No. de Acreditado",
      "Identificación"
    ];
  }

  // getInformationUser(): InfoUser[] {
  //   return [
  //     {id: '100045224'},
  //     {id: '7800474274'}
  //   ]
  // }

  getInformationUser(): Observable<infoSeachersResponse> {
    console.log('llega al servicio');
    const url = `${this.apiUrl}WS_Acreditados`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP"
    }
    return this.http.post<infoSeachersResponse>(url, gn, { headers });
  }
}
