import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { SearchCriteria } from '../../../interfaces/search-criteria';
import { DownloadSidebarService } from '../../../core/services/widget/download-sidebar.service';
import { CommonModule } from '@angular/common';
import { ExportableService } from '../../../core/services/shared/exportable.service';
import { FeatureCollection } from 'geojson';

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
  public infoClient: any[] = [];
  public placeholderText = '';
  public dataFilter?: SearchCriteria;
  public isLoading: boolean = false;
  public geojson!: FeatureCollection;

  private exportableService = inject(ExportableService);

  constructor(
    private downloadSidebarService: DownloadSidebarService,
    private cdr: ChangeDetectorRef
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
    switch (this.selectedOption) {
      case "Descargar CSV":
        // if (this.infoClient.length == 0) {
        //   this.getInfoClient() 
        //   this.exportableService.exportToCSV(this.infoClient, 'BaseClienteCSV');
        // } else {
        //   this.exportableService.exportToCSV(this.infoClient, 'BaseClienteCSV');
        // }

        if (this.isLoading) return; 

        this.isLoading = true;
        this.downloadSidebarService.getInformationClient()
          .subscribe({
            next: (response) => {
              this.infoClient = response.SDT_BaseCliente;
              this.exportableService.exportLargeDataToCsvZip(this.infoClient, 'BaseClienteCSV');
            },
            error: (err) => {
              console.error('Error al generar exportable', err);
            },
            complete: () => {
              this.isLoading = false;
              this.cdr.markForCheck(); 
            }
          });
        break;
      case "Descargar Excel":
        // if (this.infoClient.length == 0) { 
        //   this.getInfoClient()
        //   this.exportableService.exportToExcel(this.infoClient, 'BaseClienteXLSX');
        // } else {
        //   this.exportableService.exportToExcel(this.infoClient, 'BaseClienteXLSX');
        // }

        if (this.isLoading) return; 

        this.isLoading = true;
        this.downloadSidebarService.getInformationClient()
          .subscribe({
            next: (response) => {
              const infoClient = response.SDT_BaseCliente;
              console.log('excel: ', infoClient)
              this.exportableService.exportLargeDataToExcelZip(infoClient, 'BaseClienteXLSX');
            },
            error: (err) => {
              console.error('Error al generar exportable', err);
            },
            complete: () => {
              this.isLoading = false;
              this.cdr.markForCheck(); 
            }
          });
        break;
      case "Descargar ShapeFile":
        if (this.isLoading) return; 

        this.isLoading = true;
        this.downloadSidebarService.getInformationClientGeoJson()
          .subscribe({
            next: (response) => {
              this.geojson = response.SDT_BaseClienteGeoJson;
              console.log('shapeFile: ', this.geojson)
              this.exportableService.exportToShapefile(this.geojson, 'BaseClienteShapeFile');
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al generar exportable', err);
            },
            complete: () => {
              this.isLoading = false;
              this.cdr.markForCheck(); 
            }
          });
        break
    }
  }

  getInfoClient(): void {
    if (this.isLoading) return; 

    this.isLoading = true;
    this.downloadSidebarService.getInformationClient()
      .subscribe({
        next: (response) => {
          this.infoClient = response.SDT_BaseCliente;
        },
        error: (err) => {
          console.error('Error al generar exportable', err);
        },
        complete: () => {
          this.isLoading = false;
          this.cdr.markForCheck(); 
        }
      });
  }

  getInfoClientGeoJson(): void {
    if (this.isLoading) return; 

    this.isLoading = true;
    this.downloadSidebarService.getInformationClientGeoJson()
      .subscribe({
        next: (response) => {
          this.geojson = response.SDT_BaseClienteGeoJson;
        },
        error: (err) => {
          console.error('Error al generar exportable', err);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  // isGeojsonValid(): boolean {
  //   return Array.isArray(this.geojson!.features)
  //       && this.geojson.features.length > 0;
  // }
}
