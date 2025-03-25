import { Component, ComponentRef, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssociatedFarmsContactCardComponent } from '../associated-farms-contact-card/associated-farms-contact-card.component';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { PdfContactCardService } from '../../../core/services/widget/pdf-contact-card.service';

@Component({
  selector: 'app-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.less',
})
export class ContactCardComponent {
  public isVisibleInformacionPersonal = false;
  public isVisibleInformacionEmployment = false;
  public isVisibleFarmsContactCard = false;
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;

  dialogRef!: ComponentRef<any>;

  private dialogService = inject(DialogService);
  private sidebarShowDataService = inject(SidebarShowDataService);
  private pdfContactCardService = inject(PdfContactCardService);

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

  get displayIconPersonal() {
    return this.isVisibleInformacionPersonal
      ? 'display_gray_down.svg'
      : 'display_gray_up.svg';
  }

  get displayIconEmployment() {
    return this.isVisibleInformacionEmployment
      ? 'display_gray_down.svg'
      : 'display_gray_up.svg';
  }

  openAssociatedFarmsContactCard(): void {
    this.isVisibleFarmsContactCard = !this.isVisibleFarmsContactCard;

    const config = {
      component: AssociatedFarmsContactCardComponent,
    };

    if (this.isVisibleFarmsContactCard) {
      this.dialogRef = this.dialogService.open(config);
    } else {
      this.dialogService.close(this.dialogRef);
    }
  }

  close(): void {
    this.dialogService.closeAll();
    this.sidebarShowDataService.setData({ activeIndex: 0 });
  }

  minimize(): void {
    this.isVisibleInformacionPersonal = false;
    this.isVisibleInformacionEmployment = false;
  }

  download(): void {
    const contactoData = {
      title: "Tarjeta de Contacto",
      credito: "0000000000000000",
      identificacion: "1-711-2213",
      nombre: "PEDRO PEREZ",
      acreditado: "52815670",
      cis: "000000000",
      estrategia: ["TDD", "TDC", "TOKENIZACIÓN", "DESCUENTO DIRECTO"],
      tipoProducto: "Préstamo Hipotecario",
      diasMora: "170",
      tipoPredio: ["Residencial", "Comercial", "Industrial"],
      saldoProducto: "$ 5000,32 USD",
      informacionLaboral: {
        nombre: "Realtix SAS",
        telefono: "0000000000",
        direccion: "Mz x Casa 31 Barrio"
      },
      informacionPersonal: {
        direccion: "Mz x Casa 31 Barrio XXXX",
        telefonos: "3124545 - 451111 - 7888888",
        residenciales: "(507) 5247198 - (507) 6324781 - (507) 2574186",
        otros: "(507) 5247198 - (507) 6324781 - (507) 2574186",
        email: [
          "residencial@empresa.com",
          "comercial@empresa.com",
          "industrial@empresa.com",
          "industrial2@empresa.com"
        ]
      },
      fincas: {
        numeroFinca: '07878414',
        direccion: 'Mz x Casa 41B'
      },
      ubicacion: "8.11127 , -80.97002"
    };

    this.pdfContactCardService.download(contactoData);
  }

}
