import { Component, ComponentRef, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { AssociatedFarmsContactCardComponent } from '../associated-farms-contact-card/associated-farms-contact-card.component';
import { ContactCard } from '../../../interfaces/contact-card';
import { PrintService } from '../../../core/services/shared/print.service';

@Component({
  selector: 'app-contact-card',
  imports: [MovableCardComponent, CommonModule],
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.less',
  providers: []
})
export class ContactCardComponent {
  public isVisibleInformacionPersonal = false;
  public isVisibleInformacionEmployment = false;
  public isVisibleFarmsContactCard = false;

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef

  dialogRef!: ComponentRef<any>;
  appMovableCard: ContactCard[] = [
    {
      "id": "contactCard",
      "title": {
        "text": "Tarjeta de Contacto",
        "icons": [
          { "src": "assets/icon/contact_card_download.svg", "alt": "", "action": "download" },
          { "src": "assets/icon/contact_card_minimize.svg", "alt": "", "action": "minimize" },
          { "src": "assets/icon/contact_card_close.svg", "alt": "", "action": "close" }
        ]
      },
      "sections": [
        {
          "type": "text-top",
          "title": "Contacto",
          "value": [
            { "label": "ID de Crédito", "value": "0000000000000000" },
            { "label": "Identificación", "value": "1-711-2213" },
            { "label": "Nombre", "value": "PEDRO PEREZ" },
            { "label": "No. Acreditado", "value": "52815670" },
            { "label": "CIS", "value": "000000000" }
          ],
          "icons": [
            { "src": "assets/icon/company_white.svg", "alt": "", "action": null }
          ]
        },
        {
          "type": "badges",
          "title": "Estrategia",
          "badges": [
            { "text": "TDD", "style": "bg-gray" },
            { "text": "TDC", "style": "bg-gray" },
            { "text": "TOKENIZACIÓN", "style": "bg-gray" },
            { "text": "DESCUENTO DIRECTO", "style": "bg-green" }
          ]
        },
        {
          "type": "badges",
          "title": "Tipo de Producto",
          "badges": [
            { "text": "Préstamo Hipotecario", "style": "bg-green" }
          ]
        },
        {
          "type": "badges",
          "title": "Días de Mora / Gaveta",
          "badges": [
            { "text": "170", "style": "bg-blue" }
          ]
        },
        {
          "type": "badges",
          "title": "Tipo de Predio",
          "badges": [
            { "text": "Residencial", "style": "bg-property" },
            { "text": "Comercial", "style": "bg-property" },
            { "text": "Industrial", "style": "bg-property" }
          ]
        },
        {
          "type": "text",
          "title": "Saldo de Producto",
          "value": "$ 5000,32 USD",
          // "badges": [
          //   { "text": "$ 5000,32 USD", "style": "bg-green" }
          // ]
        },
        {
          "type": "expandible-column",
          "title": "Información Laboral",
          "visible": false,
          "details": [
            { "label": "Nombre", "value": "Realtix SAS" },
            { "label": "Teléfono", "value": "0000000000" },
            { "label": "Dirección Laboral", "value": "Mz x Casa 31 Barrio" }
          ]
        },
        {
          "type": "expandible-row",
          "title": "Información Personal",
          "visible": false,
          "details": [
            { "label": "Dirección Residencial", "value": "Mz x Casa 31 Barrio XXXX" },
            { "label": "Móviles", "value": "3124545 - 451111 - 7888888" },
            { "label": "Residenciales", "value": "(507) 5247198 - (507) 6324781 - (507) 2574186" },
            { "label": "Otros", "value": "(507) 5247198 - (507) 6324781 - (507) 2574186" },
            { "label": "Email de Contacto", "value": "correo1@ejemplo.com, correo2@ejemplo.com" }
          ]
        },
        {
          "type": "action",
          "title": "FINCAS ASOCIADAS",
          "action": "openAssociatedFarmsContactCard"
        }
      ],
      "location": {
        "coords": "8.11127 , -80.97002",
        "icon": "assets/icon/contact_card_location.svg"
      },
      "actions": {
        "download": "download()",
        "minimize": "minimize()",
        "close": "close()",
        "openAssociatedFarmsContactCard": "openAssociatedFarmsContactCard()"
      }
    }
  ]

  private dialogService = inject(DialogService);
  private sidebarShowDataService = inject(SidebarShowDataService);
  private printService = inject(PrintService);

  showInformationPersonal(): void {
    this.isVisibleInformacionPersonal = this.isVisibleInformacionPersonal ? false : true;
  }

  showInformationEmployment(): void {
    this.isVisibleInformacionEmployment = this.isVisibleInformacionEmployment ? false : true;
  }

  get displayIconPersonal() {
    return this.isVisibleInformacionPersonal ? 'display_gray_down.svg' : 'display_gray_up.svg';
  }

  get displayIconEmployment() {
    return this.isVisibleInformacionEmployment ? 'display_gray_down.svg' : 'display_gray_up.svg';
  }

  openAssociatedFarmsContactCard(): void {
    this.isVisibleFarmsContactCard = !this.isVisibleFarmsContactCard;

    const config = {
      component: AssociatedFarmsContactCardComponent
    };

    if(this.isVisibleFarmsContactCard) {
      this.dialogRef = this.dialogService.open(config)
    } else {
      this.dialogService.close(this.dialogRef)
    }
  }

  close(): void {
    this.dialogService.closeAll();
    this.sidebarShowDataService.setData({activeIndex: 0})
  }

  minimize(): void {
    this.isVisibleInformacionPersonal = false;
    this.isVisibleInformacionEmployment = false;
  }

  download(): void {
    this.isVisibleInformacionPersonal = true;
    this.isVisibleInformacionEmployment = true;

    this.printService.download(this.appMovableCard);
  }

  handleAction(action: string | null) {
    if (!action) { return; }
    switch(action) {
      case 'download': this.download(); break;
      case 'minimize': this.minimize(); break;
      case 'close': this.close(); break;
      case 'openAssociatedFarmsContactCard': this.openAssociatedFarmsContactCard(); break;
      default: break;
    }
  }

  chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  toggleSection(section: any): void {
    section.visible = !section.visible;
  }
}
