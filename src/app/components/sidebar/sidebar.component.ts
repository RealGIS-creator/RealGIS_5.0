import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.less'
})
export class SidebarComponent {

    activeIndex: number | null = null;

    public imagesDefault = [ 
        { image: 'layer', type: 'dark', id: 1, label: 'Capas' },
        { image: 'search', type: 'dark', id: 2, label: 'Búsqueda' },
        { image: 'add_layer', type: 'dark', id: 3, label: 'Importar Capa' },
        { image: 'print', type: 'dark', id: 4, label: 'Imprimir' },
        { image: 'download', type: 'dark', id: 5, label: 'Descargas' },
        { image: 'statistics', type: 'dark', id: 6, label: 'Estadísticas' },
    ];

    // public imagesOpenClick = [ 
    //     { image: 'layer', type: 'ligth', id: 1 },
    //     { image: 'search', type: 'ligth', id: 2 },
    //     { image: 'add_layer', type: 'ligth', id: 3 },
    //     { image: 'print', type: 'ligth', id: 4 },
    //     { image: 'download', type: 'ligth', id: 5 },
    //     { image: 'statistics', type: 'ligth', id: 6 },
    // ];

    onChangeImage(id: number, type: string): void {
        this.activeIndex = this.activeIndex === id ? null : id;

        this.imagesDefault.forEach(element => {
            element.type = element.type == 'ligth' ? 'dark' : 'dark'
        })
        
        this.imagesDefault[id-1].type = type == 'dark' ? 'ligth' : 'dark' ;
    }
}
