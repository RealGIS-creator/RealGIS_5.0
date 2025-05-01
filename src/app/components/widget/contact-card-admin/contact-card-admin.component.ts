import { Component, ComponentRef, Input } from '@angular/core';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { CommonModule } from '@angular/common';
import { InformationCard } from '../../../interfaces/information-card';
import { BehaviorSubject } from 'rxjs';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { FormsModule } from '@angular/forms';
import { ContactCardAdminService } from '../../../core/services/widget/contact-card-admin.service';
import { OnlyNumberDirective } from '../../../core/directives/only-number.directive';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { PdfContactCardService } from '../../../core/services/widget/pdf-contact-card.service';
import { OnlyDecimalCommaDirective } from '../../../core/directives/only-decimal-comma.directive';
import { ExactLengthTenDirective } from '../../../core/directives/exact-length-ten.directive';
import { ExactLengthThreeDirective } from '../../../core/directives/exact-length-three.directive';
import { EmailFormatDirective } from '../../../core/directives/email-format.directive';
import { NoQuotesDirective } from '../../../core/directives/no-quotes.directive';

@Component({
  selector: 'app-contact-card-admin',
  imports: [MovableCardComponent,
    CommonModule,
    FormsModule,
    OnlyNumberDirective,
    OnlyDecimalCommaDirective,
    ExactLengthTenDirective,
    ExactLengthThreeDirective,
    EmailFormatDirective,
    NoQuotesDirective],
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
  isAddFinca = false;
  isSave = false;
  isTC = false;
  isMensajeAlerta = false;
  isMainMenu = true;

  infoUserCard!: InformationCard;
  nuevoTelefonoPre?: number | null;
  nuevoTelefono?: number | null;
  nuevoEmail: string = '';
  nuevaFinca: string = '';
  nuevaFincaDireccion: string = '';
  typeTelefono: number = 0;
  typeEmail: number = 0;
  telefonoPreLaboral: string = '';
  telefonoLaboral: string = '';
  mensajeAlerta: string = '';

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
    private contactCardAdminService: ContactCardAdminService,
    private pdfContactCardService: PdfContactCardService
  ) { }

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

  get hasLaboralTipo4(): boolean {
    return this.data.Telefonos.some((t: any) => t.TipoTelefono_Id === '4');
  }

  get displayIcon() {
    return this.isVisible ? 'display_white_down.svg' : 'display_white_up.svg';
  }

  onEstrategia(nameEstrategia: string, idEstategia: number): void {
    this.data.TipoEstrategiaNom = nameEstrategia;
    this.data.TipoEstrategia_Id = idEstategia;
  }

  onPredio(namePredio: string, idPredio: number): void {
    this.data.TipoPredioNom = namePredio;
    this.data.TipoPredioCod = idPredio;
  }

  selectTipoProducto(nameProducto: string, idProducto: number): void {
    this.data.TipoProductoNom = nameProducto;
    this.data.TipoProducto_Id = idProducto;
    this.selectedOption = this.data.TipoProductoNom;
    this.clickSearcher();
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

  // ----- telefono
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
    this.isAddTelefonoOtro = false
  }

  AddTelefonoOtro(type: number = 0): void {
    this.isAddTelefonoOtro = this.isAddTelefonoOtro ? false : true;
    this.typeTelefono = type ? type : 0;
    this.isAddTelefonoMovil = false;
    this.isAddTelefonoResidencial = false;
  }

  clearTelefono(): void {
    this.typeTelefono = 0;
    this.nuevoTelefono = null;
    this.nuevoTelefonoPre = null;
  }

  newTelefono(): void {
    if (this.nuevoTelefonoPre == 0 || this.nuevoTelefono == 0 || this.typeTelefono == 0) {
      return;
    }

    this.data.Telefonos.push({
      TipoTelefono_Id: this.typeTelefono,
      TelefonoNum: this.nuevoTelefono,
      TelefonoPre: this.nuevoTelefonoPre,
      Telefono_Nuevo: '1',
      TelefonoEst: 'A',
    })

    this.closeTelefono();
    this.clearTelefono();
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

  closeFinca(): void {
    this.isAddFinca = false;
  }

  // ------- correos
  AddEmail(): void {
    this.isAddEmail = this.isAddEmail ? false : true;
  }

  onTipoEmail(selectedOption: number): void {
    this.typeEmail = selectedOption;
  }

  newEmail(): void {
    if (this.nuevoEmail.trim() == '' || this.typeEmail == null || this.typeEmail == 0) {
      return;
    }

    this.data.Correos.push({
      TipoCorreo_Id: this.typeEmail,
      CorreoElec: this.nuevoEmail.trim(),
      CorreoEst: 'A',
      Correo_Nuevo: '1',
    });

    this.nuevoEmail = '';
    this.typeEmail = 0;

    this.closeEmail();
    //this.cdr.markForCheck();
  }

  closeEmail(): void {
    this.isAddEmail = false;
  }

  deleteEmail(id: number): void {
    this.data.Correos = this.data.Correos.map((c: any) =>
      c.Correo_Id == id
        ? { ...c, CorreoEst: 'I' }
        : c
    );

    console.log(this.data);
  }

  // ------ fincas
  AddFinca(): void {
    this.isAddFinca = this.isAddFinca ? false : true;
  }

  newFinca(): void {
    if (this.nuevaFinca.trim() == '' && this.nuevaFincaDireccion.trim() == '') {
      return;
    }

    this.data.Fincas.push({
      FincaFolio: this.nuevaFinca,
      FincaDireccion: this.nuevaFincaDireccion,
      FincaEst: 'A',
      Finca_Nuevo: '1',
    });
    this.nuevaFinca = '';
    this.nuevaFincaDireccion = '';
    this.closeFinca();
  }

  deleteFinca(id: number): void {
    this.data.Fincas = this.data.Fincas.map((f: any) =>
      f.Finca_Id == id
        ? { ...f, FincaEst: 'I' }
        : f
    );
  }

  save(): void {
    console.log('data final: ', this.data)
    if (this.validateData()) {
      this.contactCardAdminService.updateContactCard([this.data]).subscribe((res) => {
        this.isSave = true;
        this.isMainMenu = false;
        this.download();
      })
    }
  }

  resetMensajeAlerta(): void {
    setTimeout(() => {
      this.isMensajeAlerta = false;
      this.mensajeAlerta = '';
    }, 1000);
  }

  validateData(): boolean {
    if (this.telefonoLaboral != '' || this.telefonoPreLaboral != '') {
      if (this.telefonoPreLaboral.length < 1 && this.telefonoPreLaboral.length > 3) {
        this.isMensajeAlerta = true;
        this.mensajeAlerta = 'Prefijo laboral debe estar entre 1 y 3 caracteres';
        this.resetMensajeAlerta();
        return false;
      }

      if (this.telefonoLaboral.length < 10) {
        this.isMensajeAlerta = true;
        this.mensajeAlerta = 'Numero laboral demasiado corto';
        this.resetMensajeAlerta();
        return false;
      }

      this.data.Telefonos.push({
        TipoTelefono_Id: 4,
        TelefonoNum: this.telefonoLaboral,
        TelefonoPre: this.telefonoPreLaboral,
        Telefono_Nuevo: '1',
        TelefonoEst: 'A',
      })
    }

    if (this.data.TipoEstrategiaNom == '' || this.data.TipoEstrategia_Id == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Estrategia obligatoria';
      this.resetMensajeAlerta();
      return false;
    }

    if (this.data.TipoProductoNom == '' || this.data.TipoProducto_Id == '') {
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Producto obligatorio';
      this.resetMensajeAlerta();
      return false;
    }

    if (this.data.Direccion == '' && this.data.DireccionesLugTra == '' && this.data.TipoDireccion_Id == '') {
      console.log('Direccion no puede estar vacio');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Direccion no puede estar vacio';
      this.resetMensajeAlerta();
      return false;
    }

    if (this.data.GeoDomicilioLati == '' && this.data.GeoDomicilioLongi == '') {
      console.log('Latitud y Longitud no puede estar vacio');
      this.isMensajeAlerta = true;
      this.mensajeAlerta = 'Latitud y Longitud no pueden estar vacios';
      this.resetMensajeAlerta();
      return false;
    }

    return true;
  }

  goTC(): void {
    const data = {
      filterName: 'AcreditadoNumCuen',
      filterValue: this.data.AcreditadoNumCuen,
      idAdress: this.data.Direccion_Id
    }
    this.close();
    this.dialogService.open({ component: ContactCardComponent, data: data });
  }

  download(): void {
    this.pdfContactCardService.download(this.data);
  }

}
