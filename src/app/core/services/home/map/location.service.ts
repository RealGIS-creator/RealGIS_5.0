import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LocationMap } from '../../../../interfaces/location-map';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // private pointDataSubject = new BehaviorSubject<any>(null);
  private readonly pointDataSubject = new Subject<any>();
  pointData$: Observable<any> = this.pointDataSubject.asObservable();
  zoomLevel = 8;

  private readonly pointDataParamSubject = new Subject<[number, number]>();
  public readonly pointDataParam$: Observable<[number, number]> = this.pointDataParamSubject.asObservable();
  
  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        '(max-width: 767px)', // small
        '(min-width: 768px) and (max-width: 1199px)', // medium
        '(min-width: 1200px)', // large
      ])
       this.breakpointObserver
      .observe([
        '(max-width: 767px)', // small
        '(min-width: 768px) and (max-width: 1500px)', // medium
        '(min-width: 1200px)', // large
      ]).subscribe(result => {
      if (result.breakpoints['(max-width: 767px)']) {
        this.zoomLevel = 5;  // Pantalla pequeña
      } 
      else if (result.breakpoints['(min-width: 768px) and (max-width: 1500px)']) {
        this.zoomLevel = 7;  // Pantalla mediana
      } 
      else if (result.breakpoints['(min-width: 1501px)']) {
        this.zoomLevel = 8;  // Pantalla grande
      }
    });
   }

  getLocationInitial(): LocationMap {
    return { location: [ 8.6, -80.0 ], zoom: this.zoomLevel }
  }

  updatePointData(data: any) {
    this.pointDataSubject.next(data);
  }

  /**
   * Método que otros componentes llaman para enviar nuevas coordenadas.
   * @param lat Latitud nueva
   * @param lng Longitud nueva
   */
  emitPoint(lat: number, lng: number): void {
    this.pointDataParamSubject.next([lat, lng]);
  }
}
