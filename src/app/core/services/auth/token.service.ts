import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { Token } from '../../../interfaces/token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private apiUrl = environment.backendGN;
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  async genexusToken(): Promise<void> {
    console.log('primero el servicio')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP"
    };
    try {
      // document.cookie = "JSESSIONID=NuevoValor; path=/;";
      const response = await firstValueFrom(this.http.post<Token>(`${this.apiUrl}/WS_Session`, gn, { headers }));
      this.token = response.User_Token;
      console.log('token: ', this.token)
    } catch (error) {
      console.error('Error al obtener el token:', error);
      throw error; // Propagar el error para manejarlo en el inicializador
    }
  }

  getToken(): string | null {
    return this.token;
  }
}
