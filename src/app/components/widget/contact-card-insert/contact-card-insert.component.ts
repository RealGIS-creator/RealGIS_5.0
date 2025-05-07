import { Component, ComponentRef } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { FormsModule } from '@angular/forms';
import { ContactCardAdminService } from '../../../core/services/widget/contact-card-admin.service';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';
import { OnlyDecimal2IntDirectiveDirective } from '../../../core/directives/only-decimal2-int-directive.directive';
import { OnlyDecimal3IntDirectiveDirective } from '../../../core/directives/only-decimal3-int-directive.directive';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { OnlyAlphanumericDashDirective } from '../../../core/directives/only-alphanumeric-dash.directive';
import { OnlyAlphanumericDirective } from '../../../core/directives/only-alphanumeric.directive';
import { OnlyDecimalCommaDirective } from '../../../core/directives/only-decimal-comma.directive';
import { ExactLengthTenDirective } from '../../../core/directives/exact-length-ten.directive';
import { ExactLengthThreeDirective } from '../../../core/directives/exact-length-three.directive';
import { EmailFormatDirective } from '../../../core/directives/email-format.directive';
import { NoQuotesDirective } from '../../../core/directives/no-quotes.directive';

@Component({
  selector: 'app-contact-card-insert',
  imports: [MovableCardComponent, 
    CommonModule, 
    FormsModule, 
    OnlyNumberDirective, 
    OnlyDecimal2IntDirectiveDirective, 
    OnlyDecimal3IntDirectiveDirective,
    OnlyAlphanumericDashDirective,
    OnlyAlphanumericDirective,
    OnlyDecimalCommaDirective,
    ExactLengthTenDirective,
    ExactLengthThreeDirective,
    EmailFormatDirective,
    NoQuotesDirective
  ],
  templateUrl: './contact-card-insert.component.html',
  styleUrl: './contact-card-insert.component.less'
})
export class ContactCardInsertComponent {
  isVisibleInformacionPersonal = false;
  isVisibleInformacionEmployment = false;
  isVisibleFarmsContactCard = false;
  isAddTelefonoMovil = false;
  isVisibleTypeDocument = false;
  isAddTelefonoResidencial = false;
  isAddTelefonoOtro = false;
  isAddEmail = false;
  isAddFinca = false;
  isSave = false;
  isMainMenu = true;
  isSaveaAvailable = true;
  isVisibleTD = false;
  errorSave = false;

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
  nameProducto: string = '';
  idProducto: string = '';
  saveData!: InformationCard;
  message: string = '';
  tipoDocumento: string = '';

  dialogRef!: ComponentRef<any>;

  isVisible: boolean = false;
  readonly DEFAULT_LABEL = 'Selecciona';
  readonly DEFAULT_TYPE_DOCUMENT_LABEL = 'Tipo Documento';
  selectedOption: string = this.DEFAULT_LABEL;
  selectedOptionTypeDocument: string = this.DEFAULT_TYPE_DOCUMENT_LABEL;

  dataObject: InformationCard = {} as InformationCard;

  optionsTipoProducto: string[] = ['PRESTAMO HIPOTECARIO', 'PRESTAMO PERSONAL', 'TARJETA DE CREDITO', 'PRESTAMO AUTO', 'TARJETA DEBITO'];

