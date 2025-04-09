import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LocationService } from '../../../core/services/map/location.service';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';
import { GeometryService } from '../../../core/services/home/map/geometry.service';
import { ContactCardComponent } from '../../widget/contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { environment } from '../../../../environment/environment';
import { debounceTime, distinctUntilChanged, filter, Subject, Subscription, takeUntil } from 'rxjs';

const geojsonMarkerOptions = {
  radius: 4,
  fillColor: "#FFA500",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.9
};

@Component({
  selector: 'app-map-main',
  imports: [ToolbarComponent, ToolbarMapVerticalComponent],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.less'
})
export class MapMainComponent implements OnInit, OnDestroy, AfterViewInit {
  private map!: L.Map;
  private location!: [number, number];
  private zoom!: number;
  private layer: string = environment.layer;
  zoomLevel = 8;

  private markerClusterGroup!: L.MarkerClusterGroup;
  private boundsChange$ = new Subject<L.LatLngBounds>();
  private cache = new Map<string, any>();
  private dialogService = inject(DialogService);
  private destroy$ = new Subject<void>();
  private subscription: Subscription = new Subscription();

  constructor(
    private locationService: LocationService,
    private geometryService: GeometryService,
  ) {
    this.getLocateMap();
  }

  ngOnInit(): void {
    this.initMap();
    // this.loadWFSLayer();

    this.boundsChange$
      .pipe(
        debounceTime(100),
        distinctUntilChanged((prev, curr) => prev.equals(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((bounds) => {
        this.loadPoints(bounds);
      });

      this.locationService.pointData$
      .pipe(
        filter((pd): pd is any => pd !== null),
        takeUntil(this.destroy$)
      )
      .subscribe(pd => {
        // cada vez que updatePointData se llame, llegamos aquí
        console.log('tarjeta: ', pd)
        this.focusOnPoint(pd.address, pd.latitude, pd.longitude);
      });

  }

  ngAfterViewInit(): void {
    if (this.map) {
      this.boundsChange$.next(this.map.getBounds());
      this.map.on('moveend', () => {
        this.boundsChange$.next(this.map.getBounds());
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.off('moveend');
    }
  }

  private loadWFSLayer() {
    let lastClickedMarker: L.CircleMarker | null = null;
    const self = this;
    this.geometryService.getLayer(this.layer)
      .subscribe(data => {
        var dataLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            const marker = L.circleMarker(latlng, geojsonMarkerOptions);
            marker.on("click", (e) => {
              if (lastClickedMarker && lastClickedMarker !== marker) {
                lastClickedMarker.setStyle(geojsonMarkerOptions);
                lastClickedMarker.closePopup();
              }
              marker.setStyle({ fillColor: "#0000ff" });
              e.originalEvent.stopPropagation();

              console.log(feature.properties)
              //self.showCardUser(feature.properties.AcreditadoNumCuen, feature.properties.Direccion_Id);
              lastClickedMarker = marker;
            });
            return marker;
          }
        })
          .on({
            click: (e) => {
              const location = e.latlng;
              this.map.flyTo(location, 17, {
                'animate': false
              })
            }
          })
          .addTo(this.map);
        this.map.fitBounds(dataLayer.getBounds());
      });
  }

  private loadPoints(bounds: L.LatLngBounds): void {
    const key = this.getBoundsKey(bounds);
    if (this.cache.has(key)) {
      this.updateMarkers(this.cache.get(key));
    } else {
      const [north, south, east, west] = [
        bounds.getNorth(), bounds.getSouth(), bounds.getEast(), bounds.getWest()
      ];
      this.geometryService.getGeoJsonData(north, south, east, west)
        .pipe(takeUntil(this.destroy$))
        .subscribe(resp => {
          const json = resp.SDT_GeoJson;
          this.cache.set(key, json);
          this.updateMarkers(json);
        });
    }
  }

  private getBoundsKey(bounds: L.LatLngBounds): string {
    const p = 4;
    const sw = bounds.getSouthWest(), ne = bounds.getNorthEast();
    return `${sw.lat.toFixed(p)},${sw.lng.toFixed(p)},${ne.lat.toFixed(p)},${ne.lng.toFixed(p)}`;
  }

  private updateMarkers(data: any): void {
    const baseOpts: L.CircleMarkerOptions  = {
      radius: 8,
      fillColor: "#FFA500",
      color: "#000000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    };
    const greenOpts = { ...baseOpts, fillColor: "#157d35" };
    const orangeOpts = { ...baseOpts, fillColor: "#d75810" };

    let lastClicked: L.CircleMarker | null = null;

    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        // Marcador circular
        const opts = feature.properties.TipoDireccionCod === 1 ? greenOpts : orangeOpts;
        const marker = L.circleMarker(latlng, opts);
        marker.on("click", e => {
          if (lastClicked && lastClicked !== marker) {
            lastClicked.setStyle(baseOpts);
            lastClicked.closePopup();
          }
          // Zoom al máximo
          const loc = (e.target as L.CircleMarker).getLatLng();
          this.map.flyTo(loc, 17, {
            'animate': false
          })

          marker.setStyle({ ...opts, fillColor: "#0000ff" });
          e.originalEvent.stopPropagation();

          this.showCardUser(feature.properties.AcreditadoNumCuen, feature.properties.Direccion_Id);
          lastClicked = marker;
        });
        return marker;
      }
    });

    // Inicializar o limpiar el cluster
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
    } else {
      this.markerClusterGroup.clearLayers();
    }

    this.markerClusterGroup.addLayer(geoJsonLayer);

    // Reemplazar capa en el mapa
    if (this.map.hasLayer(this.markerClusterGroup)) {
      this.map.removeLayer(this.markerClusterGroup);
    }
    this.map.addLayer(this.markerClusterGroup);
  }

  private initMap() {
    const baseMapURl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    this.map = L.map('map', {
      zoomControl: false,
      maxZoom: 18,
      minZoom: 3,
    });
    L.tileLayer(baseMapURl).addTo(this.map);
    this.resetMap();
    this.map.on('zoomend', () => {
      this.zoomLevel = this.map.getZoom();
    });
  }

  private focusOnPoint(adressId: string, latitude?: number, longitude?: number): void {
    // let target: L.CircleMarker | undefined;

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
          this.focusOnPoint(adressId, latitude, longitude);
        });
    } else {
      console.warn(`Ni marcador ni lat/lng disponibles para Direccion_Id ${adressId}`);
    }
  }

  getLocateMap(): void {
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
    if (this.zoomLevel < 18) {
      this.zoomLevel++;
      this.onZoomChange(this.zoomLevel);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 3) {
      this.zoomLevel--;
      this.onZoomChange(this.zoomLevel);
    }
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
    const data = {
      filterName: "AcreditadoNumCuen",
      filterValue: infoInput,
      idAdress: infoAdress
    };
    this.dialogService.closeAll();
    this.dialogService.open({ component: ContactCardComponent, data: data });
  }
}