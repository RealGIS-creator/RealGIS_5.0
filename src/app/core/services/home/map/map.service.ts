import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private mapSubject = new BehaviorSubject<L.Map|null>(null);
  map$ = this.mapSubject.asObservable();

  private markerClusterGroupSubject = new BehaviorSubject<L.MarkerClusterGroup | null>(null);
  markerClusterGroup$ = this.markerClusterGroupSubject.asObservable();

  private selectedIdsSubject = new BehaviorSubject<string[]>([]);
  selectedIds$ = this.selectedIdsSubject.asObservable();

  private cursorCoordsSubject = new BehaviorSubject<[number, number] | null>(null);
  cursorPosition$ = this.cursorCoordsSubject.asObservable();

  private zoomLevelSubject = new BehaviorSubject<number | null>(null);
  zoomLevel$ = this.zoomLevelSubject.asObservable();

  setMap(map: L.Map) {
    this.mapSubject.next(map);
  }

  setMarkerClusterGroup(markerClusterGroup: L.MarkerClusterGroup) {
    this.markerClusterGroupSubject.next(markerClusterGroup);
  }

  getAllMarkers(): L.Layer[] {
    const clusterGroup = this.markerClusterGroupSubject.getValue();
    return clusterGroup ? clusterGroup.getLayers() : [];
  }  

  setSelectedIds(ids: string[]) {
    this.selectedIdsSubject.next(ids);
  }

  updateCursorCoords(coords: [number, number]) {
    this.cursorCoordsSubject.next(coords);
  }

  updateZoomLevel(zoom: number) {
    this.zoomLevelSubject.next(zoom);
  }
}
