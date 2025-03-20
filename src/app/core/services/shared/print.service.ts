import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.css']
})
export class PrintService {

  async generatePDF(elementId: string, filename: string = 'documento.pdf') {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Elemento con ID "${elementId}" no encontrado`);
      return;
    }

    // Asegurar que todas las imágenes estén cargadas
    await this.waitForImagesToLoad(element);

    // Convertir el contenido a imagen
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth * 0.9; // 90% del ancho de la hoja
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const xOffset = (pageWidth - imgWidth) / 2;
    const yOffset = 20; // Margen superior

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight);
    pdf.save(filename);
  }

  private async waitForImagesToLoad(element: HTMLElement) {
    const images = Array.from(element.getElementsByTagName('img'));
    await Promise.all(images.map(img => img.complete ? Promise.resolve() : new Promise(resolve => img.onload = resolve)));
  }
}
