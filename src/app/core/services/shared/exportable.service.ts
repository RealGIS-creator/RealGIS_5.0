import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportableService {

  constructor() { }

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

  public exportToExcel(data: any[], filename: string): void {
    console.log('entra 1');

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'data': worksheet },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${filename}.xlsx`);
  }
}
