import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoUser } from '../../../interfaces/info-user';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';

interface Detalle1Data {
  id: number;
  type: string;
}

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
  public infoUser: InfoUser[] = [];
  public selectedOption: string = 'Criterio de Búsqueda';

  data: Detalle1Data | undefined; 
  private dialogService = inject(DialogService);
  
  constructor(
    private searcherSidebarService: SearcherSidebarService,
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
      this.infoUser = this.searcherSidebarService.getInformationUser();
    } else {
      console.log('Debe seleccionar una opcion');
      // generar alerta
    }
  }

  clearInformation(): void {
    this.infoUser = [];
    this.selectedOption = 'Criterio de Búsqueda';
  }

  showCardUser(): void {
    this.dialogService.closeAll()
    this.dialogService.open({ component: ContactCardComponent });
  }
}
