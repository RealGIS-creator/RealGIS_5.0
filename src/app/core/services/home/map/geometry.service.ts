import { Injectable } from '@angular/core';
import { environment } from '../../../../../environment/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { GeoJson } from '../../../../interfaces/geoJson';
import { WmsParams } from '../../../../interfaces/wmsParams';

@Injectable({
  providedIn: 'root'
})
export class GeometryService {

  private apiUrl = environment.backendGN;
  private geoServerUrl = environment.geoserverURL;
  private headers = new HttpHeaders();

  constructor(private http: HttpClient) { }


  getGeoJsonData(north: number, south: number, east:number, west:number): Observable<any> {
    
    const url = `${this.apiUrl}/WS_GeoJsonSP`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
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


  getAllLayersConfig(): WmsParams[] {
    return [
      { workspace: 'ws_Banistmo', layerName: 'Corregimientos_Pnm', format: 'image/png', opacity: 0.3 },
      { workspace: 'ws_Banistmo', layerName: 'Barrios_Pnm', format: 'image/png', opacity: 1 },
      { workspace: 'ws_Banistmo', layerName: 'Distritos_Pnm', format: 'image/png', opacity: 0.3 },
      { workspace: 'ws_Banistmo', layerName: 'Vias_Pnm', format: 'image/png', opacity: 0.8 },
      { workspace: 'ws_Banistmo', layerName: 'mancha_urbana', format: 'image/png', opacity: 0.8 },
      { workspace: 'ws_Banistmo', layerName: 'SINAP_Pnm', format: 'image/png', opacity: 0.5 },
    ];
  }

  getWMSLayersParams(config: WmsParams) {
    const params = {
      // layers: 'RealAsset_Desarrollo' + ':' + 'ubicacion_des',
      layers: config.workspace + ':' + config.layerName,
      format: "image/png",
      transparent: true,
      version: '1.1.0',
      attribution: "",
      maxZoom: 18,
      tiled: true,
      opacity: config.opacity
    };

    return params;
  }

  
  getWMSLayersURL() {
    const geoserverUrl = this.geoServerUrl + 'ws_Banistmo' + "/wms?&request=GetMap";
    return geoserverUrl;
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
