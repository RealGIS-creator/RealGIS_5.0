import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as shpwrite from '@mapbox/shp-write';
import JSZip from 'jszip';
import { FeatureCollection, Feature, Point } from 'geojson';
import { DownloadOptions, ZipOptions, Compression, OutputType } from '@mapbox/shp-write';

@Injectable({
  providedIn: 'root'
})
export class ExportableService {

  constructor() { }

  // EXPORTAR CSV
  public exportToCSV(data: any[], filename: string): void {
    console.log('entra 1');
    if (!data || !data.length) {
      return;
    }
    console.log('entra 2');

    const separator = ',';
    const keys = Object.keys(data[0]);
    const csvContent =
      keys.join(separator) + '\n' +
      data.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }

  public exportLargeDataToCsvZip(data: any[], filenameBase: string): void {
    const chunkSize = 50000;
    const zip = new JSZip();
  
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const csvContent = this.convertToCsv(chunk);
      zip.file(`${filenameBase}_${i / chunkSize + 1}.csv`, csvContent);
    }
  
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${filenameBase}.zip`);
    });
  }
  
  private convertToCsv(data: any[]): string {
    if (!data || !data.length) {
      return '';
    }
  
    const separator = ',';
    const keys = Object.keys(data[0]);
    const csvContent =
      keys.join(separator) + '\n' +
      data.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');
  
    return csvContent;
  }

  // EXPORTAR EXCEL
  public exportToExcel(data: any[], filename: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${filename}.xlsx`);
  }

  public exportLargeDataToExcelZip(data: any[], filenameBase: string): void {
    const chunkSize = 50000;
    const zip = new JSZip();

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(chunk);
      const workbook: XLSX.WorkBook = {
        Sheets: { 'data': worksheet },
        SheetNames: ['data']
      };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      zip.file(`${filenameBase}_${i / chunkSize + 1}.xlsx`, excelBuffer);
    }

    zip.generateAsync({ type: 'blob' }).then((content: any) => {
      saveAs(content, `${filenameBase}.zip`);
    });
  }

  // EXPORTAR SHAPEFILE

  // public exportToShapefile(geojson: FeatureCollection, filename: string): void {
  //   const options: DownloadOptions & ZipOptions = {
  //     folder: filename,
  //     types: {
  //       point: filename,
  //       polygon: filename,
  //       line: filename
  //     },
  //     compression: 'DEFLATE' as Compression,   
  //     outputType: 'blob' as OutputType         
  //   };
  //   shpwrite.download(geojson, options);  
  // }

  // public exportToShapefileAsZip(
  //   geojson: FeatureCollection,
  //   filename: string
  // ): void {
  //   // @ts-ignore: zip no está tipado
  //   const buffer: ArrayBuffer = shpwrite.zip(geojson);
  //   const blob = new Blob([buffer], { type: 'application/zip' });
  //   saveAs(blob, `${filename}.zip`);
  // }

  public exportToShapefile(geoJsonPuntos: FeatureCollection, name: string ): void {

    const filename = name;
    const options: DownloadOptions & ZipOptions = {
      folder: filename,
      types: {
        point: filename,
      },
      compression: 'DEFLATE' as Compression,
      outputType: 'blob' as OutputType,
    };

    shpwrite.download(geoJsonPuntos, options);
  }

  public exportMultiplePointsAsZip(geoJsonPuntos: FeatureCollection): void {

    const filename = 'puntos_exportados';
    // @ts-ignore: zip no está tipado completamente
    const buffer: ArrayBuffer = shpwrite.zip(geoJsonPuntos, {
      types: { point: filename },
    });
    const blob = new Blob([buffer], { type: 'application/zip' });
    saveAs(blob, `${filename}.zip`);
  }

}
