import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';
import { infoSeacher } from '../../../interfaces/info-searcher';

@Component({
  selector: 'app-searcher-sidebar',
  imports: [CommonModule],
  templateUrl: './searcher-sidebar.component.html',
  styleUrl: './searcher-sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearcherSidebarComponent {
  public optionSearch: string[] = [];
  public isVisible: boolean = false;
  public selectedOption: string = 'Criterio de Búsqueda';
  public infoSeacher: infoSeacher[] = [];

  private dialogService = inject(DialogService);
  
  constructor(
    private searcherSidebarService: SearcherSidebarService,
    private cdr: ChangeDetectorRef 
  ) 
  {
    this.getSearchCriteria()
  }

  getSearchCriteria(): void {
    this.optionSearch = this.searcherSidebarService.getSearchCriteria()
    console.log(this.optionSearch);
  }

  clickSearcher(): void {
    this.isVisible = this.isVisible ? false : true;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isVisible = false; 
  }

  get displayIcon() {
    return this.isVisible ? 'display_down.svg' : 'display_up.svg';
  }

  searchInformation(): void {
    if (this.selectedOption !== 'Criterio de Búsqueda') {
      // this.infoUser = this.searcherSidebarService.getInformationUser();
      this.searcherSidebarService.getInformationUser().subscribe(response => {
        this.infoSeacher = response.SDT_Acreditados;

        console.log(this.infoSeacher)
        this.cdr.markForCheck();

      });
    } else {
      console.log('Debe seleccionar una opcion');
      // generar alerta
    }
  }

  clearInformation(): void {
    this.infoSeacher = [];
    this.selectedOption = 'Criterio de Búsqueda';
  }

  showCardUser(): void {
    this.dialogService.closeAll()
    this.dialogService.open({ component: ContactCardComponent });
  }
}
