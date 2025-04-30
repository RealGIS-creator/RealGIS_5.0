import L from 'leaflet';

import { Component, inject, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';
import { GeometryService } from '../../../core/services/home/map/geometry.service';
import { ContactCardComponent } from '../../widget/contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { Subject, from } from 'rxjs';
import { takeUntil, tap, map, concatMap, filter } from 'rxjs/operators';
import { LocationService } from '../../../core/services/home/map/location.service';
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';
import { MapService } from '../../../core/services/home/map/map.service';
import { StatisticsComponent } from '../../widget/statistics/statistics.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-map-main',
  imports: [ToolbarComponent, ToolbarMapVerticalComponent, StatisticsComponent, CommonModule],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.less'
})
export class MapMainComponent implements OnInit, OnDestroy, AfterViewInit {
  private map!: L.Map;
  private location!: [number, number];
  private zoom!: number;
  zoomLevel = 8;
  private wmsLayers: L.TileLayer.WMS[] = [];

  private markerClusterGroup!: L.MarkerClusterGroup;
  private loadedTiles = new Set<string>();
  private addedFeatureIds = new Set<string>();
  private destroy$ = new Subject<void>();

  private dialogService = inject(DialogService);

  constructor(
    private locationService: LocationService,
    private geometryService: GeometryService,
    private mapService: MapService
  ) {
    this.getLocateMap();
  }

  showStatistics = false;
  statisticsHeight = 0;
  toolbarLeftPercent = 50;   // 50% o 25%
  toolbarRight: string = '10px';  // '10px' o '50%'

  @ViewChild('stats') statsEl?: ElementRef<HTMLElement>;
  toggleStatistics() {
    this.showStatistics = !this.showStatistics;

    // Permite que Angular renderice el cambio de clase
    setTimeout(() => this.updateLayout(), 0);
  }

  private updateLayout() {
    if (this.statsEl && this.showStatistics) {
      const el = this.statsEl.nativeElement;
      this.statisticsHeight = el.offsetHeight;
      // Cuando las estadísticas ocupan el 50% del ancho, el centro de la zona restante es 25%
      this.toolbarLeftPercent = 25;
      this.toolbarRight = '50%';
    } else {
      this.statisticsHeight = 0;
      this.toolbarLeftPercent = 50;
      this.toolbarRight = '10px';
    }
  }

  ngOnInit(): void {
    this.initMap();
    this.getLayer()

    this.locationService.pointData$
      .pipe(
        filter((pd): pd is any => pd != null),
        takeUntil(this.destroy$)
      )

    // punto enfocar
    this.locationService.pointDataParam$
      .pipe(
        filter(
          (pd): pd is [number, number] =>
            pd != null && Array.isArray(pd) && pd.length === 2
        ),
        takeUntil(this.destroy$),
        tap(([lat, lng]) => {
          if (this.map && this.markerClusterGroup) {
            const allMarkers = this.markerClusterGroup.getLayers() as L.Marker[];
            const target = allMarkers.find(m => {
              const ll = m.getLatLng();
              return ll.lat === lat && ll.lng === lng;
            });

            if (target) {
              this.markerClusterGroup.zoomToShowLayer(target, () => {
                const highlightOpts: L.CircleMarkerOptions = {
                  radius: (target as any)._icon?.offsetWidth / 2 || 8,
                  fillColor: '#ff0000',     // rojo para resaltar
                  color: '#000',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 1
                };
                const highlightIcon = this.createCircleDivIcon(highlightOpts);

                target.setIcon(highlightIcon);

                const { lat: tLat, lng: tLng } = target.getLatLng();
                target
                  .bindPopup(
                    `Lat: ${tLat.toFixed(6)}, Lng: ${tLng.toFixed(6)}`,
                    { closeButton: true, autoClose: true }
                  )
                  .openPopup();
              });
            } else {
              this.map.flyTo([lat, lng], 18, { animate: true });
            }
          }
        })
      )
      .subscribe();
    // final punto enfocar

    this.mapService.updateZoomLevel(this.updateScale());
  }

  ngAfterViewInit(): void {
    if (this.map) {
      this.initCluster();
      this.loadTiles();

      this.map.on('moveend', () => this.loadTiles());
      this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        this.mapService.updateCursorCoords([lat, lng]);
      });

