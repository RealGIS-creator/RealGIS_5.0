import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { SearchCriteria } from '../../../interfaces/search-criteria';
import { DownloadSidebarService } from '../../../core/services/widget/download-sidebar.service';
import { CommonModule } from '@angular/common';
import { ExportableService } from '../../../core/services/shared/exportable.service';
import { FeatureCollection } from 'geojson';
import { MapService } from '../../../core/services/home/map/map.service';
import { GeoJsonData, GeoJsonDataBaseCliente } from '../../../interfaces/geoJson';

@Component({
  selector: 'app-download',
  imports: [CommonModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.less'
})
export class DownloadComponent {
  optionSearch: any[] = [];
  isVisible: boolean = false;
  selectedOption: string = 'Tipo de Descarga';
  selectedOptionID: number = 0;
  infoSeacher: any[] = [];
  infoClient: any[] = [];
  placeholderText = '';
  dataFilter?: SearchCriteria;
  isLoading: boolean = false;
  geojson!: FeatureCollection;

  constructor(
    private downloadSidebarService: DownloadSidebarService,
    private cdr: ChangeDetectorRef,
    private mapService: MapService,
    private exportableService: ExportableService
  ) {
  }

  ngOnInit(): void {
    this.getSearchCriteria();

    this.mapService.selectedIds$.subscribe(ids => {
      console.log('Ahora en el servicio tengo estos Direccion_Id:', ids);
    });
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
        if (this.isLoading) return; 

        this.isLoading = true;
        this.downloadSidebarService.getInformationClient()
          .subscribe({
            next: (response) => {
              const infoClient = response.SDT_BaseCliente;
              //console.log('excel: ', infoClient)
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
              //console.log('shapeFile: ', this.geojson)             
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

  // private handleExport(
  //   response: ClientResponse | GeoJsonDataBaseCliente,
  //   type: number
  // ): void {
  //   switch (type) {
  //     case 1: // CSV
  //       this.exportableService.exportLargeDataToCsvZip(
  //         (response as ClientResponse).SDT_BaseCliente,
  //         'BaseClienteCSV'
  //       );
  //       break;
  //     case 2: // Excel
  //       this.exportableService.exportLargeDataToExcelZip(
  //         (response as ClientResponse).SDT_BaseCliente,
  //         'BaseClienteXLSX'
  //       );
  //       break;
  //     case 3: // Shapefile
  //       this.exportableService.exportToShapefile(
  //         (response as GeoJsonDataBaseCliente).SDT_BaseClienteGeoJson,
  //         'BaseClienteShapeFile'
  //       );
  //       break;
  //     default:
  //       console.warn('Tipo de descarga desconocido');
  //   }
  // }

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
