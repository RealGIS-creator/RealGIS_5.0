import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GeoJson } from '../../../../interfaces/geoJson';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  private apiUrl = environment.backendGN;
  private geoServerUrl = environment.geoserverURL;
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) { }


  getGeoJsonData(north: number, south: number, east:number, west:number): Observable<any> {
    
    const url = `${this.apiUrl}/WS_GeoJson`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // const params = new HttpParams()
    // .set('Gx_mode', 'DSP')
    // .set('norte', north)
    // .set('sur', south)
    // .set('este', east)
    // .set('oeste', west); 

    const params = {
      "Gx_mode": "DSP",
      'norte': north,
      'sur': south,
      'este': east,
      'oeste': west,
    }
    return this.http.post<any>(url, params, { headers });
  }

  getLayer(layer: string): Observable<any> {
    //this.main();
    const url = this.geoServerUrl + 'ows?service=wfs&request=GetFeature&typeName=' + layer + '&outputFormat=application/json';  
    const header = this.headers.append('Content-Type', 'application/json');

    const httpOptions = {
      headers: header
    };
    return this.http.get<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  handleError(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Codigo Error (API Geoserver): ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  
}
