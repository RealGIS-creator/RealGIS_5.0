import { Injectable } from '@angular/core';
import { InfoUser } from '../../../interfaces/info-user';

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

  getInformationUser(): InfoUser[] {
    return [
      {id: '100045224'},
      {id: '7800474274'}
    ]
  }
}
