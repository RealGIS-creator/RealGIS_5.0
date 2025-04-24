import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SearchCriteria } from '../../../interfaces/search-criteria';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-searcher-sidebar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searcher-sidebar.component.html',
  styleUrl: './searcher-sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearcherSidebarComponent {
  readonly DEFAULT_LABEL = 'Criterio de Búsqueda';

  optionSearch: SearchCriteria[] = [];
  isVisible: boolean = false;
  selectedOption: string = this.DEFAULT_LABEL;
  placeholderText = '';
  infoInput = '';
  dataFilter?: SearchCriteria;

  infoSeacher$!: Observable<infoSeacher[]>;

  formSearch: FormGroup = this.fb.group({
    inputSearch: ['', [Validators.required, Validators.maxLength(20)]]
  });

  constructor(
    private searcherSidebarService: SearcherSidebarService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.getSearchCriteria();
  }

  getSearchCriteria(): void {
    this.optionSearch = this.searcherSidebarService.getSearchCriteria()
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
    if (this.selectedOption === this.DEFAULT_LABEL || this.formSearch.invalid) {
      console.warn('Debe seleccionar una opción válida y rellenar el campo de búsqueda');
      return;
    }

    this.infoInput = this.formSearch.get('inputSearch')?.value;
    this.dataFilter = this.searcherSidebarService.getSearchCriteria().find(item => item.label === this.selectedOption);

    this.infoSeacher$ = this.searcherSidebarService
      .getInformationUser(this.dataFilter!.name, this.infoInput)
      .pipe(
        map(resp => resp.SDT_Acreditados),
        tap(list => {
          if (list.length === 0) {
            this.clearInformation();
            this.placeholderText = 'Datos no encontrados';
          } else {
            this.placeholderText = '';
          }
        })
      );
  }

  clearInformation(): void {
    this.infoSeacher$ = new Observable<infoSeacher[]>(obs => obs.next([]));
    this.placeholderText = '';
    this.formSearch.reset();
    this.selectedOption = this.DEFAULT_LABEL;
  }

  showCardUser(idAdress: string): void {
    const data = {
      filterName: this.dataFilter!.name,
      filterValue: this.infoInput,
      idAdress: idAdress
    }
    this.dialogService.closeAll();
    this.dialogService.open({ component: ContactCardComponent, data: data });
    // this.dialogService.open({ component: ContactCardComponent, data: { data: this.dataFilter!.name } });
  }

  trackByAcreditado(_: number, item: infoSeacher): string {
    return item.AcreditadoNum;
  }
}
