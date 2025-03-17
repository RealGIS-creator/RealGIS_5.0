import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearcherSidebarService {

  constructor() { }

  getSearchCriteria(): string[] {
    return [
      "ID de Crédito",
      "No. de Acreditado",
      "Identificación"
    ];
  }
}
