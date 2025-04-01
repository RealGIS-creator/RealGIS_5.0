import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject } from '@angular/core';
import { SideBar } from '../../../interfaces/sidebar';
import { SearcherSidebarComponent } from '../../widget/searcher-sidebar/searcher-sidebar.component';
import { GenericDialogComponent } from '../../shared/generic-dialog/generic-dialog.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarService } from '../../../core/services/home/sidebar.service';
import { Subscription } from 'rxjs';
import { DownloadComponent } from '../../widget/download/download.component';
// import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';

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
  dialog: ComponentRef<GenericDialogComponent> | null | any = null;

  private dialogSub!: Subscription;

  constructor(
    private sidebarService: SidebarService,
    // private sidebarShowDataService: SidebarShowDataService
  ) {}

  ngOnInit() {
    this.getIcons();

    this.dialogSub = this.dialogService.activeDialog$.subscribe(dialogRef => {
      if (!dialogRef) {
        console.log('No hay diálogo activo');
        this.resetImagesToDark();
      }
    });
  }

  getIcons(): void {
    this.imagesDefault = this.sidebarService.getSideBar();
  }

  onChangeImage(id: number, type: string): void {
    this.dialogService.closeAll();
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
        break;
      case 3:
          componentToLoad = SearcherSidebarComponent;
          break;
      case 5:
        componentToLoad = DownloadComponent;
        break;
      // default:
      //   console.warn('Componente de diálogo no definido para el ID:', img.id);
      //   return;
    }

    this.dialogService.open({ component: componentToLoad });
  }

  resetImagesToDark(): void {
    // Vuelve a los estilos iniciales
    this.imagesDefault.forEach((element) => {
      element.type = 'dark';
    });
  }
}
