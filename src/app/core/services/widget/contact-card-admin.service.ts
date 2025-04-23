import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactCardAdminService {

  private apiUrl = environment.backendGN;
  
  constructor(private http: HttpClient) { }

  updateContactCard(data: any): Observable<any> {
    const url = `${this.apiUrl}/WS_TarjetaContactoUpdate`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      "Gx_mode": "DSP",
      "SDT_TarjetaContacto1": data
    }
    return this.http.post<any>(url, body, { headers });
  }
}
