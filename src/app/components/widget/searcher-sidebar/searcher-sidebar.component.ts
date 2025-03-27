import { Component, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SearcherSidebarService } from '../../../core/services/widget/searcher-sidebar.service';
import { infoSeacher } from '../../../interfaces/info-searcher';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
      const inputControl = this.formSearch.get('inputSearch');
      const info = inputControl?.value;
      const filter = this.searcherSidebarService.getSearchCriteria()
        .find(item => item.label === this.selectedOption);
    
      if (!filter) {
        console.log('Filtro no encontrado');
        return;
      }
    
      const newValidator = filter.type === 'number'
        ? Validators.pattern('^[0-9]+$')
        : Validators.pattern('^[A-Za-z ]+$');
    
      inputControl?.setValidators([newValidator]);
      inputControl?.updateValueAndValidity();
    
      if (this.formSearch.valid) {
        this.searcherSidebarService.getInformationUser(filter.name, info).subscribe(response => {
          this.infoSeacher = response.SDT_Acreditados;
    
          if (!this.infoSeacher.length) {
            this.clearInformation();
            this.placeholderText = 'Datos no encontrados';
          }
    
          console.log(this.infoSeacher);
          this.cdr.markForCheck();
        });
      }
    } else {
      console.log('Debe seleccionar una opción');
      // Aquí puedes generar una alerta con algún servicio de notificación
    }    
  }

  clearInformation(): void {
    this.infoSeacher = [];
    this.placeholderText = '';
    this.formSearch.reset();
    this.selectedOption = 'Criterio de Búsqueda';
  }

  showCardUser(): void {
    this.dialogService.closeAll()
    this.dialogService.open({ component: ContactCardComponent });
  }
}