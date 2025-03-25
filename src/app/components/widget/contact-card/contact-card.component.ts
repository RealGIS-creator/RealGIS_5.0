import { Component, ComponentRef, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssociatedFarmsContactCardComponent } from '../associated-farms-contact-card/associated-farms-contact-card.component';
import { MovableCardComponent } from '../../shared/movable-card/movable-card.component';
import { DialogService } from '../../../core/services/shared/dialog.service';
import { SidebarShowDataService } from '../../../core/services/widget/sidebar-show-data.service';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    if (!this.pdfContent) {
      console.error('pdfContent no está definido.');
      return;
    }

    // Convertir SVGs en imágenes antes de capturar el PDF
    this.convertSVGsToImages();

    setTimeout(() => {
      const DATA = this.pdfContent!.nativeElement;

      html2canvas(DATA, {
        scale: 2, // Mayor resolución
        useCORS: true,
        backgroundColor: null,
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save('Tarjeta_Contacto.pdf');
      }).catch(error => {
        console.error('Error al generar el PDF:', error);
      });
    }, 500); // Se da un tiempo para que las imágenes se reemplacen antes de la captura
  }

  private convertSVGsToImages(): void {
    const svgElements = this.pdfContent!.nativeElement.querySelectorAll('svg');

    svgElements.forEach((svgElement: any) => {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const img = new
    Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        svgElement.replaceWith(img); // Reemplaza el SVG con la imagen
      };

      img.src = url;
    });
  }
}
