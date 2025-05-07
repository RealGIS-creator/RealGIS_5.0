import L from 'leaflet';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import 'leaflet.markercluster';
import 'leaflet.coordinates/dist/Leaflet.Coordinates-0.1.5.src.js';

import { CommonModule } from '@angular/common';
import { from, fromEvent, Subject } from 'rxjs';
import { takeUntil, debounceTime, filter, tap, concatMap, map } from 'rxjs/operators';

import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { StatisticsComponent } from '../../widget/statistics/statistics.component';
import { ContactCardComponent } from '../../widget/contact-card/contact-card.component';

import { GeometryService } from '../../../core/services/home/map/geometry.service';
import { LocationService } from '../../../core/services/home/map/location.service';
import { MapService } from '../../../core/services/home/map/map.service';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { StatsToggleService } from '../../../core/services/widget/stats-toggle.service';

@Component({
  standalone: true,
  selector: 'app-map-main',
  imports: [
    CommonModule,
    ToolbarComponent,
    ToolbarMapVerticalComponent,
    StatisticsComponent,
  ],
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapMainComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('stats', { read: ElementRef, static: false })
  private statsRef!: ElementRef<HTMLElement>;

  private map!: L.Map;
  private markerCluster!: L.MarkerClusterGroup;
  private wmsLayers: L.TileLayer.WMS[] = [];
  private destroy$ = new Subject<void>();
  // private configLayerControl: any;

  // Estado de marcado y zoom
  lastMarker?: L.CircleMarker | null = null;
  markMode = false;
  zoomLevel = 8;

  // Estadísticas & toolbar
  showStatistics = false;
  toolbarLeftPx = 0;
  toolbarRightPx = 0;
  readonly statisticsHeight = 60;
  readonly toolbarOffset = 10;
  private loadedTiles = new Set<string>();
  private addedFeatureIds = new Set<string>();

  constructor(
    private ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private locationSvc: LocationService,
    private geometrySvc: GeometryService,
    private mapSvc: MapService,
    private dialog: DialogService,
    private statsToggle: StatsToggleService
  ) { }

  ngOnInit(): void {
    this.initMap();
    this.initWmsLayers();
    this.initMarkerCluster();
    this.addLayerControl();
    this.subscribeStatsToggle();

    this.locationSvc.pointDataParam$
    .pipe(
      filter(
        (pd): pd is [number, number] =>
          pd != null && Array.isArray(pd) && pd.length === 2
      ),
      takeUntil(this.destroy$),
      tap(([lat, lng]) => {
        if (this.map && this.markerCluster) {
          console.log(lat,lng)
          const allMarkers = this.markerCluster.getLayers() as L.Marker[];
          const target = allMarkers.find(m => {
            const ll = m.getLatLng();
            return ll.lat === lat && ll.lng === lng;
          });

          if (target) {
            this.markerCluster.zoomToShowLayer(target, () => {
              this.markerCluster.zoomToShowLayer(target, () => {
                const highlightOpts: L.CircleMarkerOptions = {
                  radius: 8, // Ajusta el radio si es necesario
                  fillColor: '#ff0000',
                  color: '#000',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 1
                };
                if (target instanceof L.CircleMarker) {
                  target.setStyle(highlightOpts);
                }
            
                // const { lat: tLat, lng: tLng } = target.getLatLng();
                target
                  .bindPopup(
                    // `Lng: ${tLng.toFixed(6)}, Lat: ${tLat.toFixed(6)}`,
                    `Lng: ${lng}, Lat: ${lat}`,
                    { closeButton: true, autoClose: true }
                  )
                  .openPopup();
              });
            });
          } else {
            this.map.flyTo([lat, lng], 18, { animate: true });
          }
        }
      })
    )
    .subscribe();
  }

  ngAfterViewInit(): void {
    this.setupMapListeners();

    // Posición inicial de toolbar
    setTimeout(() => {
      this.updateToolbarPositions();
      this.cd.markForCheck();
    }, 0);

    // Ajuste en resize
    fromEvent(window, 'resize')
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        setTimeout(() => {
          this.updateToolbarPositions();
          this.cd.markForCheck();
        }, 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) this.map.remove();
  }

  // ─── Inicialización de Leaflet ───────────────────────────────────────────

  private initMap(): void {
    const init = this.locationSvc.getLocationInitial();
    const [lat, lng] = init.location as [number, number];
    this.map = L.map('map', {
      zoomControl: false,
      maxZoom: 18,
      minZoom: 3,
      attributionControl: false,
    }).setView([lat, lng], init.zoom);

    this.zoomLevel = init.zoom;
    L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}').addTo(this.map);
    this.mapSvc.setMap(this.map);
  }

  private initWmsLayers(): void {
    const configs = this.geometrySvc.getAllLayersConfig();
    configs.forEach(cfg => {
      const layer = L.tileLayer.wms(
        this.geometrySvc.getWMSLayersURL(),
        this.geometrySvc.getWMSLayersParams(cfg)
      );
      this.wmsLayers.push(layer);
      layer.addTo(this.map);
    });
  }

  private initMarkerCluster(): void {
    this.markerCluster = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
    });
    this.map.addLayer(this.markerCluster);
    this.debouncedLoadTiles(); // carga inicial
  }

  /** Control de capas: WMS layers + marcador cluster **/
  private addLayerControl(): void {
    const overlays: Record<string, L.Layer> = {
      'Puntos (Cluster)': this.markerCluster,
    };
    this.wmsLayers.forEach((layer, i) => {
      // console.log(layer.options.layers)
      overlays[`${layer.options.layers}`] = layer;
    });
    L.control.layers({}, overlays, { collapsed: false }).addTo(this.map);
  }

  /** Suscribe toggle de estadísticas para reposicionar toolbar **/
  private subscribeStatsToggle(): void {
    this.statsToggle.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.showStatistics = open;
        setTimeout(() => {
          this.updateToolbarPositions();
          this.cd.markForCheck();
        }, 0);
      });
  }

  // ─── Listeners y carga de datos ────────────────────────────────────────────

  private setupMapListeners(): void {
    this.ngZone.runOutsideAngular(() => {
      this.map.on('click', e => {
        if (this.markMode) {
          this.ngZone.run(() => this.onMapClick(e));
        } else {
          if (this.lastMarker) {
            this.map.removeLayer(this.lastMarker);
          }
        }
      });
      this.map.on('moveend', () => this.debouncedLoadTiles());
      this.map.on('zoomend', () => {
        this.ngZone.run(() => {
          this.zoomLevel = this.map.getZoom();
          this.mapSvc.updateZoomLevel(this.zoomLevel);
          this.cd.markForCheck();
          this.debouncedLoadTiles();
        });
      });
      this.map.on('mousemove', (e: L.LeafletMouseEvent) => {
        this.mapSvc.updateCursorCoords([e.latlng.lat, e.latlng.lng]);
      });
    });
  }

  /** Debounce manual para moveend/zoomend **/
  private debouncedLoadTiles = (() => {
    const s = new Subject<void>();
    s.pipe(debounceTime(250), takeUntil(this.destroy$)).subscribe(() => this.loadTiles());
    return () => s.next();
  })();

  /** Carga GeoJSON por teselas y añade círculos al cluster **/
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
          return this.geometrySvc.getGeoJsonData(northLat, southLat, eastLng, westLng).pipe(
            takeUntil(this.destroy$),
            tap(resp => this.loadedTiles.add(tile.key)),
            map(resp => resp.SDT_GeoJson)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(json => {
        if (json) this.addCircles(json);
      });

    // const zoom = this.map.getZoom();
    // const tileSize = this.getTileSizeForZoom(zoom);
    // const bounds = this.map.getBounds();

    // // Calcula tiles visibles
    // const xMin = Math.floor(bounds.getWest() / tileSize);
    // const xMax = Math.floor(bounds.getEast() / tileSize);
    // const yMin = Math.floor(bounds.getSouth() / tileSize);
    // const yMax = Math.floor(bounds.getNorth() / tileSize);

    // const requests: Array<Promise<any>> = [];
    // for (let x = xMin; x <= xMax; x++) {
    //   for (let y = yMin; y <= yMax; y++) {
    //     requests.push(
    //       this.geometrySvc
    //         .getGeoJsonData(
    //           y * tileSize + tileSize,
    //           y * tileSize,
    //           (x + 1) * tileSize,
    //           x * tileSize
    //         )
    //         .toPromise()
    //     );
    //   }
    // }

    // // Una vez se resuelvan todas las promesas, actualizamos cluster de una sola vez
    // Promise.all(requests).then(resps => {
    //   this.markerCluster.clearLayers();
    //   resps.forEach(resp => this.addCircles(resp.SDT_GeoJson));
    // });
  }

  private getTileSizeForZoom(z: number): number {
    if (z <= 5) return 5.0;
    if (z <= 8) return 2.0;
    if (z <= 12) return 1.0;
    if (z <= 15) return 0.5;
    return 0.25;
  }

  /** Añade circleMarkers al cluster, filtrando por viewport y coloreando **/
  // private addCircles(data: any): void {
  //   const bounds = this.map.getBounds();
  //   const features = (data.features || data).filter((feat: any) => {
  //     const [lng, lat] = feat.geometry.coordinates;
  //     return bounds.contains([lat, lng]);
  //   });

  //   features.forEach((feat: any) => {
  //     const [lng, lat] = feat.geometry.coordinates;
  //     const opts: L.CircleMarkerOptions = {
  //       radius: 6,
  //       fillOpacity: 0.8,
  //       color: '#000',
  //       weight: 1,
  //       fillColor: feat.properties.TipoDireccionCod === '1' ? 'green' : 'orange',
  //     };
  //     const circle = L.circleMarker([lat, lng], opts)
  //       .on('click', e => this.onFeatureClick(e, feat));
  //     this.markerCluster.addLayer(circle);
  //   });

  //   console.log('info cluster: ', this.markerCluster)
  //   this.mapSvc.setMarkerClusterGroup(this.markerCluster);
  // }

  
  private addCircles(data: any): void {
    const greenOpts: L.CircleMarkerOptions = { radius: 6, fillColor: '#157d35', color: '#000', weight: 1, opacity: 1, fillOpacity: 0.8 };
    const orangeOpts: L.CircleMarkerOptions = { radius: 6, fillColor: '#d75810', color: '#000', weight: 1, opacity: 1, fillOpacity: 0.8 };

    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        const opts = feature.properties.TipoDireccionCod == "1" ? greenOpts : orangeOpts;
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
          this.markerCluster.addLayer(layer);
        }
      }
    });
    this.mapSvc.setMarkerClusterGroup(this.markerCluster);
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
 

  /** Maneja clic en circleMarker **/
  private onFeatureClick(e: L.LeafletMouseEvent, feat: any): void {
    const circle = e.target as L.CircleMarker;
    const { lat, lng } = circle.getLatLng();
    this.map.flyTo([lat, lng], 17, { animate: false });
    circle
      .bindPopup(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
      .openPopup();
    this.showCardUser(feat.properties.AcreditadoNumCuen, feat.properties.Direccion_Id);
  }

  // ─── Mark Mode ──────────────────────────────────────────────────────────────

  toggleMarkMode(): void {
    this.markMode = !this.markMode;
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (this.lastMarker) {
      this.map.removeLayer(this.lastMarker)
      this.lastMarker = null
    };
    this.lastMarker = L.circleMarker(e.latlng, {
      radius: 6,
      fillOpacity: 1,
      color: '#000',
      weight: 1,
      fillColor: 'blue',
    })
      .addTo(this.map)
      // .bindPopup(`Lat: ${e.latlng.lat.toFixed(6)}, Lng: ${e.latlng.lng.toFixed(6)}`)
      .bindPopup(`Lng: ${e.latlng.lng.toFixed(6)},Lat: ${e.latlng.lat.toFixed(6)}`)
      .openPopup();
  }

  // ─── Estadísticas & Toolbar ────────────────────────────────────────────────

  onStatsToggled(): void {
    this.showStatistics = !this.showStatistics;
    setTimeout(() => {
      this.updateToolbarPositions();
      this.cd.markForCheck();
    }, 0);
  }

  private updateToolbarPositions(): void {
    const el = this.statsRef?.nativeElement;
    const statsW = this.showStatistics && el
      ? el.getBoundingClientRect().width
      : 0;
    const parentW = el?.parentElement
      ? (el.parentElement as HTMLElement).getBoundingClientRect().width
      : 0;
    this.toolbarLeftPx = (parentW - statsW) / 2;
    this.toolbarRightPx = statsW + this.toolbarOffset;
  }

  // ─── Acciones del Toolbar ───────────────────────────────────────────────────

  resetMap(): void {
    const init = this.locationSvc.getLocationInitial();
    const [lat, lng] = init.location as [number, number];
    this.map.setView([lat, lng], init.zoom);
    if (this.lastMarker) {
      this.map.removeLayer(this.lastMarker);
      this.lastMarker = undefined;
    }
  }

  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }

  onRangeChange(z: number): void {
    this.map.setZoom(z);
    this.zoomLevel = z;
  }

  locateUser(): void {
    this.map
    .locate({ setView: true, maxZoom: 16 })
    .on('locationfound', e => {
      const latlng = e.latlng;
  
      const myIcon = L.icon({
        iconUrl: 'assets/marker.svg',
        iconSize: [36, 36],       
        iconAnchor: [18, 36],     
        popupAnchor: [0, -30]     
      });
      L.marker(latlng, { icon: myIcon })
        .addTo(this.map)
        // .bindPopup(`Latitud: ${latlng.lat.toFixed(6)}<br>Longitud: ${latlng.lng.toFixed(6)}<br>Precisión: ${e.accuracy.toFixed(2)} metros`)
        .bindPopup(`Longitud: ${latlng.lng.toFixed(6)}<br>Latitud: ${latlng.lat.toFixed(6)}<br>Precisión: ${e.accuracy.toFixed(2)} metros`)
        .openPopup(); 
    })
    .on('locationerror', e => alert(e.message));
  }

  private showCardUser(account: string, addressId: string): void {
    this.dialog.closeAll();
    this.dialog.open({
      component: ContactCardComponent,
      data: {
        filterName: 'AcreditadoNumCuen',
        filterValue: account,
        idAdress: addressId,
      },
    });
  }
}
