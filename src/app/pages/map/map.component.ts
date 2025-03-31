import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/home/navbar/navbar.component';
import { SidebarComponent } from '../../components/home/sidebar/sidebar.component';
import { FooterComponent } from '../../components/home/footer/footer.component';
import { MapMainComponent } from '../../components/home/map-main/map-main.component';

@Component({
    selector: 'app-map',
    imports: [NavbarComponent, SidebarComponent, FooterComponent, RouterOutlet, MapMainComponent],
    templateUrl: './map.component.html',
    styleUrl: './map.component.less'
})
export class MapComponent {

}
