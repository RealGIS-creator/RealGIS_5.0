import { ChangeDetectorRef, Component, ComponentRef, Input } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { FormsModule } from '@angular/forms';
import { ContactCardAdminService } from '../../../core/services/widget/contact-card-admin.service';
//import { OnlyTextDirective } from '../../../core/directives/only-text.directive';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';

@Component({
  selector: 'app-contact-card-insert',
  imports: [MovableCardComponent, CommonModule, FormsModule, OnlyNumberDirective],
  templateUrl: './contact-card-insert.component.html',
  styleUrl: './contact-card-insert.component.less'
})
export class ContactCardInsertComponent {
  isVisibleInformacionPersonal = false;
  isVisibleInformacionEmployment = false;
  isVisibleFarmsContactCard = false;
  isAddTelefonoMovil = false;
  isAddTelefonoResidencial = false;
  isAddTelefonoOtro = false;
  isAddEmail = false;
  isAddFinca = false;

  infoUserCard!: InformationCard;
  nuevoTelefonoPre: string = '';
  nuevoTelefono: string = '';
  nuevoEmail: string = '';
  nuevaFinca: string = '';
  nuevaFincaDireccion: string = '';
  typeTelefono: number = 0;
  typeEmail: number = 0;

  // nuevas variables 
  idCredito: string = '';
  identificacion: string = '';
  nombre: string = '';
  noAcreditado: string = '';
  cis: string = '';
  direccionLugarNombreLaboral: string = '';
  direccionNombreLaboral: string = '';
  telefonoPreLaboral: string = '';
  telefonoNumLaboral: string = '';
  direccionNombrePersonal: string = '';
  isMensajeAlerta = false;
  mensajeAlerta: string = '';
  nameEstrategia: string = ''; 
  idEstategia: string = '';
  geoDomicilioLati: string = '';
  geoDomicilioLongi: string = '';

  dialogRef!: ComponentRef<any>;

  isVisible: boolean = false;
  readonly DEFAULT_LABEL = 'Selecciona';
  selectedOption: string = this.DEFAULT_LABEL;

  data: InformationCard = {} as InformationCard;

  optionsTipoProducto: string[] = ['PRESTAMO HIPOTECARIO', 'PRESTAMO PERSONAL', 'TARJETA DE CREDITO', 'PRESTAMO AUTO', 'TARJETA DEBITO'];

  constructor(
    private dialogService: DialogService,
    private sidebarShowDataService: SidebarShowDataService,
    private contactCardAdminService: ContactCardAdminService
  ) {
    this.data.Telefonos = [] as unknown as InformationCard['Telefonos'];
    this.data.Correos = [] as unknown as InformationCard['Correos'];
    this.data.Fincas = [] as unknown as InformationCard['Fincas'];
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
    return this.isVisible ? 'display_white_down.svg' : 'display_white_up.svg';
  }

  onEstrategia(nameEstrategia: string, idEstategia: string): void {
    this.data.TipoEstrategiaNom = nameEstrategia;
    this.data.TipoEstrategia_Id = idEstategia;
    this.nameEstrategia = nameEstrategia;
    this.idEstategia = idEstategia;
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

  editInformacionLaboral(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment ? false : true;
  }

  editInformacionPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal ? false : true;
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
    if (this.nuevoTelefonoPre == "" || this.nuevoTelefono == "") {
      return;
    }
    const sumId = this.data.Telefonos.length + 1;

    this.data.Telefonos.push({
      TelefonoEst: 'A',
      TelefonoNum: this.nuevoTelefono,
      TelefonoPre: this.nuevoTelefonoPre,
      Telefono_Id: sumId.toString(),
      TipoTelefonoCod: this.typeTelefono.toString(),
      TipoTelefonoEst: 'A',
      TipoTelefono_Id: this.typeTelefono.toString(),
      Telefono_Nuevo: '1',
    })
    this.closeTelefono();
    this.nuevoTelefonoPre = '';
    this.nuevoTelefono = '';
  }

