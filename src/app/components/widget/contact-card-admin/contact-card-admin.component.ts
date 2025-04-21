import { Component, ComponentRef, Input } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { BehaviorSubject } from 'rxjs';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';

@Component({
  selector: 'app-contact-card-admin',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card-admin.component.html',
  styleUrl: './contact-card-admin.component.less'
})
export class ContactCardAdminComponent {
  isVisibleInformacionPersonal = false;
  isVisibleInformacionEmployment = false;
  isVisibleFarmsContactCard = false;
  infoUserCard!: InformationCard;

  dialogRef!: ComponentRef<any>;

  isVisible: boolean = false;
  readonly DEFAULT_LABEL = 'Selecciona';
  selectedOption: string = this.DEFAULT_LABEL;

  @Input() data$: BehaviorSubject<any> = new BehaviorSubject(null);
  data: any;

  ngOnInit(): void {
    this.data = this.data$.value._value;
    console.log(this.data);
    console.log(this.data.AcreditadoIdenti);
  }

  constructor(
    private dialogService: DialogService,
    private sidebarShowDataService: SidebarShowDataService,
  )
  {}

  showInformationPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal
      ? false
      : true;
  }

  showInformationEmployment(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment
      ? false
      : true;
  }

  close(): void {
    this.dialogService.closeAll();
    this.sidebarShowDataService.setData({ activeIndex: 0 });
  }

  minimize(): void {
    this.isVisibleInformacionPersonal = false;
    this.isVisibleInformacionEmployment = false;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isVisible = false;
  }
  
  clickSearcher(): void {
    this.isVisible = this.isVisible ? false : true;
  }

  get displayIcon() {
    return this.isVisible ? 'display_down.svg' : 'display_up.svg';
  }

  get displayIconEmployment() {
    return this.isVisibleInformacionEmployment
      ? 'editar_activo.svg'
      : 'editar_gris_oscuro.svg';
  }

  get displayIconPersonal() {
    return this.isVisibleInformacionPersonal
      ? 'editar_activo.svg'
      : 'editar_gris_oscuro.svg';
  }
}
