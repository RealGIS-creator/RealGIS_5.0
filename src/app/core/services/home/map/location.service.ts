import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationMap } from '../../../../interfaces/location-map';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // private pointDataSubject = new BehaviorSubject<any>(null);
  private pointDataSubject = new BehaviorSubject<null>(null);
  pointData$: Observable<null> = this.pointDataSubject.asObservable();
  
  constructor() { }

  getLocationInitial(): LocationMap {
    return { location: [ 9.0, -80.0 ], zoom: 8 }
  }

  updatePointData(data: any) {
    this.pointDataSubject.next(data);
  }
}
