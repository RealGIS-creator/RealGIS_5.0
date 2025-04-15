import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment/environment';
import { MapService } from '../home/map/map.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadSidebarService {

  private apiUrl = environment.backendGN;
  private paramsId: string[] = [];

  constructor(
    private http: HttpClient,
    private mapService: MapService
  ) { 
    this.mapService.selectedIds$.subscribe(ids => {
      this.paramsId = ids;
    });
  }

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
      "Gx_mode": "DSP",
      "direccionesId": this.paramsId
    }
    return this.http.post<any>(url, gn, { headers });
  }

  getInformationClientGeoJson(): Observable<any> {
    const url = `${this.apiUrl}/WS_BaseClienteGeoJson`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const gn = {
      "Gx_mode": "DSP",
      "direccionesId": this.paramsId
    }
    return this.http.post<any>(url, gn, { headers });
  }
}
