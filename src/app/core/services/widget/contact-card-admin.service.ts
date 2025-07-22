import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InformationCardObject2 } from '../../../interfaces/information-card';

@Injectable({
  providedIn: 'root'
})
export class ContactCardAdminService {

  private readonly apiUrl = environment.backendGN;
  
  constructor(private readonly http: HttpClient) { }

  updateContactCard(data: any): Observable<any> {
    const url = `${this.apiUrl}/WS_TarjetaContactoUpdate`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      "Gx_mode": "DSP",
      "SDT_TarjetaContacto1": data
    }
    return this.http.post<InformationCardObject2>(url, body, { headers });
  }

  insertContactCard(data: any): Observable<InformationCardObject2> {
    const url = `${this.apiUrl}/WS_TarjetaContactoInsert`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      "Gx_mode": "DSP",
      "SDT_TarjetaContacto1": data
    }
    return this.http.post<InformationCardObject2>(url, body, { headers });
  }
}
