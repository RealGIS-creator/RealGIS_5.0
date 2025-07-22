import { Component } from '@angular/core';
import { FooterService } from '../../../core/services/home/footer.service';
import { Subscription } from 'rxjs';
import { MapService } from '../../../core/services/home/map/map.service';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.less'
})
export class FooterComponent {

    public logoCompany?: string;
    cursorCoords: [number, number] | null = null;
    zoomLevel: number | null = null;

    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private readonly footerService: FooterService,
        private readonly mapService: MapService
    ) { }

    ngOnInit() {
        this.getIconCompany();
        this.subscriptions.add(
            this.mapService.cursorPosition$.subscribe(coords => {
                this.cursorCoords = coords;
            })
        );

        this.subscriptions.add(
            this.mapService.zoomLevel$.subscribe(zoom => {
                this.zoomLevel = zoom;
            })
        );
    }

    getIconCompany(): void {
        const logo = this.footerService.getFooterLogo();
        this.logoCompany = logo.logoCompany
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
