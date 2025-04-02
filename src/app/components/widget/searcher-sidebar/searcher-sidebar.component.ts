import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SearchCriteria } from '../../../interfaces/search-criteria';

@Component({
  selector: 'app-searcher-sidebar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './searcher-sidebar.component.html',
  styleUrl: './searcher-sidebar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearcherSidebarComponent {
  public optionSearch: any[] = [];
  public isVisible: boolean = false;
  public selectedOption: string = 'Criterio de Búsqueda';
  public infoSeacher: infoSeacher[] = [];
  public placeholderText = '';
  public dataFilter?: SearchCriteria;
  formSearch!: FormGroup;

  private dialogService = inject(DialogService);

  constructor(
    private searcherSidebarService: SearcherSidebarService,
    private cdr: ChangeDetectorRef
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getSearchCriteria();
  }

  createForm(): void {
    this.formSearch = new FormGroup({
      inputSearch: new FormControl('', [Validators.required, Validators.maxLength(20)])
    });
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
    if (this.selectedOption !== 'Criterio de Búsqueda' && this.formSearch.valid) {
      const info = this.formSearch.get('inputSearch')?.value;
      this.dataFilter = this.searcherSidebarService.getSearchCriteria().find(item => item.label === this.selectedOption);

      this.dataFilter!.type == 'number' ? this.formSearch.get('inputSearch')?.addValidators(Validators.pattern('^[0-9]+$')) : this.formSearch.get('inputSearch')?.addValidators(Validators.pattern('^[A-Za-z ]+$'));
      this.formSearch.get('inputSearch')?.updateValueAndValidity();

      if (this.formSearch.valid) {
        this.searcherSidebarService.getInformationUser(this.dataFilter!.name, info).subscribe(response => {
          this.infoSeacher = response.SDT_Acreditados;
          if (this.infoSeacher.length === 0) {
            this.clearInformation();
            this.placeholderText = 'Datos no encontrados';
          }
          this.cdr.markForCheck();
        });
      }
    } else {
      console.log('Debe seleccionar una opcion');
      // generar alerta
    }
  }

  clearInformation(): void {
    this.infoSeacher = [];
    this.placeholderText = '';
    this.formSearch.reset();
    this.selectedOption = 'Criterio de Búsqueda';
  }

  showCardUser(idAdress: string): void {
    this.dialogService.closeAll()
    const data = {
      filterName: this.dataFilter!.name, 
      idAdress: idAdress
    }
    this.dialogService.open({ component: ContactCardComponent, data: data});
    // this.dialogService.open({ component: ContactCardComponent, data: { data: this.dataFilter!.name } });

  }
}
