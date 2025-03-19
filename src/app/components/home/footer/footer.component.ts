import { Component } from '@angular/core';
import { FooterService } from '../../../core/services/footer.service';

@Component({
    selector: 'app-footer',
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.less'
})
export class FooterComponent {

    public logoCompany?: string;

    constructor(
        private footerService: FooterService
    ) {}

    ngOnInit() {
        this.getIconCompany();
    }

    getIconCompany(): void {
        const logo = this.footerService.getFooterLogo();
        this.logoCompany = logo.logoCompany
    }
}
