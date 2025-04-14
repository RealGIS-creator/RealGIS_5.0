import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToolBar } from '../../../interfaces/toolbar';
import { ToolbarService } from '../../../core/services/widget/toolbar.service';
import { Subscription } from 'rxjs';
import * as turf from '@turf/turf';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { MapService } from '../../../core/services/home/map/map.service';

// IMPORTS de Geoman:
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
    if (id === 1) {
      this.enableRectangleDraw();
    }
    if (id === 2) {
      this.enablePolylineDraw();
    }
    if (id === 3) {
      this.enablePolygonDraw();
    }
    if (id === 4) {
      this.clearSelection();
    }
  }

  private initGeoman() {
    if (!this.map) { return; }

    // 1) Creamos un layerGroup donde se añadirá el polígono
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

    // 3) Escuchamos el evento de creación
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
      // deshabilitamos el modo dibujo
      this.map?.pm.disableDraw();
      this.drawing = false;
    });
  }

  // enablePolygonDraw() {
  //   if (!this.map) { return; }
  //   this.map.pm.enableDraw('Polygon', {
  //     allowSelfIntersection: false,
  //     finishOn: 'dblclick',      // cierra con doble‑clic
  //     pathOptions: { color: '#bada55' }
  //   });                          
  //   this.drawing = true;
  // }

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
    }
  }

  // private selectPointsInPolygon(polygon: L.Polygon) {
  //   if (!this.map) { return; }

  //   const polyGeo = polygon.toGeoJSON() as Feature<Polygon>;
  //   const seleccionados: L.Marker[] = [];

  //   this.markerClusterGroup.forEach(marker => {
  //     const latlng = marker.getLatLng();
  //     const pt = turf.point([latlng.lng, latlng.lat]);
  //     if (turf.booleanPointInPolygon(pt, polyGeo)) {
  //       seleccionados.push(marker);
  //     }
  //   });

  //   console.log('Puntos dentro del polígono:', seleccionados);
  // }

  private selectPointsInPolygon(polygon: L.Polygon) {
    if (!this.map || !this.markerClusterGroup) { return; }

    const polyGeo = polygon.toGeoJSON() as Feature<Polygon>;
    const seleccionados: L.Marker[] = [];

    // 1) Recorremos cada capa del cluster
    this.markerClusterGroup.getLayers().forEach(layer => {
      if (layer instanceof L.Marker) {
        // marcador “suelo” en el cluster
        seleccionados.push(layer);
      } else {
        // puede ser un sub‑cluster
        const sub = layer as any;
        if (typeof sub.getAllChildMarkers === 'function') {
          seleccionados.push(...sub.getAllChildMarkers());
        }
      }
    });

    const dentro: L.Marker[] = [];
    seleccionados.forEach(marker => {
      const { lat, lng } = marker.getLatLng();
      const pt = turf.point([lng, lat]);
      if (turf.booleanPointInPolygon(pt, polyGeo)) {
        dentro.push(marker);
      }
    });

    console.log('Puntos dentro del polígono:', dentro);
  }

  private handlePolygonOrRectangle(layer: L.Polygon) {
    // limpieza previa
    if (this.currentPolygon) this.drawLayer.removeLayer(this.currentPolygon);
    this.currentPolygon = layer;
    this.drawLayer.addLayer(layer);
    this.selectPointsInPolygon(layer);
  }

  private handlePolyline(layer: L.Polyline) {
    // añade al mapa para que se vea
    this.drawLayer.addLayer(layer);
    this.measurePolyline(layer);
  }

  private measurePolyline(line: L.Polyline) {
    const latlngs = line.getLatLngs() as L.LatLng[];
    let totalMeters = 0;
    for (let i = 1; i < latlngs.length; i++) {
      totalMeters += latlngs[i - 1].distanceTo(latlngs[i]);
    }

    // Mostrar resultado en consola o en un popup
    console.log(`Distancia total: ${totalMeters.toFixed(2)} m`);

    // Opcional: mostrar en popup en el centro de la línea
    const midIndex = Math.floor(latlngs.length / 2);
    const midPoint = latlngs[midIndex];
    L.popup({ closeOnClick: false, autoClose: false })
      .setLatLng(midPoint)
      .setContent(`<b>${(totalMeters / 1000).toFixed(3)} km</b>`)
      .openOn(this.map!);
  }

}
