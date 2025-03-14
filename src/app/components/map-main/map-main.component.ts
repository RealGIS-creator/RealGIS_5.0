import { Component } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { ToolbarMapVerticalComponent } from "../toolbar-map-vertical/toolbar-map-vertical.component";
import { LocationService } from '../../core/services/map/location.service';
import { LocationMap } from '../../interfaces/location-map';

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

  private initMap(): void {
    this.map = L.map('map', {
      center:  [ 9.0, -80.0 ],
      zoom: this.zoom,
      zoomControl: false
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.map.on('zoomend', () => {
      this.zoomLevel = this.map.getZoom();
    });
    // const marker = L.marker([ 90.730610, -73.935242 ]).addTo(this.map);
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
}
