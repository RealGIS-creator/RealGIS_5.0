import { CommonModule } from '@angular/common';
import { Component, ComponentRef } from '@angular/core';
import { SideBar } from '../../../interfaces/sidebar';
import { SearcherSidebarComponent } from '../../widget/searcher-sidebar/searcher-sidebar.component';
import { GenericDialogComponent } from '../../shared/generic-dialog/generic-dialog.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarService } from '../../../core/services/home/sidebar.service';
import { Subscription } from 'rxjs';
import { DownloadComponent } from '../../widget/download/download.component';
import { ContactCardInsertComponent } from '../../widget/contact-card-insert/contact-card-insert.component';
import { StatsToggleService } from '../../../core/services/widget/stats-toggle.service';
import { GlobalUserParamService } from '../../../core/services/global-user-param.service';

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
  
  dialog: ComponentRef<GenericDialogComponent> | null = null;

  private dialogSub!: Subscription;
  paramsUser: string = '';

  constructor(
    private readonly sidebarService: SidebarService,
    private readonly dialogService: DialogService,
    private readonly statsToggleService: StatsToggleService,
    private readonly globalUserParamService: GlobalUserParamService
    // private sidebarShowDataService: SidebarShowDataService
  ) {}

  ngOnInit() {
    this.getIcons();

    this.dialogSub = this.dialogService.activeDialog$.subscribe(dialogRef => {
      if (!dialogRef) {
        this.resetImagesToDark();
      }
    });

    this.globalUserParamService.params$.subscribe(p => {
      this.paramsUser = p?.['role'];
    });
  }

  getIcons(): void {
    this.imagesDefault = this.sidebarService.getSideBar();
  }

  onChangeImage(id: number, type: string): void {
    this.dialogService.closeAll();
    //console.log('id: ', id)
    this.activeIndex = this.activeIndex === id ? null : id;

    this.imagesDefault.forEach((element) => {
      element.type = 'dark';
    });
     
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
          this.onShowStatistcs();
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

  onShowStatistcs(): void {
    this.statsToggleService.show();
  }
}
