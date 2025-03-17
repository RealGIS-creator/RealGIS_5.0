import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearcherSidebarService } from '../../core/services/searcher-sidebar.service';

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
  @Input() data: Detalle1Data | undefined; 
  
  constructor(private searcherSidebarService: SearcherSidebarService) 
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
}
