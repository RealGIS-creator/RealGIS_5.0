import { Component, inject, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LocationService } from '../../../core/services/map/location.service';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';
import { GeometryService } from '../../../core/services/home/map/geometry.service';
import { ContactCardComponent } from '../../widget/contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-map-main',
  imports: [ToolbarComponent, ToolbarMapVerticalComponent],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.less'
})
export class MapMainComponent implements OnInit, OnDestroy, AfterViewInit {
  private map: any;
  private location!: Array<number>;
  private zoom!: number;
  zoomLevel = 8;

  private markerClusterGroup!: L.MarkerClusterGroup;
  private boundsChange$ = new Subject<L.LatLngBounds>();
  private cache = new Map<string, any>();
  private dialogService = inject(DialogService);
  private destroy$ = new Subject<void>(); 

  constructor(
    private locationService: LocationService,
    private geometryService: GeometryService,
  ) {
    this.getLocateMap();
  }

  ngOnInit(): void {
    this.initMap();

    this.boundsChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged((prev, curr) => prev.equals(curr)),
        takeUntil(this.destroy$)
      )
      .subscribe((bounds) => {
        this.loadPoints(bounds);
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
    this.destroy$.next();
    this.destroy$.complete();
    if (this.map) {
      this.map.off('moveend'); 
    }
  }

  private loadPoints(bounds: L.LatLngBounds): void {
    const boundsKey = this.getBoundsKey(bounds);
    console.log('bounds key: ', boundsKey);

    if (this.cache.has(boundsKey)) {
      console.log('Cache hit for:', boundsKey);
      this.updateMarkers(this.cache.get(boundsKey));
    } else {
      console.log('Cache miss for:', boundsKey);
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const east = bounds.getEast();
      const west = bounds.getWest();

      this.geometryService.getGeoJsonData(north, south, east, west)
        .pipe(takeUntil(this.destroy$)) 
        .subscribe(
          (response) => {
            const json = response.SDT_GeoJson;
            this.cache.set(boundsKey, json);
            this.updateMarkers(json);
          },
          (error) => {
            console.error("Error al obtener GeoJSON:", error);
          }
        );
    }
  }

  private getBoundsKey(bounds: L.LatLngBounds): string {
    const precision = 4;
    return `${bounds.getSouthWest().lat.toFixed(precision)},${bounds.getSouthWest().lng.toFixed(precision)},${bounds.getNorthEast().lat.toFixed(precision)},${bounds.getNorthEast().lng.toFixed(precision)}`;
  }

  private updateMarkers(data: any): void {
    console.log('renderizar info: ', data);

    const geojsonMarkerOptions = {
      radius: 8,
      fillColor: "#FFA500",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };

    let lastClickedMarker: L.CircleMarker | null = null;
    const self = this;

    const geoJsonLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        const marker = L.circleMarker(latlng, geojsonMarkerOptions);

        marker.on("click", (e) => {
          if (lastClickedMarker && lastClickedMarker !== marker) {
            lastClickedMarker.setStyle(geojsonMarkerOptions);
            lastClickedMarker.closePopup();
          }
          marker.setStyle({ fillColor: "#0000ff" });
          e.originalEvent.stopPropagation();

          self.showCardUser(feature.properties.AcreditadoNumCuen, feature.properties.Direccion_Id);

          lastClickedMarker = marker;
        });

        return marker;
      }
    });

    if (!this.markerClusterGroup) {
      this.markerClusterGroup = L.markerClusterGroup({
        spiderfyOnMaxZoom: true,
        iconCreateFunction: function (cluster) {
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

    if (!this.map.hasLayer(this.markerClusterGroup)) {
      this.map.addLayer(this.markerClusterGroup);
    } else {
      this.map.removeLayer(this.markerClusterGroup); 
      this.map.addLayer(this.markerClusterGroup);
    }

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

  getLocateMap(): void {
    const response = this.locationService.getLocationInitial();
    this.location = response.location;
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
    L.marker(e.latlng).addTo(this.map).bindPopup('You are within ' + radius + ' meters from this point').openPopup();

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