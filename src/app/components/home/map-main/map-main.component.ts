import { Component, inject } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LocationService } from '../../../core/services/map/location.service';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';
import { GeometryService } from '../../../core/services/home/map/geometry.service';
import { ContactCardComponent } from '../../widget/contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';

@Component({
  selector: 'app-map-main',
  imports: [ToolbarComponent, ToolbarMapVerticalComponent],
  templateUrl: './map-main.component.html',
  styleUrl: './map-main.component.less'
})
export class MapMainComponent {
  private map: any;
  private location!: Array<number>;
  private zoom!: number;
  zoomLevel = 8;

  private markerClusterGroup!: L.MarkerClusterGroup;
  private dialogService = inject(DialogService);

  constructor(
    private locationService: LocationService,
    private geometryService: GeometryService,
  ) {
    this.getLocateMap()
    this.getGeoJsonData();
  }

  private initMap() {
    const baseMapURl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    this.map = L.map('map', {
      zoomControl: false,
      maxZoom: 18,
      minZoom: 3,
    });
    L.tileLayer(baseMapURl).addTo(this.map);
    this.resetMap();
    // this.mapService.setMap(this.map);
    this.map.on('zoomend', () => {
      this.zoomLevel = this.map.getZoom();
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
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

  private getGeoJsonData(): void {
    this.geometryService.getGeoJsonData().subscribe(
      (response) => {
        const json = response.SDT_GeoJson;
  
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
  
        const geoJsonLayer = L.geoJSON(json, {
          pointToLayer: function (feature, latlng) {
            const marker = L.circleMarker(latlng, geojsonMarkerOptions);
  
            marker.on("click", (e: L.LeafletEvent) => {
              if (lastClickedMarker && lastClickedMarker !== marker) {
                lastClickedMarker.setStyle(geojsonMarkerOptions);
                lastClickedMarker.closePopup();
              }
              marker.setStyle({ fillColor: "#0000ff" });
              
              self.showCardUser();
              
              let popupContent = `<div>`;
              if (feature.properties) {
                popupContent += `<strong>Dirección:</strong> ${feature.properties.Direccion_Id}<br/>`;
              }
              popupContent += `</div>`;
  
              marker.bindPopup(popupContent).openPopup();
  
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
        }
  
        this.markerClusterGroup.addLayer(geoJsonLayer);
  
        if (!this.map.hasLayer(this.markerClusterGroup)) {
          this.map.addLayer(this.markerClusterGroup);
        }
  
        this.map.fitBounds(this.markerClusterGroup.getBounds());
  
        // this.markerClusterGroup.on('clusterclick', function (a) {
        //   console.log('Se hizo click en un cluster');
        // });
      },
      (error) => {
        console.error("Error al obtener GeoJSON:", error);
      }
    );
  }
  
  showCardUser(): void {
    const data = {
      filterName: "AcreditadoNumCuen", 
      idAdress: 2
    }
    this.dialogService.closeAll()
    this.dialogService.open({ component: ContactCardComponent, data: data});
    // this.dialogService.open({ component: ContactCardComponent, data: { data: this.dataFilter!.name } });

  }

  private getBindPopup(e: Event): void {

  }
}
