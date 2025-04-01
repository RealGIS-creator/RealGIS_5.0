import { Injectable } from '@angular/core';
import { SideBar } from '../../../interfaces/sidebar';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  getSideBar(): SideBar[] {
    return [
      //{ image: 'sidebar_layer', type: 'dark', id: 1, label: 'Capas' },
      { image: 'sidebar_search', type: 'dark', id: 2, label: 'Búsqueda' },
      { image: 'sidebar_search', type: 'dark', id: 3, label: 'Catalogo' },
      //{ image: 'sidebar_add_layer', type: 'dark', id: 3, label: 'Importar Capa' },
      //{ image: 'sidebar_print', type: 'dark', id: 4, label: 'Imprimir' },
      //{ image: 'sidebar_download', type: 'dark', id: 5, label: 'Descargas' },
      { image: 'sidebar_statistics', type: 'dark', id: 6, label: 'Estadísticas' },
    ];
  }
}