      this.map.on('zoomend', () => {
        this.mapService.updateZoomLevel(this.updateScale());
        this.zoomLevel = this.map.getZoom();
      });
    }
  }

  private updateScale(): number {
    const mapSize = this.map.getSize();
    const y = mapSize.y / 2;

    const pointA = this.map.containerPointToLatLng([0, y]);
    const pointB = this.map.containerPointToLatLng([100, y]);

    const distanceMeters = pointA.distanceTo(pointB);
    const distanceKm = distanceMeters / 1000;

    const roundedKm = Math.round(distanceKm);
    return roundedKm;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.off('moveend');
      this.map.off('zoomend');
    }
  }

  /**
   * Carga datos en teselas geográficas de tamaño fijo, sin recargar las ya solicitadas.
   */

  private getTileSizeForZoom(zoom: number): number {
    if (zoom <= 5) return 5.0;    // Continental view: 5° tiles
    if (zoom <= 8) return 2.0;    // Regional view: 2° tiles
    if (zoom <= 12) return 1.0;   // Sub-regional: 1° tiles
    if (zoom <= 15) return 0.5;   // Local: 0.5° tiles
    return 0.25;                  // Detailed: 0.25° tiles
  }

  private loadTiles(): void {
    const zoom = this.map.getZoom();
    const tileSize = this.getTileSizeForZoom(zoom);
    const bounds = this.map.getBounds();

    const xMin = Math.floor(bounds.getWest() / tileSize);
    const xMax = Math.floor(bounds.getEast() / tileSize);
    const yMin = Math.floor(bounds.getSouth() / tileSize);
    const yMax = Math.floor(bounds.getNorth() / tileSize);

    const tiles: Array<{ x: number; y: number; key: string }> = [];
    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {
        const key = `${zoom}-${x}-${y}`;
        if (!this.loadedTiles.has(key)) {
          tiles.push({ x, y, key });
        }
      }
    }

    from(tiles)
      .pipe(
        concatMap(tile => {
          const westLng = tile.x * tileSize;
          const eastLng = (tile.x + 1) * tileSize;
          const southLat = tile.y * tileSize;
          const northLat = (tile.y + 1) * tileSize;
          return this.geometryService.getGeoJsonData(northLat, southLat, eastLng, westLng).pipe(
            takeUntil(this.destroy$),
            tap(resp => this.loadedTiles.add(tile.key)),
            map(resp => resp.SDT_GeoJson)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(json => {
        if (json) this.addMarkers(json);
      });

  }

  private initMap(): void {
    // const baseMapURl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    // this.map = L.map('map', { zoomControl: false, maxZoom: 18, minZoom: 3, attributionControl: false });
    // L.tileLayer(baseMapURl).addTo(this.map);
    // this.resetMap();
    // //this.initCluster();
    // this.mapService.setMap(this.map);

    const baseMapURL = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    this.map = L.map('map', { zoomControl: false, maxZoom: 18, minZoom: 3, attributionControl: false, })
      .setView(this.location, this.zoom);
    L.tileLayer(baseMapURL, {
      // opacity: 0.8
    }).addTo(this.map);
    this.mapService.setMap(this.map);
  }

  private getLayer() {
    const configs = this.geometryService.getAllLayersConfig()
    configs.forEach(async config => {
      const url = this.geometryService.getWMSLayersURL();
      const options = this.geometryService.getWMSLayersParams(config);
      const layer = L.tileLayer.wms(url, options);
      layer.addTo(this.map);              
      this.wmsLayers.push(layer);        
    });

    const overlays = this.wmsLayers.reduce((acc, layer, idx) => {
      const key = configs[idx].layerName;
      acc[key] = layer;
      return acc;
    }, {} as Record<string, L.TileLayer.WMS>);

    L.control.layers({}, overlays, { collapsed: false })
      .addTo(this.map);
  }

  private initCluster(): void {
    this.markerClusterGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: true,
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,
      iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({ html: `<div class="custom-cluster">${count}</div>`, className: 'marker-cluster-custom', iconSize: L.point(40, 40) });
      }
    });
    this.map.addLayer(this.markerClusterGroup);
  }

  private addMarkers(data: any): void {
    const greenOpts: L.CircleMarkerOptions = { radius: 8, fillColor: '#157d35', color: '#000', weight: 1, opacity: 1, fillOpacity: 1 };
    const orangeOpts: L.CircleMarkerOptions = { radius: 8, fillColor: '#d75810', color: '#000', weight: 1, opacity: 1, fillOpacity: 1 };

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const opts = feature.properties.TipoDireccionCod === 1 ? greenOpts : orangeOpts;
        const icon = this.createCircleDivIcon(opts);
        const marker = L.marker(latlng, { icon });
        (marker as any).feature = feature;
        return marker;
      }
    }).eachLayer(layer => {
      if (layer instanceof L.Marker) {
        const feature = (layer as any).feature;
        const id = feature.properties.Direccion_Id;
        const acct = feature.properties.AcreditadoNumCuen;
        if (!this.addedFeatureIds.has(id)) {
          this.addedFeatureIds.add(id);
          layer.on('click', e => {
            const loc = (e.target as L.Marker).getLatLng();
            this.map.flyTo(loc, 17, { animate: false });
            this.showCardUser(acct, id);
          });
          this.markerClusterGroup.addLayer(layer);
        }
      }
    });
    this.mapService.setMarkerClusterGroup(this.markerClusterGroup);
  }

  private updateMarkers(data: any): void {
    const baseOpts: L.CircleMarkerOptions = {
      radius: 8,
      fillColor: "#FFA500",
      color: "#000000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
    const greenOpts = { ...baseOpts, fillColor: "#157d35" };
    const orangeOpts = { ...baseOpts, fillColor: "#d75810" };

    // 1) Inicializa o limpia el cluster
    if (!this.markerClusterGroup) {
      this.markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        iconCreateFunction: cluster => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div class="custom-cluster">${count}</div>`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40)
          });
        }
      });
      this.map.addLayer(this.markerClusterGroup);
    } else {
      this.markerClusterGroup.clearLayers();
    }

    // 2) Creamos una capa GeoJSON que devuelve L.Marker con DivIcon
    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const opts = feature.properties.TipoDireccionCod === 1 ? greenOpts : orangeOpts;
        const icon = this.createCircleDivIcon(opts);
        const marker = L.marker(latlng, { icon });
        // guarda la feature para referencia futura
        (marker as any).feature = feature;
        // click handler (igual que antes)
        marker.on("click", e => {
          // tu lógica de click aquí...
        });
        return marker;
      }
    });

    // 3) Añadimos cada marcador al cluster
    geoJsonLayer.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        this.markerClusterGroup!.addLayer(layer);
      }
    });

    // 4) Emitimos el cluster YA poblado
    this.mapService.setMarkerClusterGroup(this.markerClusterGroup);
  }

  private focusOnPoint(adressId: string, latitude?: number, longitude?: number): void {

    const all = this.markerClusterGroup.getLayers() as L.CircleMarker[];
    const target = all.find(
      m => m.feature?.properties?.Direccion_Id === adressId
    );

    if (target) {
      const parent = this.markerClusterGroup.getVisibleParent(
        target as any as L.Marker
      );
      if (parent) {
        this.map.fitBounds((parent as any).getBounds());
      }

      const ll = target.getLatLng();
      this.map.setView(ll, this.map.getMaxZoom());
      target.openPopup();
      target.setStyle({ radius: 12, fillColor: '#ff0000' });

    } else if (latitude != null && longitude != null) {
      const delta = 0.01; // ~1km aprox.
      const north = latitude + delta, south = latitude - delta;
      const east = longitude + delta, west = longitude - delta;

      this.geometryService.getGeoJsonData(north, south, east, west)
        .pipe(takeUntil(this.destroy$))
        .subscribe(resp => {
          const json = resp.SDT_GeoJson;
          // 4) actualizo markers y vuelvo a intentar enfoque
          this.updateMarkers(json);
          // this.focusOnPoint(adressId, latitude, longitude);
        });
    } else {
      console.warn(`Ni marcador ni lat/lng disponibles para Direccion_Id ${adressId}`);
    }
  }

  private createCircleDivIcon(opts: L.CircleMarkerOptions): L.DivIcon {
    const size = opts.radius! * 2;
    const border = opts.weight ?? 0;
    const color = opts.fillColor as string;
    const stroke = opts.color as string;
    const fillOpacity = opts.fillOpacity ?? 1;
    const html = `<div style="width:${size}px;height:${size}px;background-color:${color};border:${border}px solid ${stroke};border-radius:50%;opacity:${fillOpacity};"></div>`;
    return L.divIcon({ className: '', html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
  }

  private getLocateMap(): void {
    const response = this.locationService.getLocationInitial();
    this.location = response.location as [number, number];
    this.zoom = response.zoom;
  }

  onZoomChange(newZoom: number): void {
    this.zoomLevel = newZoom;
    this.map.setZoom(this.zoomLevel);
  }

  resetMap(): void {
    this.map.setView(this.location, this.zoom);
  }

  zoomIn(): void {
    if (this.zoomLevel < 18) this.map.setZoom(++this.zoomLevel);
  }

  zoomOut(): void {
    if (this.zoomLevel > 3) this.map.setZoom(--this.zoomLevel);
  }

  onRangeChange(newZoom: number): void {
    this.zoomLevel = newZoom;
    this.onZoomChange(this.zoomLevel);
  }

  locateUser(): void {
    this.map.locate({ setView: true, maxZoom: 16 });
    this.map.on('locationfound', (e: any) => this.onLocationFound(e));
    this.map.on('locationerror', (e: any) => this.onLocationError(e));
  }

  onLocationFound(e: any): void {
    const radius = e.accuracy / 2;
    // L.marker(e.latlng).addTo(this.map).bindPopup('You are within ' + radius + ' meters from this point').openPopup();

    L.circle(e.latlng, {
      radius: radius,
    }).addTo(this.map);
  }

  onLocationError(e: any): void {
    alert(e.message);
  }

  showCardUser(infoInput: string, infoAdress: string): void {
    const data = { filterName: 'AcreditadoNumCuen', filterValue: infoInput, idAdress: infoAdress };
    this.dialogService.closeAll();
    this.dialogService.open({ component: ContactCardComponent, data });
  }
}


