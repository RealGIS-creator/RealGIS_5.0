import { Injectable } from '@angular/core';
import { LocationMap } from '../../../interfaces/location-map';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getLocationInitial(): LocationMap {
    return { location: [ 9.0, -80.0 ], zoom: 8 }
  }
}
