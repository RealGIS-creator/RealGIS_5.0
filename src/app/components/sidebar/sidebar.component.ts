import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { SideBar } from '../../interfaces/sidebar';
import { DialogService } from '../../core/services/dialog.service';
import { SearcherSidebarComponent } from '../searcher-sidebar/searcher-sidebar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less',
})
export class SidebarComponent {
  activeIndex: number | null = null;
  imagesDefault: SideBar[] = [];
  private dialogService = inject(DialogService);

  constructor(
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.getIcons()
  }

  getIcons(): void {
    this.imagesDefault = this.sidebarService.getSideBar();
  }

  onChangeImage(id: number, type: string): void {
    this.activeIndex = this.activeIndex === id ? null : id;

    this.imagesDefault.forEach((element) => {
      element.type = element.type == 'ligth' ? 'dark' : 'dark';
    });

    this.imagesDefault[id - 1].type = type == 'dark' ? 'ligth' : 'dark';
  }

  openDialog(img: any) {
    this.activeIndex = 0;
    let componentToLoad: any = null;
    let dialogData: any = null;

    switch (img.id) {
      // case 1:
      //   componentToLoad = SearcherSidebarComponent;
      //   // dialogData = { id: img.id, type: img.type };
      //   break;
      case 2:
        componentToLoad = SearcherSidebarComponent;
        dialogData = { otroDato: `Información extra para el item ${img.id}` };
        break;
      // default:
      //   console.warn('Componente de diálogo no definido para el ID:', img.id);
      //   return;
    }

    this.dialogService.open({ component: componentToLoad, data: dialogData });
  }
}
