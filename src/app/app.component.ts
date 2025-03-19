import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/home/navbar/navbar.component';
import { SidebarComponent } from './components/home/sidebar/sidebar.component';
import { FooterComponent } from './components/home/footer/footer.component';
import { MapMainComponent } from './components/home/map-main/map-main.component';

@Component({
    selector: 'app-root',
    imports: [NavbarComponent, SidebarComponent, FooterComponent, RouterOutlet, MapMainComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'banistmo_5.0';
}
