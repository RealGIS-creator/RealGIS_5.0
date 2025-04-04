import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoJson } from '../../../../interfaces/geoJson';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  private apiUrl = environment.backendGN;

  constructor(private http: HttpClient) { }


  getGeoJsonData(): Observable<any> {
    const url = `${this.apiUrl}/WS_GeoJson`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const gn = {
      "Gx_mode": "DSP"
    }
    return this.http.post<any>(url, gn, { headers });
  }

  getDataLayer(): Observable<any> {
    const baseurl_wfs = 'https://www.realidad5.com/geoserver/ows?service=wfs&version=1.1.0'
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<any>(baseurl_wfs + '&request=GetFeature&typeName=ubicacionpredio&outputFormat=application/json', {headers})
    // .pipe(
    //   retry(1),
    //   catchError(this.handleError)
    // );
  }
}