  deleteTelefono(id: any): void {
    const arr: any[] = this.data.Telefonos as any[];

    const idx = arr.findIndex(t => t.Telefono_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.data.Telefonos = arr as unknown as typeof this.data.Telefonos;

    console.log(this.data);
  }

  closeTelefono(): void {
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoResidencial = false;
    this.isAddTelefonoOtro = false;
  }

  closeFinca(): void {
    this.isAddFinca = false;
  }

  // correos
  onTipoEmail(selectedOption: number): void {
    this.typeEmail = selectedOption;
  }

  newEmail(): void {
    if (this.nuevoEmail.trim() == '' || this.typeEmail == 0 || this.typeEmail == null) {
      return;
    }

    const sumId = this.data.Correos.length + 1;

    this.data.Correos.push({
      CorreoElec: this.nuevoEmail.trim(),
      CorreoEst: 'A',
      Correo_Id: sumId.toString(),
      Correo_Nuevo: '1',
      TipoCorreoCod: this.typeEmail.toString(),
      TipoCorreoEst: 'A',
      TipoCorreo_Id: this.typeEmail.toString(),
    });
    this.closeEmail();

    this.typeEmail = 0;
    this.nuevoEmail = '';
    console.log(this.data);
  }

  closeEmail(): void {
    this.isAddEmail = false;
  }

  deleteEmail(id: string): void {
    const arr: any[] = this.data.Correos as any[];

    const idx = arr.findIndex(c => c.Correo_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.data.Correos = arr as unknown as typeof this.data.Correos;
    console.log(this.data);
  }

  //fincas
  newFinca(): void {
    if (this.nuevaFinca.trim() == '' && this.nuevaFincaDireccion.trim() == '') {
      return;
    }
    const sumId = this.data.Correos.length + 1;

    this.data.Fincas.push({
      FincaDireccion: this.nuevaFincaDireccion,
      FincaEst: 'A',
      FincaFolio: this.nuevaFinca,
      Finca_Id: sumId.toString(),
      Finca_Nuevo: '1',
      PropiedadEst: 'A',
      Propiedad_Id: this.data.TipoPredio_Id
    });

    this.closeFinca();
    this.data.TipoPredioNom = '';
    this.data.TipoPredio_Id = '';
    this.nuevaFinca = '';
    this.nuevaFincaDireccion = '';
    console.log(this.data);
  }

  deleteFinca(id: string): void {
    const arr: any[] = this.data.Fincas as any[];

    const idx = arr.findIndex(f => f.Finca_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.data.Fincas = arr as unknown as typeof this.data.Fincas;    
    console.log(this.data);
  }

  resetMensajeAlerta(): void {
    setTimeout(() => {
      this.isMensajeAlerta = false;
      this.mensajeAlerta = '';
    }, 2000);
  }

  save(): void {
    if (this.idCredito == '' || this.identificacion == '' || this.nombre == '' || this.noAcreditado == ''
      || this.cis == '' || this.nameEstrategia == '' || this.idEstategia == '') {
      console.log('Faltan datos obligatorios');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Faltan datos obligatorios';
      this.resetMensajeAlerta();
      return;
    }

    if (this.isVisibleInformacionEmployment && (this.direccionLugarNombreLaboral == '' && this.direccionNombreLaboral == '')) {
      console.log('DireccionesLugTra no puede estar vacio');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Direccion Laboral no puede estar vacio';
      this.resetMensajeAlerta();
      return;
    }

    if (this.direccionNombrePersonal == '' && this.direccionLugarNombreLaboral == '' && this.direccionNombreLaboral == '') {
      console.log('Direccion no puede estar vacio');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Direccion no puede estar vacio';
      this.resetMensajeAlerta();
      return;
    }

    if (this.geoDomicilioLati == '' && this.geoDomicilioLati == '') {
      console.log('GeoDomicilioLati y GeoDomicilioLongi no pueden estar vacios');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Latitud y Longitud no pueden estar vacios';
      this.resetMensajeAlerta();
      return;
    }

    this.data.GeoDomicilioLongi = this.geoDomicilioLongi;
    this.data.GeoDomicilioLati = this.geoDomicilioLati;

    this.data.AcreditadoNumCuen = this.idCredito.toString();
    this.data.AcreditadoIdenti = this.identificacion.toString();
    this.data.AcreditadoNom = this.nombre.toString();
    this.data.AcreditadoNum = this.noAcreditado.toString();
    this.data.CuentasCis = this.cis.toString();

    if (this.isVisibleInformacionEmployment) {
      this.data.Direccion = this.direccionNombreLaboral;
      this.data.DireccionEst = 'A';
      this.data.TipoDireccionCod = '2';
      this.data.TipoDireccion_Id = '2';
      this.data.DireccionesLugTra = this.direccionLugarNombreLaboral;
    }

    if (this.isVisibleInformacionPersonal) {
      this.data.Direccion = this.direccionNombrePersonal;
      this.data.DireccionEst = 'A';
      this.data.TipoDireccionCod = '1';
      this.data.TipoDireccion_Id = '1';
    }

    if (this.telefonoPreLaboral == '' || this.telefonoNumLaboral == '') {
      this.data.Telefonos.push({
        TipoTelefono_Id: '4',
        TelefonoNum: this.telefonoNumLaboral,
        TelefonoPre: this.telefonoPreLaboral,
        Telefono_Nuevo: '1',
        TelefonoEst: 'A',
        Telefono_Id: '',
        TipoTelefonoCod: '4',
        TipoTelefonoEst: 'A',
      })
    }

    console.log(this.data.CuentasDiasMoraGave);
    console.log(this.data);

  }
}
