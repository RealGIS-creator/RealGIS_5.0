import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { LocationService } from '../../../core/services/map/location.service';
import { ToolbarMapVerticalComponent } from '../../widget/toolbar-map-vertical/toolbar-map-vertical.component';
import { ToolbarComponent } from '../../widget/toolbar/toolbar.component';

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


  constructor(
    private locationService: LocationService
  ) {
    this.getLocateMap()
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
    console.log(this.location)
    console.log(this.zoom)
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
}