  constructor(
    private dialogService: DialogService,
    private sidebarShowDataService: SidebarShowDataService,
    private contactCardAdminService: ContactCardAdminService
  ) {
    this.dataObject.Telefonos = [] as unknown as InformationCard['Telefonos'];
    this.dataObject.Correos = [] as unknown as InformationCard['Correos'];
    this.dataObject.Fincas = [] as unknown as InformationCard['Fincas'];
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

  clickSearcherTypeDocument(): void {
    this.isVisibleTypeDocument = this.isVisibleTypeDocument ? false : true;
  }

  get displayIcon() {
    return this.isVisible ? 'display_white_down.svg' : 'display_white_up.svg';
  }

  get displayIconTD() {
    return this.isVisibleTD ? 'display_white_down.svg' : 'display_white_up.svg';
  }

  onEstrategia(nameEstrategia: string, idEstategia: string): void {
    this.dataObject.TipoEstrategiaNom = nameEstrategia;
    this.dataObject.TipoEstrategia_Id = idEstategia;
    this.nameEstrategia = nameEstrategia;
    this.idEstategia = idEstategia;
  }

  onPredio(namePredio: string, idPredio: string): void {
    this.dataObject.TipoPredioNom = namePredio;
    this.dataObject.TipoPredio_Id = idPredio;
  }

  selectTipoProducto(nameProducto: string, idProducto: string): void {
    this.dataObject.TipoProductoNom = nameProducto;
    this.dataObject.TipoProducto_Id = idProducto;
    this.selectedOption = this.dataObject.TipoProductoNom;
    this.nameProducto = nameProducto;
    this.idProducto = idProducto;
    this.clickSearcher();
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
    this.isAddTelefonoResidencial = false;
    this.isAddTelefonoOtro = false;
  }

  AddTelefonoResidencial(type: number = 0): void {
    this.isAddTelefonoResidencial = this.isAddTelefonoResidencial ? false : true;
    this.typeTelefono = type ? type : 0;
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoOtro = false;
  }

  AddTelefonoOtro(type: number = 0): void {
    this.isAddTelefonoOtro = this.isAddTelefonoOtro ? false : true;
    this.typeTelefono = type ? type : 0;
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoResidencial = false;
  }

  AddEmail(): void {
    this.isAddEmail = this.isAddEmail ? false : true;
  }

  AddFinca(): void {
    this.isAddFinca = this.isAddFinca ? false : true;
  }

  selectTipoIdentificacion(nombreTipo: string, idTipo: string): void {
    this.tipoDocumento = idTipo;
    this.dataObject.TipoPersona_Id = idTipo
    this.selectedOptionTypeDocument = nombreTipo
    this.clickSearcherTypeDocument()
  }

  // telefono
  newTelefono(): void {
    if (this.nuevoTelefonoPre == "" || this.nuevoTelefono == "") {
      return;
    }
    const sumId = this.dataObject.Telefonos.length + 1;

    this.dataObject.Telefonos.push({
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
    const arr: any[] = this.dataObject.Telefonos as any[];

    const idx = arr.findIndex(t => t.Telefono_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.dataObject.Telefonos = arr as unknown as typeof this.dataObject.Telefonos;

    console.log(this.dataObject);
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

    const sumId = this.dataObject.Correos.length + 1;

    this.dataObject.Correos.push({
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
    console.log(this.dataObject);
  }

  closeEmail(): void {
    this.isAddEmail = false;
  }

  deleteEmail(id: string): void {
    const arr: any[] = this.dataObject.Correos as any[];

    const idx = arr.findIndex(c => c.Correo_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.dataObject.Correos = arr as unknown as typeof this.dataObject.Correos;
    console.log(this.dataObject);
  }

  //fincas
  newFinca(): void {
    if (this.nuevaFinca.trim() == '' && this.nuevaFincaDireccion.trim() == '') {
      return;
    }
    const sumId = this.dataObject.Correos.length + 1;

    this.dataObject.Fincas.push({
      FincaDireccion: this.nuevaFincaDireccion,
      FincaEst: 'A',
      FincaFolio: this.nuevaFinca,
      Finca_Id: sumId.toString(),
      Finca_Nuevo: '1',
      PropiedadEst: 'A',
      Propiedad_Id: this.dataObject.TipoPredio_Id
    });

    this.closeFinca();
    this.dataObject.TipoPredioNom = '';
    this.dataObject.TipoPredio_Id = '';
    this.nuevaFinca = '';
    this.nuevaFincaDireccion = '';
    console.log(this.dataObject);
  }

  deleteFinca(id: string): void {
    const arr: any[] = this.dataObject.Fincas as any[];

    const idx = arr.findIndex(f => f.Finca_Id === id);
    if (idx > -1) {
      arr.splice(idx, 1);
    }

    this.dataObject.Fincas = arr as unknown as typeof this.dataObject.Fincas;
    console.log(this.dataObject);
  }

  resetMensajeAlerta(): void {
    setTimeout(() => {
      this.isMensajeAlerta = false;
      this.mensajeAlerta = '';
    }, 1000);
  }

  resetMensajeAlertaError(): void {
    setTimeout(() => {
      this.isMensajeAlerta = false;
      this.mensajeAlerta = '';
    }, 2000);
  }

  save(): void {
    console.log('dataObject final: ', this.dataObject)
    if (this.validateData()) {
      this.contactCardAdminService.insertContactCard([this.dataObject]).subscribe((res) => {
        console.log('espuesta: ', res);
        this.isSaveaAvailable = true;
        if (res.verificarSalida) {
          this.saveData = res.WS_TarjetaContacto1[0];
          if (this.saveData) {
            this.isMainMenu = false;
            console.log('info guardada: ', this.saveData)
            this.message = res.mensajeSalida;
            this.isSave = true;
          } else {
            this.mensajeAlerta = 'Error al crear Tarjeta de contacto';
            this.isSave = false;
            this.isMensajeAlerta = true
            this.errorSave = true;
            this.isMainMenu = true;
            this.resetMensajeAlertaError()
          }
        } else {
          this.isMensajeAlerta = true
          this.mensajeAlerta = res.mensajeSalida;
          this.isSave = false;
          this.isMainMenu = true;
          this.resetMensajeAlertaError()
        }
      })
    }
  }

  validateData(): boolean {
    this.isSaveaAvailable = false;

    if (this.idCredito == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Id Credito obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.identificacion == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Identificación obligatoria';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.tipoDocumento == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Tipo Documento obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.nombre == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Nombre obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.noAcreditado == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Número Acreditado obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.cis == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'CIS obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.nameEstrategia == '' || this.idEstategia == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Estrategia obligatoria';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.nameProducto == '' || this.idProducto == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Producto obligatorio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.direccionNombrePersonal == '' && this.direccionLugarNombreLaboral == '' && this.direccionNombreLaboral == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Direccion no puede estar vacio';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    if (this.geoDomicilioLati == '' && this.geoDomicilioLati == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Latitud y Longitud no pueden estar vacios';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    this.dataObject.GeoDomicilioLongi = this.geoDomicilioLongi;
    this.dataObject.GeoDomicilioLati = this.geoDomicilioLati;

    this.dataObject.AcreditadoNumCuen = this.idCredito.toString();
    this.dataObject.AcreditadoIdenti = this.identificacion.toString();
    this.dataObject.AcreditadoNom = this.nombre.toString();
    this.dataObject.AcreditadoNum = this.noAcreditado.toString();
    this.dataObject.CuentasCis = this.cis.toString();

    if (this.direccionLugarNombreLaboral != '' || this.direccionNombreLaboral != '') {
      this.dataObject.Direccion = this.direccionNombreLaboral;
      this.dataObject.DireccionEst = 'A';
      this.dataObject.TipoDireccionCod = '2';
      this.dataObject.TipoDireccion_Id = '2';
      this.dataObject.DireccionesLugTra = this.direccionLugarNombreLaboral;
    }

    if (this.direccionNombrePersonal != '') {
      this.dataObject.Direccion = this.direccionNombrePersonal;
      this.dataObject.DireccionEst = 'A';
      this.dataObject.TipoDireccionCod = '1';
      this.dataObject.TipoDireccion_Id = '1';
    }

    if (this.telefonoPreLaboral != '' || this.telefonoNumLaboral != '') {
      if (this.telefonoPreLaboral.length < 1 && this.telefonoPreLaboral.length > 3) {
        this.isMensajeAlerta = true;
        this.mensajeAlerta = 'Prefijo laboral debe estar entre 1 y 3 caracteres';
        this.resetMensajeAlerta();
       this.isSaveaAvailable = true;
        return false;
      }

      if (this.telefonoNumLaboral.length < 7) {
        this.isMensajeAlerta = true;
        this.mensajeAlerta = 'Numero laboral demasiado corto';
        this.resetMensajeAlerta();
       this.isSaveaAvailable = true;
        return false;
      }

      if (this.telefonoNumLaboral.length > 10) {
        this.isMensajeAlerta = true;
        this.mensajeAlerta = 'Numero laboral demasiado largo';
        this.resetMensajeAlerta();
       this.isSaveaAvailable = true;
        return false;
      }

      this.dataObject.Telefonos.push({
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

    const LONG_REGEX = /^-?\d{1,2}\.\d{5,}$/;
    const LATI_REGEX = /^-?\d{1,3}\.\d{5,}$/;
    const longitudValida = LONG_REGEX.test(this.geoDomicilioLongi);
    const latitudValida = LATI_REGEX.test(this.geoDomicilioLati);

    if (!longitudValida || !latitudValida) {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Latitud o longitud inválida';
      this.resetMensajeAlerta();
     this.isSaveaAvailable = true;
      return false;
    }

    return true;
  }

  goTC(): void {
    const dataObject = {
      filterName: 'AcreditadoNumCuen',
      filterValue: this.saveData.AcreditadoNumCuen,
      idAdress: this.saveData.Direccion_Id
    }
    console.log('dataObject: ', dataObject)
    this.close();
    this.dialogService.open({ component: ContactCardComponent, data: dataObject });
  }
}
