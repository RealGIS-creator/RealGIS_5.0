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
        { image: 'layer', type: 'dark', id: 1 },
        { image: 'search', type: 'dark', id: 2 },
        { image: 'add_layer', type: 'dark', id: 3 },
        { image: 'print', type: 'dark', id: 4 },
        { image: 'download', type: 'dark', id: 5 },
        { image: 'statistics', type: 'dark', id: 6 },
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
        
        type == 'dark' ? this.imagesDefault[id-1].type = 'ligth' : this.imagesDefault[id-1].type = 'dark' ;
    }

    // isSidebarOpen = false;

    // activeIndex: number | null = null;

    // toggleSidebar(index: number) {
    //     this.activeIndex = this.activeIndex === index ? null : index;
    // }
}
