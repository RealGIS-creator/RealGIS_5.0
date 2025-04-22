import { ChangeDetectorRef, Component, ComponentRef, Input } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { BehaviorSubject } from 'rxjs';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-card-admin',
  imports: [MovableCardComponent, CommonModule, FormsModule],
  templateUrl: './contact-card-admin.component.html',
  styleUrl: './contact-card-admin.component.less'
})
export class ContactCardAdminComponent {
  isVisibleInformacionPersonal = false;
  isVisibleInformacionEmployment = false;
  isVisibleFarmsContactCard = false;
  isVisibleDiasMora = false;
  isVisibleSaldoProducto = false;
  isVisibleGeolocalizacion = false;
  isAddTelefonoMovil = false;
  isAddTelefonoResidencial = false;
  isAddTelefonoOtro = false;
  isAddEmail = false;

  infoUserCard!: InformationCard;
  nuevoTelefonoPre: string = '';
  nuevoTelefono: string = '';
  nuevoEmail: string = '';
  typeTelefono: number = 0;
  typeEmail: number = 0;

  dialogRef!: ComponentRef<any>;

  isVisible: boolean = false;
  readonly DEFAULT_LABEL = 'Selecciona';
  selectedOption: string = this.DEFAULT_LABEL;

  @Input() data$: BehaviorSubject<any> = new BehaviorSubject(null);
  data: any;

  optionsTipoProducto: string[] = ['PRESTAMO HIPOTECARIO', 'PRESTAMO PERSONAL', 'TARJETA DE CREDITO', 'PRESTAMO AUTO', 'TARJETA DEBITO'];

  ngOnInit(): void {
    this.data = this.data$.value._value;
    this.selectedOption = this.data.TipoProductoNom
    console.log(this.data);
    console.log(this.data.AcreditadoIdenti);
  }

  constructor(
    private dialogService: DialogService,
    private sidebarShowDataService: SidebarShowDataService,
    private cdr: ChangeDetectorRef
  )
  {}

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

  onEstrategia(selectedOption: string): void {
    this.data.TipoEstrategiaNom = selectedOption;
    console.log(this.data);
  }

  onPredio(selectedOption: string): void {
    this.data.TipoPredioNom = selectedOption;
    console.log(this.data);
  }

  selectTipoProducto(option: string) {
    this.data.TipoProductoNom = option;
    this.selectedOption = this.data.TipoProductoNom;
    this.clickSearcher();
    console.log(this.data);
  }

  editDiasMora(): void {
    this.isVisibleDiasMora = this.isVisibleDiasMora ? false : true;
  }

  editSaldoProducto(): void {
    this.isVisibleSaldoProducto = this.isVisibleSaldoProducto ? false : true;
  }

  editInformacionLaboral(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment ? false : true;
  }

  editInformacionPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal ? false : true;
  }

  editGeolocalizacion(): void {
    this.isVisibleGeolocalizacion = this.isVisibleGeolocalizacion ? false : true;
  }

  AddTelefonoMovil(type: number = 0): void {
    this.isAddTelefonoMovil = this.isAddTelefonoMovil ? false : true;
    this.typeTelefono = type ? type : 0;
  }

  AddTelefonoResidencial(type: number = 0): void {
    this.isAddTelefonoResidencial = this.isAddTelefonoResidencial ? false : true;
    this.typeTelefono = type ? type : 0;
  }

  AddTelefonoOtro(type: number = 0): void {
    this.isAddTelefonoOtro = this.isAddTelefonoOtro ? false : true;
    this.typeTelefono = type ? type : 0;
  }

  AddEmail(): void {
    this.isAddEmail = this.isAddEmail ? false : true;
  }

  // telefono
  newTelefono(): void {
    this.data.Telefonos.push({
      TipoTelefonoCod: this.typeTelefono,
      TelefonoNum: this.nuevoTelefono,
      TelefonoPre: this.nuevoTelefonoPre,
      TelefonoEst: 'A',
    })
    this.closeTelefono();
  }

  deleteTelefono(id: number): void {
    this.data.Telefonos = this.data.Telefonos.map((t: any) =>
      t.Telefono_Id == id
        ? { ...t, TelefonoEst: 'I' }  
        : t       
    );
    
    console.log(this.data);
  }

  closeTelefono(): void {
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoResidencial = false;
    this.isAddTelefonoOtro = false;
  }

  // correos
  onTipoEmail(selectedOption: number): void {
    this.typeEmail = selectedOption;  
  }

  newEmail(): void {
    this.data.Correos.push({
      TipoEmailCod: this.data.TipoEmailCod,
      CorreoElec: this.nuevoEmail,
      CorreoEst: 'A',
    });
    this.closeEmail();
    this.cdr.markForCheck();
  }

  closeEmail(): void {
    this.isAddEmail = false;
  }

  deleteEmail(id: number): void {
    this.data.Correos = this.data.Correos.map((c: any) =>
      c.Correo_Id == id
        ? { ...c, CorreoEst : 'I' }  
        : c       
    );
    
    console.log(this.data);
    this.cdr.markForCheck();
  }

  save(): void {
    console.log(this.data.CuentasDiasMoraGave);
    console.log(this.data);
  }
}
