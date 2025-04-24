import { ChangeDetectorRef, Component, ComponentRef, Input } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { BehaviorSubject } from 'rxjs';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { FormsModule } from '@angular/forms';
import { ContactCardAdminService } from '../../../core/services/widget/contact-card-admin.service';
import { ContactCard } from '../../../interfaces/contact-card';

@Component({
  selector: 'app-contact-card-insert',
  imports: [MovableCardComponent, CommonModule, FormsModule],
  templateUrl: './contact-card-insert.component.html',
  styleUrl: './contact-card-insert.component.less'
})
export class ContactCardInsertComponent {
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
  isAddFinca = false;

  infoUserCard!: InformationCard;
  nuevoTelefonoPre?: number;
  nuevoTelefono?: number;
  nuevoEmail: string = '';
  nuevaFinca: string = '';
  nuevaFincaDireccion: string = '';
  typeTelefono: number = 0;
  typeEmail: number = 0;

  // nuevas variables 
  idCredito: number = 0;
  identificacion: number = 0;
  nombre: number = 0;
  noAcreditado: number = 0;
  cis: number = 0;

  dialogRef!: ComponentRef<any>;

  isVisible: boolean = false;
  readonly DEFAULT_LABEL = 'Selecciona';
  selectedOption: string = this.DEFAULT_LABEL;

 // @Input() data$: BehaviorSubject<any> = new BehaviorSubject(null);
  data!: InformationCard ;

  optionsTipoProducto: string[] = ['PRESTAMO HIPOTECARIO', 'PRESTAMO PERSONAL', 'TARJETA DE CREDITO', 'PRESTAMO AUTO', 'TARJETA DEBITO'];

  constructor(
    private dialogService: DialogService,
    private sidebarShowDataService: SidebarShowDataService,
    private cdr: ChangeDetectorRef,
    private contactCardAdminService: ContactCardAdminService
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

  onEstrategia(nameEstrategia: string, idEstategia: string): void {
    this.data.TipoEstrategiaNom = nameEstrategia;
    this.data.TipoEstrategia_Id = idEstategia;
    console.log(this.data);
  }

  onPredio(namePredio: string, idPredio: string): void {
    this.data.TipoPredioNom = namePredio;
    this.data.TipoPredio_Id = idPredio;
    console.log(this.data);
  }

  selectTipoProducto(nameProducto: string, idProducto: string): void {
    this.data.TipoProductoNom = nameProducto;
    this.data.TipoProducto_Id = idProducto;
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

  AddFinca(): void {
    this.isAddFinca = this.isAddFinca ? false : true;
  }

  // telefono
  newTelefono(): void {
    if (this.nuevoTelefonoPre == 0 || this.nuevoTelefono == 0) {
      return;
    }

    // this.data.Telefonos.push({
    //   TipoTelefonoCod: this.typeTelefono.toString(),
    //   TelefonoNum: this.nuevoTelefono.toString(),
    //   TelefonoPre: this.nuevoTelefonoPre.toString(),
    //   TelefonoEst: 'A',
    // })
    this.closeTelefono();
  }

  deleteTelefono(id: number): void {
    
    // this.data.Telefonos = this.data.Telefonos.map((t: any) =>
    //   t.Telefono_Id == id
    //     ? { ...t, TelefonoEst: 'I' }  
    //     : t       
    // );
    
    console.log(this.data);
  }

  closeTelefono(): void {
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoResidencial = false;
    this.isAddTelefonoOtro = false;
  }

  closeFinca(): void {
    this.isVisibleFarmsContactCard = false;
  }

  // correos
  onTipoEmail(selectedOption: number): void {
    this.typeEmail = selectedOption;  
  }

  newEmail(): void {
    if (this.nuevoEmail.trim() == '') {
      return;
    }

    // this.data.Correos.push({
    //   TipoEmailCod: this.data.TipoEmailCod,
    //   CorreoElec: this.nuevoEmail.trim(),
    //   CorreoEst: 'A',
    // });
    this.closeEmail();
    this.cdr.markForCheck();
  }

  closeEmail(): void {
    this.isAddEmail = false;
  }

  deleteEmail(id: number): void {
    // this.data.Correos = this.data.Correos.map((c: any) =>
    //   c.Correo_Id == id
    //     ? { ...c, CorreoEst : 'I' }  
    //     : c       
    // );
    
    console.log(this.data);
    this.cdr.markForCheck();
  }

  //fincas
  newFinca(): void {
    // this.data.push({
    //   FincaFolio: this.nuevaFinca,
    //   FincaDireccion: this.nuevaFincaDireccion,
    //   FincaEst: 'A',
    // });
    // this.closeFinca();
    this.data.FincaFolio = this.nuevaFinca;
    this.data.FincaDireccion = this.nuevaFincaDireccion;
    this.data.FincaEst = 'A';
    
    this.closeFinca();
  }

  deleteFinca(id: number): void {
    // this.data.Fincas = this.data.map((f: any) =>
    //   f.Finca_Id == id
    //     ? { ...f, FincaEst: 'I' }  
    //     : f       
    // );
    this.cdr.markForCheck();
    console.log(this.data);
  }

  save(): void {
    console.log(this.data.CuentasDiasMoraGave);
    console.log(this.data);

    this.contactCardAdminService.updateContactCard([this.data]).subscribe((res) => {
      console.log(res);
      console.log('Se guardo correctamente');
    })
  }
}
