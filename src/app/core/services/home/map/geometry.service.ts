import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoJson } from '../../../../interfaces/geoJson';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  private apiUrl = environment.backendGN;

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
