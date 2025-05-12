import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocationMap } from '../../../../interfaces/location-map';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // private pointDataSubject = new BehaviorSubject<any>(null);
  private pointDataSubject = new Subject<any>();
  pointData$: Observable<any> = this.pointDataSubject.asObservable();

  private pointDataParamSubject = new Subject<[number, number]>();
  public readonly pointDataParam$: Observable<[number, number]> = this.pointDataParamSubject.asObservable();
  
  constructor() { }

  getLocationInitial(): LocationMap {
    return { location: [ 8.6, -80.0 ], zoom: 8 }
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
