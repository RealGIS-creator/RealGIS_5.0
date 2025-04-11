import { Injectable } from '@angular/core';
import { SearchCriteria } from '../../../interfaces/search-criteria';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadSidebarService {

  private apiUrl = environment.backendGN;

  constructor(private http: HttpClient) { }

  getSearchCriteria(): any[] {
    return [
      { label: 'Descargar CSV', id: '1' },
      { label: 'Descargar Excel', id: '2' },
      { label: 'Descargar ShapeFile', id: '3' }
    ];
  }

  getInformationClient(): Observable<any> {
    const url = `${this.apiUrl}/WS_BaseCliente`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP"
    }
    return this.http.post<any>(url, gn, { headers });
  }

  getInformationClientGeoJson(): Observable<any> {
    const url = `${this.apiUrl}/WS_BaseClienteGeoJson`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP"
    }
    return this.http.post<any>(url, gn, { headers });
  }
}
