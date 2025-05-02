import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfContactCardService {

  constructor(private http: HttpClient) { }

  private async loadSVG(url: string): Promise<string> {
    return firstValueFrom(this.http.get(url, { responseType: 'text' }));
  }

  async convertSVGToPNG(svgString: string, scaleFactor: number = 2): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Evitar problemas de CORS para SVGs locales
      img.onload = () => {
        const width = img.naturalWidth * scaleFactor;
        const height = img.naturalHeight * scaleFactor;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject('No se pudo obtener el contexto 2D');
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  }

  async download(contactoData: any): Promise<void> {
    const userSVG = await this.loadSVG('assets/icon/contact_card_user.svg');
    const locationSVG = await this.loadSVG('assets/icon/contact_card_location.svg');
    const userPNG = await this.convertSVGToPNG(userSVG);
    const locationPNG = await this.convertSVGToPNG(locationSVG);

    // Crear el documento PDF (A4: 210 x 297 mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const marginX = 10;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();

    const badgePadding = 6;
    const badgeHeight = 8;

    // --- Calcular Header y Footer como marcas de agua ---
    const headerSVG = await this.loadSVG('assets/icon/watermark_header.svg');
    const footerSVG = await this.loadSVG('assets/icon/watermark_footer.svg');
    const watermarkImage = await this.convertSVGToPNG(await this.loadSVG('assets/icon/watermark.svg'));
    // Mejor calidad para header/footer
    const headerImage = await this.convertSVGToPNG(headerSVG, 3);
    const footerImage = await this.convertSVGToPNG(footerSVG, 3);

    // Calcular dimensiones para header conservando su relación de aspecto
    let headerProps = pdf.getImageProperties(headerImage);
    const headerAspectRatio = headerProps.width / headerProps.height;
    const computedHeaderWidth = pageWidth; // Ocupa todo el ancho
    const computedHeaderHeight = computedHeaderWidth / headerAspectRatio;

    // Calcular dimensiones para footer conservando su relación de aspecto
    let footerProps = pdf.getImageProperties(footerImage);
    const footerAspectRatio = footerProps.width / footerProps.height;
    const computedFooterWidth = pageWidth;
    const computedFooterHeight = computedFooterWidth / footerAspectRatio;

    // Definir márgenes para el contenido: se reserva espacio en la parte superior e inferior
    const topMargin = computedHeaderHeight + 5;    // header + 5 mm de separación
    const bottomMargin = computedFooterHeight + 5;   // footer + 5 mm de separación

    // Función para agregar nueva página respetando los márgenes de contenido
    let posY = topMargin; // El contenido inicia justo debajo del header
    const checkAddPage = (lineHeight: number) => {
      if (posY + lineHeight > pageHeight - bottomMargin) {
        pdf.addPage();
        posY = topMargin;
      }
    };

    // --- Contenido Principal ---
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Tarjeta de Contacto', marginX, posY);

    posY += 15;
    pdf.setFontSize(12);
    pdf.setFont('Helvetica', 'normal');
    pdf.text(`ID DE CRÉDITO: ${contactoData.AcreditadoNumCuen}`, marginX, posY);
    posY += 7;
    pdf.text(`Identificación: ${contactoData.AcreditadoIdenti}`, marginX, posY);
    posY += 7;
    pdf.text(`Nombre: ${contactoData.AcreditadoNom}`, marginX, posY);
    posY += 7;
    pdf.text(`No. Acreditado: ${contactoData.AcreditadoNum}`, marginX, posY);
    posY += 7;
    pdf.text(`CIS: ${contactoData.CuentasCis}`, marginX, posY);

    // Imagen de usuario (posición fija, ajusta según sea necesario)
    pdf.addImage(userPNG, 'PNG', 140, 42, 36, 40);

    // --- Sección Estrategia ---
    checkAddPage(9);
    posY += 10;
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Estrategia", marginX, posY);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('Helvetica', 'normal');
    const badgeSpacing = 5;
    posY += 5;
    let posX = marginX;
    checkAddPage(9);
    // const estrategias = ['TDD', 'TDC', 'TOKENIZACIÓN', 'DESCUENTO DIRECTO']
    const estrategias = [{name:'TDD', id: 3}, {name:'TDC', id:2}, {name:'TOKENIZACIÓN', id:4}, {name:'DESCUENTO DIRECTO', id:1}]
    estrategias.forEach((badge: any) => {
      const textWidth = pdf.getTextWidth(badge.name);
      const dynamicBadgeWidth = textWidth + badgePadding;

      contactoData.TipoEstrategia_Id == badge.id ? pdf.setFillColor(21, 125, 53) : pdf.setFillColor(80, 80, 80);
      pdf.roundedRect(posX, posY, dynamicBadgeWidth, badgeHeight, 2, 2, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.text(badge.name, posX + badgePadding / 2, posY + badgeHeight - 2);

      posX += dynamicBadgeWidth + badgeSpacing;
    });
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('Helvetica', 'normal');

    // --- Tipo de Producto y Días de Mora / Gaveta ---
    checkAddPage(9);
    posY += 15;
    const col1 = marginX;
    const col2 = marginX + 100;
    pdf.setFont('Helvetica', 'bold');
    pdf.text(`Tipo de producto:`, col1, posY);
    pdf.text(`Días de mora / Gaveta:`, col2, posY);

    posY += 5;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'normal');
    const textGreen = `${contactoData.TipoProductoNom}`;
    const textGreenWidth = pdf.getTextWidth(textGreen);
    const badgeGreenWidth = textGreenWidth + 2 * badgePadding;
    pdf.setFillColor(21, 125, 53);
    pdf.roundedRect(col1, posY, badgeGreenWidth, badgeHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(textGreen, col1 + badgePadding, posY + badgeHeight - 3);

    checkAddPage(9);
    const textBlue = `${contactoData.CuentasDiasMoraGave}`;
    const textBlueWidth = pdf.getTextWidth(textBlue);
    const badgeBlueWidth = textBlueWidth + 2 * badgePadding;
    pdf.setFillColor(6, 114, 185);
    pdf.roundedRect(col2, posY, badgeBlueWidth, badgeHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(textBlue, col2 + badgePadding, posY + badgeHeight - 3);

    pdf.setTextColor(0, 0, 0);
    posY += badgeHeight + 5;

    // --- Tipo de Predio ---
    posY += 6;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Tipo de Predio:', marginX, posY);
    posY += 5;
    pdf.setFont('Helvetica', 'normal');
    pdf.text(`${contactoData.TipoPredioNom}`, marginX, posY);

    // --- saldo ---
    posY += 10;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Saldo de Producto:', marginX, posY);
    posY += 5;
    pdf.setFont('Helvetica', 'normal');
    pdf.text(`${contactoData.CuentasSalPro}`, marginX, posY);

    // --- Información Laboral ---
    posY += 10;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Información Laboral", marginX, posY);
    posY += 1;
    pdf.setFont('Helvetica', 'normal');
    if (contactoData.TipoDireccionCod === '2' || contactoData.TipoDireccionCod === '2') {
      // posY += 7;
      // pdf.text(`Nombre: ${contactoData.Direccion}`, marginX, posY);

      posY += 7;
      checkAddPage(9);
    
      const fullLabDir = `Nombre: ${contactoData.Direccion}`;
      const maxWidth = pageWidth - marginX * 2;
      const labLines = pdf.splitTextToSize(fullLabDir, maxWidth);
      labLines.forEach((line: string, i: number) => {
        checkAddPage(9 * (labLines.length - i));
        pdf.text(line, marginX, posY);
        posY += 7;
      });
    }

    // const laboralDireccionFiltro = contactoData.Direcciones
    //   .filter((element: any) => element.TipoDireccionCod === '2' || element.TipoDireccionCod === '3');

    // const laboralDireccion = laboralDireccionFiltro.map((element: any) => element.DireccionesLugTra).join(' - ');
    // const direcciones = laboralDireccionFiltro.map((element: any) => element.Direccion).join(' - ');

    const telefonos = contactoData.Telefonos
    .filter((element: any) => element.TipoTelefonoCod === '4')
    .map((element: any) => `(${element.TelefonoPre}) ${element.TelefonoNum}`)
    .join('- ');

    // if (laboralDireccion) {
    //   posY += 7;
    //   pdf.text(`Nombre: ${laboralDireccion}`, marginX, posY);
    // }
    if (telefonos) {
      posY += 7;
      pdf.text(`Teléfono: ${telefonos}`, marginX, posY);
    }
    // if (direcciones) {
    //   posY += 7;
    //   pdf.text(`Dirección Laboral: ${direcciones}`, marginX, posY);
    // }
    if (contactoData.TipoDireccionCod === '2' || contactoData.TipoDireccionCod === '2') {
      // posY += 7;
      // pdf.text(`Dirección Laboral: ${contactoData.DireccionesLugTra}`, marginX, posY);

      posY += 7;
      checkAddPage(9);
    
      const fullLabDir = `Dirección Laboral: ${contactoData.DireccionesLugTra}`;
      const maxWidth = pageWidth - marginX * 2;
      const labLines = pdf.splitTextToSize(fullLabDir, maxWidth);
      labLines.forEach((line: string, i: number) => {
        checkAddPage(9 * (labLines.length - i));
        pdf.text(line, marginX, posY);
        posY += 7;
      });
    }

    

    // --- Información Personal ---
    posY += 10;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Información Personal", marginX, posY);
    posY += 1;
    pdf.setFont('Helvetica', 'normal');
    // const direccionesResidenciales = contactoData.Direcciones
    // .filter((element: any) => element.TipoDireccionCod === '1').map((element: any) => element.DireccionesLugTra).join(' - ');

    // if (direccionesResidenciales) {
    //   posY += 7;
    //   pdf.text(`Dirección Residencial: ${direccionesResidenciales}`, marginX, posY);
    // }
    if (contactoData.TipoDireccionCod === '1') {
      // posY += 7;
      // pdf.text(`Dirección Residencial: ${contactoData.Direccion}`, marginX, posY);

      posY += 7;
      checkAddPage(9);
    
      const fullLabDir = `Dirección Residencial: ${contactoData.Direccion}`;
      const maxWidth = pageWidth - marginX * 2;
      const labLines = pdf.splitTextToSize(fullLabDir, maxWidth);
      labLines.forEach((line: string, i: number) => {
        checkAddPage(9 * (labLines.length - i));
        pdf.text(line, marginX, posY);
        posY += 7;
      });
    }

    checkAddPage(9);
    const telefonoMovilFiltro = contactoData.Telefonos
    .filter((element: any) => element.TipoTelefonoCod === '1').map((element: any) => `(${element.TelefonoPre}) ${element.TelefonoNum}`).join(' - ');

    const telefonoResidencialFiltro = contactoData.Telefonos
    .filter((element: any) => element.TipoTelefonoCod === '2' || element.TipoTelefonoCod === '3').map((element: any) => `(${element.TelefonoPre}) ${element.TelefonoNum}`).join(' - ');

    const telefonoOtroFiltro = contactoData.Telefonos
    .filter((element: any) => element.TipoTelefonoCod === '5').map((element: any) => `(${element.TelefonoPre}) ${element.TelefonoNum}`).join(' - ');

    if (telefonoMovilFiltro) {
      posY += 7;
      pdf.text(`Móvil(es): ${telefonoMovilFiltro}`, marginX, posY);
    }
    if (telefonoResidencialFiltro) {
      posY += 7;
      pdf.text(`Residencial(es): ${telefonoResidencialFiltro}`, marginX, posY);
    }
    if (telefonoOtroFiltro) {
      posY += 7;
      pdf.text(`Otros: ${telefonoOtroFiltro}`, marginX, posY);
    }

    // --- Email de contacto ---
    posY += 7;
    checkAddPage(9);
    pdf.text("Email de contacto:", marginX, posY);
    contactoData.Correos.forEach((element: any, index: number) => {
      posY += 7;
      pdf.text(`${index + 1}. ${element.CorreoElec}`, marginX, posY);
    });

    // --- Fincas Asociadas ---
    posY += 10;
    checkAddPage(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Fincas Asociadas", marginX, posY);

    contactoData.Fincas.forEach((element: any, index: number) => {
      // Número de finca / folio
      posY += 7;
      checkAddPage(9);
      pdf.setFont('Helvetica', 'normal');
      pdf.text(
        `Número de Finca / Folio N.: ${element.FincaFolio}`,
        marginX,
        posY
      );
    
      // Dirección con wrap automático
      posY += 7;
      checkAddPage(9);
    
      // 1. Construimos el texto completo
      const fullDirText = `Dirección: ${element.FincaDireccion}`;
    
      // 2. Definimos el ancho máximo (ancho de página menos márgenes)
      const maxWidth = pageWidth - marginX * 2;
    
      // 3. Dividimos el texto en líneas que quepan en maxWidth
      const lines = pdf.splitTextToSize(fullDirText, maxWidth);
    
      // 4. Dibujamos cada línea y vamos avanzando posY
      lines.forEach((line: string, i: number) => {
        // Antes de dibujar, comprobamos si caben las siguientes líneas
        checkAddPage(9 * (lines.length - i));
        pdf.text(line, marginX, posY);
        posY += 7;
      });
    });

    // --- Ubicación ---
    posY += 7;
    checkAddPage(9);
    const locationIconSize = 7;
    pdf.addImage(locationPNG, 'PNG', marginX, posY, locationIconSize, locationIconSize);
    pdf.text(`${contactoData.GeoDomicilioLati}, ${contactoData.GeoDomicilioLongi}`, marginX + locationIconSize + 5, posY + locationIconSize - 1);


    // --- Agregar Header y Footer en cada página ---
    const totalPages = (pdf.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      // (pdf as any).setGState(new (pdf as any).GState({ opacity: 0.2 }));
      pdf.addImage(headerImage, 'PNG', 0, 0, pageWidth, computedHeaderHeight);
      pdf.addImage(footerImage, 'PNG', 0, pageHeight - computedFooterHeight, pageWidth, computedFooterHeight);
      // Agregar marca de agua central 
      const watermarkWidth = 100;
      const watermarkHeight = 70;
      const centerX = (pageWidth - watermarkWidth) / 2;
      const centerY = (pageHeight - watermarkHeight) / 2;
      pdf.addImage(watermarkImage, 'PNG', centerX, centerY, watermarkWidth, watermarkHeight);
      // (pdf as any).setGState(new (pdf as any).GState({ opacity: 1 }));
    }

    pdf.save(`idcredito-${contactoData.AcreditadoNumCuen}`);
  }

}
