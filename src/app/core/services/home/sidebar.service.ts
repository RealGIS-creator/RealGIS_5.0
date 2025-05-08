import { Injectable } from '@angular/core';
import { SideBar } from '../../../interfaces/sidebar';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() { }

  getSideBar(): SideBar[] {
    return [
      // { image: 'sidebar_layer', type: 'dark', id: 1, label: 'Capas' },
      { image: 'sidebar_search', type: 'dark', id: 1, label: 'Búsqueda', allow: ['consulta', 'admin'] },
      // { image: 'sidebar_add_layer', type: 'dark', id: 3, label: 'Importar Capa' },
      // { image: 'sidebar_print', type: 'dark', id: 4, label: 'Imprimir' },
      { image: 'sidebar_download', type: 'dark', id: 2, label: 'Descargas', allow: ['consulta', 'admin'] },
      { image: 'sidebar_statistics', type: 'dark', id: 3, label: 'Estadísticas', allow: ['consulta', 'admin'] },
      { image: 'sidebar_form', type: 'dark', id: 4, label: 'Formulario', allow: ['admin'] }
    ];
  }
}
