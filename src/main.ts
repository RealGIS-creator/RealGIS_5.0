import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// src/polyfills.ts (o src/main.ts)
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

import * as L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
