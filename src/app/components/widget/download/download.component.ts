import { Component, inject } from '@angular/core';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { SearchCriteria } from '../../../interfaces/search-criteria';
import { DownloadSidebarService } from '../../../core/services/widget/download-sidebar.service';
import { CommonModule } from '@angular/common';
import { ExportableService } from '../../../core/services/shared/exportable.service';

@Component({
  selector: 'app-download',
  imports: [CommonModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.less'
})
export class DownloadComponent {
  public optionSearch: any[] = [];
  public isVisible: boolean = false;
  public selectedOption: string = 'Tipo de Descarga';
  public selectedOptionID: number = 0;
  public infoSeacher: any[] = [];
  public placeholderText = '';
  public dataFilter?: SearchCriteria;

  private exportableService = inject(ExportableService);  

  constructor(
    private downloadSidebarService: DownloadSidebarService,
  ) {
  }

  ngOnInit(): void {
    this.getSearchCriteria();
  }

  getSearchCriteria(): void {
    this.optionSearch = this.downloadSidebarService.getSearchCriteria()
  }

  clickSearcher(): void {
    this.isVisible = this.isVisible ? false : true;
  }

  selectOption(option: any) {
    this.selectedOption = option.label;
    this.selectedOptionID = option.id;
    this.isVisible = false;
  }

  get displayIcon() {
    return this.isVisible ? 'display_down.svg' : 'display_up.svg';
  }

  clearInformation(): void {
    this.infoSeacher = [];
    this.placeholderText = '';
    this.selectedOption = 'Tipo de Descarga';
  }

  download(): void {
    console.log('selecciono descarga: ', this.selectedOptionID.valueOf())
    const data = [{
      clave1: 'probando valor1',
      clave2: 'probando valor2',
    }]

    switch (this.selectedOption) {
      case "Descargar CSV":
        console.log('llegada 1') 
        this.exportableService.exportToCSV(data, 'pruebaCSV');
        break;
      case "Descargar Excel": 
        this.exportableService.exportToExcel(data, 'pruebaCSV');
        break;
      default:
        console.log('no entra a ninguno')
    }
  }

}
