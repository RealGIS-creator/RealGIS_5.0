import { CommonModule } from '@angular/common';
import { Component, ComponentRef, inject } from '@angular/core';
import { SideBar } from '../../../interfaces/sidebar';
import { SearcherSidebarComponent } from '../../widget/searcher-sidebar/searcher-sidebar.component';
import { GenericDialogComponent } from '../../shared/generic-dialog/generic-dialog.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarService } from '../../../core/services/home/sidebar.service';
import { Subscription } from 'rxjs';
import { DownloadComponent } from '../../widget/download/download.component';
import { ContactCardInsertComponent } from '../../widget/contact-card-insert/contact-card-insert.component';
import { StatisticsComponent } from '../../widget/statistics/statistics.component';

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
  
  dialog: ComponentRef<GenericDialogComponent> | null | any = null;

  private dialogSub!: Subscription;

  constructor(
    private sidebarService: SidebarService,
    private dialogService: DialogService
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
    console.log('id: ', id)
    this.activeIndex = this.activeIndex === id ? null : id;

    this.imagesDefault.forEach((element) => {
      element.type = element.type == 'ligth' ? 'dark' : 'dark';
    });

    // this.imagesDefault[id - 1].type = type == 'dark' ? 'ligth' : 'dark';
     
    if (type == 'dark') {
      this.imagesDefault[id - 1].type = 'ligth';
    } else {
      this.imagesDefault[id - 1].type = 'dark';
      this.dialogService.closeAll();
      this.activeIndex = null;
    }
  }

  openDialog(img: any) {
    this.activeIndex = 0;
    let componentToLoad: any = null;

    switch (img.id) {
      // case 1:
      //   componentToLoad = SearcherSidebarComponent;
      //   // dialogData = { id: img.id, type: img.type };
      //   break;
      case 1:
        componentToLoad = SearcherSidebarComponent;
        break;
      case 2:
        componentToLoad = DownloadComponent;
        break;
      case 3:
          componentToLoad = StatisticsComponent;
          break;
      case 4:
          componentToLoad = ContactCardInsertComponent;
          break;
      // default:
      //   console.warn('Componente de diálogo no definido para el ID:', img.id);
      //   return;
    }

    this.dialogService.open({ component: componentToLoad });
  }

  resetImagesToDark(): void {
    this.imagesDefault.forEach((element) => {
      element.type = 'dark';
    });
  }
}
