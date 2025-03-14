import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeoServerService {
  getLayer(layer: string) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
