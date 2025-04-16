import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolBar } from '../../../interfaces/toolbar';
import { ToolbarService } from '../../../core/services/widget/toolbar.service';
import { Subscription } from 'rxjs';
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MapService } from '../../../core/services/home/map/map.service';

// IMPORTS Geoman:
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

import type { Feature, Polygon } from 'geojson';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
})
export class ToolbarComponent implements OnInit, OnDestroy {
  activeIndex: number | null = null;
  imagesDefault: ToolBar[] = [];
  private map: L.Map | null = null;
  private drawLayer!: L.LayerGroup;
  private subs = new Subscription();
  currentPolygon: L.Polygon | null = null;
  drawing = false;

  private markerClusterGroup: L.MarkerClusterGroup | null = null;
  private subscriptions = new Subscription();

  constructor(
    private toolbarService: ToolbarService,
    private mapService: MapService
  ) { }

  ngOnInit() {
    this.getIcons();
    this.subs.add(
      this.mapService.map$.subscribe(m => {
        if (m && !this.map) {
          this.map = m;
          this.initGeoman();
        }
      })
    );

    this.subscriptions.add(
      this.mapService.markerClusterGroup$.subscribe(group => {
        this.markerClusterGroup = group
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  getIcons(): void {
    this.imagesDefault = this.toolbarService.getToolBar();
  }

  onChangeImage(id: number, type: string): void {
    this.activeIndex = this.activeIndex === id ? null : id;
    switch (id) {
      case 1:
        this.enableRectangleDraw();
        break;
      case 2:
        this.enablePolylineDraw();
        break;
      case 3:
        this.enablePolygonDraw();
        break;
      case 4:
        this.clearSelection();
        break;
    }
  }

  private initGeoman() {
    if (!this.map) { return; }

    this.drawLayer = new L.LayerGroup().addTo(this.map);

    // 2) Añadimos los controles de Geoman
    // this.map.pm.addControls({
    //   position: 'topleft',
    //   drawMarker: false,
    //   drawCircle: false,
    //   drawPolyline: true,
    //   drawRectangle: true,
    //   drawCircleMarker: false,
    //   drawText: false,
    //   editMode: false,
    //   dragMode: false,
    //   cutPolygon: false,
    //   removalMode: false,
    //   drawPolygon: true    
    // });                       

    this.map.on('pm:create', (e: any) => {
      if (e.shape === 'Polygon' || e.shape === 'Rectangle') {
        if (this.currentPolygon) {
          this.drawLayer.removeLayer(this.currentPolygon);
        }
        const layer = e.layer as L.Polygon;
        this.currentPolygon = layer;
        this.drawLayer.addLayer(layer);
        this.selectPointsInPolygon(layer);
      } else if (e.shape === 'Line') {
        this.handlePolyline(e.layer as L.Polyline);
      }

      this.map?.pm.disableDraw();
      this.drawing = false;
    });
  }

  // polígonos
  enablePolygonDraw() {
    this.map?.pm.enableDraw('Polygon', { finishOn: 'dblclick' });
  }

  // rectángulos
  enableRectangleDraw() {
    this.map?.pm.enableDraw('Rectangle', { finishOn: 'dblclick' });
  }

  enablePolylineDraw() {
    this.map?.pm.enableDraw('Line', {
      finishOn: 'dblclick',
      pathOptions: { color: '#0000ff' }
    });
    this.drawing = true;
  }

  clearSelection() {
    if (this.currentPolygon) {
      this.drawLayer.removeLayer(this.currentPolygon);
      this.currentPolygon = null;
      this.mapService.setSelectedIds([]);
    }
  }

  private selectPointsInPolygon(polygon: L.Polygon) {
    if (!this.map || !this.markerClusterGroup) { return; }

    const polyGeo = polygon.toGeoJSON() as Feature<Polygon>;

    // 1. Sacamos TODOS los marcadores del cluster
    const allMarkers = this.markerClusterGroup.getAllChildMarkers
      ? this.markerClusterGroup.getAllChildMarkers()
      : this.markerClusterGroup.getLayers().flatMap(layer => {
        const sub = layer as any;
        return sub.getAllChildMarkers ? sub.getAllChildMarkers() : (layer instanceof L.Marker ? [layer] : []);
      });

    // 2. Filtramos sólo los que están dentro del polígono
    const insideMarkers = allMarkers.filter(marker => {
      const { lat, lng } = marker.getLatLng();
      const pt = turf.point([lng, lat]);
      return turf.booleanPointInPolygon(pt, polyGeo);
    });

    // 3. Extraemos únicamente la Direccion_Id de cada marker.feature.properties
    const ids = insideMarkers
      .map(m => (m as any).feature?.properties?.Direccion_Id)
      .filter((id): id is string => typeof id === 'string');

    console.log('IDs dentro del polígono:', ids);

    // 4. Enviamos al servicio
    this.mapService.setSelectedIds(ids);

  }


  // private handlePolygonOrRectangle(layer: L.Polygon) {
  //   if (this.currentPolygon) this.drawLayer.removeLayer(this.currentPolygon);
  //   this.currentPolygon = layer;
  //   this.drawLayer.addLayer(layer);
  //   this.selectPointsInPolygon(layer);
  // }

  private handlePolyline(layer: L.Polyline) {
    this.drawLayer.addLayer(layer);
    this.measurePolyline(layer);
  }

  private measurePolyline(line: L.Polyline) {
    const latlngs = line.getLatLngs() as L.LatLng[];
    let totalMeters = 0;
    for (let i = 1; i < latlngs.length; i++) {
      totalMeters += latlngs[i - 1].distanceTo(latlngs[i]);
    }

    const midIndex = Math.floor(latlngs.length / 2);
    const midPoint = latlngs[midIndex];
    L.popup({ closeOnClick: false, autoClose: false })
      .setLatLng(midPoint)
      .setContent(`<b>${(totalMeters / 1000).toFixed(3)} km</b>`)
      .openOn(this.map!);
  }

}
