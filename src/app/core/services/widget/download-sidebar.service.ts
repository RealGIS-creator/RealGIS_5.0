import { Injectable } from '@angular/core';
import { SearchCriteria } from '../../../interfaces/search-criteria';

@Injectable({
  providedIn: 'root'
})
export class DownloadSidebarService {

  constructor() { }

  getSearchCriteria(): any[] {
    return [
      { label: 'Descargar CSV', id: '1' },
      { label: 'Descargar Excel', id: '2' },
      { label: 'Descargar Geodatabase', id: '3' }
    ];
  }
}
