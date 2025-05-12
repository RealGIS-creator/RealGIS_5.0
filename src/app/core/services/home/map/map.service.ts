import L from 'leaflet';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FeatureCollection } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private mapSubject = new BehaviorSubject<L.Map|null>(null);
  map$ = this.mapSubject.asObservable();

  private markerClusterGroupSubject = new BehaviorSubject<L.MarkerClusterGroup | null>(null);
  markerClusterGroup$ = this.markerClusterGroupSubject.asObservable();

  private selectedIdsSubject = new BehaviorSubject<string[]>([]);
  selectedIds$: Observable<string[]> = this.selectedIdsSubject.asObservable();

  private _selectedGeoJson = new BehaviorSubject<FeatureCollection>({ type: 'FeatureCollection', features: [] });
  public selectedGeoJson$: Observable<FeatureCollection> = this._selectedGeoJson.asObservable();

  private cursorCoordsSubject = new BehaviorSubject<[number, number] | null>(null);
  cursorPosition$ = this.cursorCoordsSubject.asObservable();

  private zoomLevelSubject = new BehaviorSubject<number | null>(null);
  zoomLevel$ = this.zoomLevelSubject.asObservable();

  setMap(map: L.Map) {
    this.mapSubject.next(map);
  }

  setMarkerClusterGroup(markerClusterGroup: L.MarkerClusterGroup) {
    //console.log('info funcion', markerClusterGroup)
    this.markerClusterGroupSubject.next(markerClusterGroup);
  }

  getAllMarkers(): L.Layer[] {
    const clusterGroup = this.markerClusterGroupSubject.getValue();
    return clusterGroup ? clusterGroup.getLayers() : [];
  }  

  setSelectedIds(ids: string[]) {
    //console.log('cambia ids: ', ids)
    this.selectedIdsSubject.next(ids);
  }

  setSelectedGeoJson(data: FeatureCollection) {
    //console.log('cambia geoJson: ', data)
    this._selectedGeoJson.next(data);
  }

  updateCursorCoords(coords: [number, number]) {
    this.cursorCoordsSubject.next(coords);
  }

  updateZoomLevel(zoom: number) {
    this.zoomLevelSubject.next(zoom);
  }
}
