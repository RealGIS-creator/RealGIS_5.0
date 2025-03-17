import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MapMainComponent } from "./components/map-main/map-main.component";

@Component({
    selector: 'app-root',
    imports: [NavbarComponent, SidebarComponent, FooterComponent, RouterOutlet, MapMainComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'banistmo_5.0';
}
