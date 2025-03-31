import { Component } from '@angular/core';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { SearchCriteria } from '../../../interfaces/search-criteria';

@Component({
  selector: 'app-download',
  imports: [],
  templateUrl: './download.component.html',
  styleUrl: './download.component.less'
})
export class DownloadComponent {
  public optionSearch: any[] = [];
  public isVisible: boolean = false;
  public selectedOption: string = 'Tipo de Descarga';
  public infoSeacher: infoSeacher[] = [];
  public placeholderText = '';
  public dataFilter?: SearchCriteria;

  constructor(
    private searcherSidebarService: SearcherSidebarService,
  ) {
  }

  ngOnInit(): void {
    this.getSearchCriteria();
  }

  getSearchCriteria(): void {
    this.optionSearch = this.searcherSidebarService.getSearchCriteria()
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isVisible = false;
  }

  get displayIcon() {
    return this.isVisible ? 'display_down.svg' : 'display_up.svg';
  }

  clearInformation(): void {
    this.infoSeacher = [];
    this.placeholderText = '';
    this.selectedOption = 'Tipo de Descarga';
  }

  download(): void {}

}
