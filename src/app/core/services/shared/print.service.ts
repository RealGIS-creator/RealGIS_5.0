import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }

  async generatePDF(elementId: string, fileName: string = 'documento.pdf'): Promise<void> {
    const element = document.getElementById(elementId);

    if (!element) {
      console.error(`Elemento con ID '${elementId}' no encontrado.`);
      return;
    }

    await this.convertSVGToImages(element); // Convertir SVG a imágenes antes de capturar

    html2canvas(element, { scale: 2 }).then(canvas => {
      // const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
      pdf.save(fileName);
    }).catch(error => console.error('Error generando el PDF:', error));
  }

  private async convertSVGToImages(element: HTMLElement): Promise<void> {
    const svgs = Array.from(element.querySelectorAll('svg')); // Convertir NodeList a Array
    
    for (const svg of svgs) {
      const img = await this.svgToImage(svg);
      svg.replaceWith(img);
    }
  }

  private svgToImage(svg: SVGSVGElement): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const xml = new XMLSerializer().serializeToString(svg);
      const svg64 = btoa(unescape(encodeURIComponent(xml))); 
      const imgSrc = 'data:image/svg+xml;base64,' + svg64;
      const img = new Image();
      img.src = imgSrc;
      img.width = svg.clientWidth;
      img.height = svg.clientHeight;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  }
}
