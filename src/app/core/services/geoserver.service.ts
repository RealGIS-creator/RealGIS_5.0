import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeoserverService {
  private baseUrl: any = "http://100.29.108.250:8080/geoserver/";
  private headers = new HttpHeaders();

  constructor(
      private http: HttpClient,
    ) { }

  getLayer(layer: string): Observable<any> {
      const url = this.baseUrl + 'ows?service=wfs&request=GetFeature&typeName=' + layer + '&outputFormat=application/json';  
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
    
    getLayers(workspace: string): Observable<any> {
      const url = this.baseUrl + 'rest/workspaces.json';
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'wj483hcf': 'admin'
      });
  
      const httpOptions = {
        headers: headers
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
