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
      // Crear un Blob del SVG y obtener una URL
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      // Importante: para evitar problemas de CORS (si el SVG es local suele funcionar)
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Usar las dimensiones naturales del SVG (o las que tenga definido) y aplicar el factor de escala
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
        // Dibujar la imagen en el canvas con la resolución aumentada
        ctx.drawImage(img, 0, 0, width, height);
        // Liberar la URL del Blob
        URL.revokeObjectURL(url);
        // Convertir el canvas a dataURL en PNG
        resolve(canvas.toDataURL('image/png'));
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      // Asigna la URL creada al objeto Image
      img.src = url;
    });
  }

  async download(contactoData: any): Promise<void> {
    // Cargar los SVG desde los assets
    const banistmoSVG = await this.loadSVG('assets/icon/company_blue.svg');
    const userSVG = await this.loadSVG('assets/icon/contact_card_user.svg');
    const locationSVG = await this.loadSVG('assets/icon/contact_card_location.svg');

    const banistmoPNG = await this.convertSVGToPNG(banistmoSVG);
    const userPNG = await this.convertSVGToPNG(userSVG);
    const locationPNG = await this.convertSVGToPNG(locationSVG);

    // Crear el documento PDF (formato A4: 210 x 297 mm)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const marginX = 10;
    let posY = 20;
    const maxWidth = 190; // ancho máximo para textos

    // --- Cabecera: Logo y Título ---
    // Obtener propiedades de la imagen
    const imgProps = pdf.getImageProperties(banistmoPNG);
    const aspectRatio = imgProps.width / imgProps.height;
    const desiredWidth = 30; // ancho deseado en mm
    const desiredHeight = desiredWidth / aspectRatio; // alto proporcional

    // Agregar la imagen usando las medidas calculadas
    pdf.addImage(banistmoPNG, 'PNG', 160, 16, desiredWidth, desiredHeight);

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Tarjeta de Contacto', 10, posY);


    // --- Información Básica ---
    posY += 12;
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

    // Imagen de usuario (lado derecho similar a <img class="icon-user">)
    pdf.addImage(userPNG, 'PNG', 140, 27, 36, 40);

    // --- Sección Estrategia ---
    posY += 10;
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Estrategia", marginX, posY);

    // Definir la altura y padding de cada badge
    const badgeHeight = 8;
    const badgePadding = 6; // espacio extra a la izquierda y derecha
    const badgeSpacing = 5;
    posY += 5;
    let posX = marginX;

    // contactoData.estrategia.forEach((badge: string) => {
      // Medir el ancho del texto y sumar el padding
      // const textWidth = pdf.getTextWidth(badge);
      // const dynamicBadgeWidth = textWidth + badgePadding;

      // pdf.setFillColor(80, 80, 80); // color similar a @dark-gray
      // pdf.roundedRect(posX, posY, dynamicBadgeWidth, badgeHeight, 2, 2, 'F');
      // pdf.setTextColor(255, 255, 255);
      // pdf.text(badge, posX + badgePadding / 2, posY + badgeHeight - 2);

      // posX += dynamicBadgeWidth + badgeSpacing;
    // });
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('Helvetica', 'normal');

    // --- Tipo de Producto y Días de Mora / Gaveta en la misma línea ---
    posY += 15;
    const col1 = marginX;           // Columna 1: desde el margen izquierdo
    const col2 = marginX + 100;       // Columna 2: ajusta este valor según el ancho que necesites
    pdf.setFont('Helvetica', 'bold');
    pdf.text(`Tipo de producto:`, col1, posY);
    pdf.text(`Días de mora / Gaveta:`, col2, posY);

    posY += 5;
    pdf.setFont('Helvetica', 'normal');
    // Badge verde para "Tipo de producto"
    const textGreen = `${contactoData.TipoProductoNom}`;
    const textGreenWidth = pdf.getTextWidth(textGreen);
    const badgeGreenWidth = textGreenWidth + 2 * badgePadding;
    pdf.setFillColor(21, 125, 53); // Verde
    pdf.roundedRect(col1, posY, badgeGreenWidth, badgeHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255); // Texto en blanco
    pdf.text(textGreen, col1 + badgePadding, posY + badgeHeight - 3); // Ajusta verticalmente según sea necesario

    // Badge azul para "Días de mora / Gaveta"
    const textBlue = `${contactoData.CuentasDiasMoraGave}`;
    const textBlueWidth = pdf.getTextWidth(textBlue);
    const badgeBlueWidth = textBlueWidth + 2 * badgePadding;
    pdf.setFillColor(6, 114, 185); // Azul
    pdf.roundedRect(col2, posY, badgeBlueWidth, badgeHeight, 2, 2, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text(textBlue, col2 + badgePadding, posY + badgeHeight - 3);

    // Restaurar color del texto a negro si se requiere para el resto del PDF
    pdf.setTextColor(0, 0, 0);
    posY += badgeHeight + 5;

    // --- Tipo de Predio ---
    posY += 6;
    pdf.setFont('Helvetica', 'bold');
    pdf.text('Tipo de Predio:', marginX, posY);
    posY += 5;
    pdf.setFont('Helvetica', 'normal');
    pdf.text(`${contactoData.TipoPredioNom}`, marginX, posY);
    // pdf.text(`${contactoData.TipoPredioNom.join(', ')}`, marginX, posY);

    // --- Saldo de Producto ---
    // posY += 10;
    // pdf.setFont('Helvetica', 'bold');
    // pdf.text(`Saldo de Producto:`, marginX, posY);
    // posY += 5;
    // pdf.setFont('Helvetica', 'normal');
    // pdf.text(`${contactoData.saldoProducto}`, marginX, posY);

    // --- Información Laboral ---
    posY += 10;
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Información Laboral", marginX, posY);
    posY += 7;
    pdf.setFont('Helvetica', 'normal');
    contactoData.Direcciones.forEach((element: any) => {
      if (element.TipoDireccionCod == '2' || element.TipoDireccionCod == '3') {
        posY += 7;
        pdf.text(`Nombre: ${element.DireccionesLugTra}`, marginX, posY);
        posY += 7;
        pdf.text(`Dirección Laboral: ${element.Direccion}`, marginX, posY); 
      }
    })
    contactoData.Telefonos.forEach((element: any) => {
      if (element.TipoTelefonoCod == '4') {
        posY += 7;
        pdf.text(`Teléfono: (${element.TelefonoPre}) ${element.TelefonoNum}`, marginX, posY);
      }
    })

    // pdf.text(`Nombre: ${contactoData.informacionLaboral.nombre}`, marginX, posY);
    // posY += 7;
    // pdf.text(`Teléfono: ${contactoData.informacionLaboral.telefono}`, marginX, posY);
    // posY += 7;
    // pdf.text(`Dirección Laboral: ${contactoData.informacionLaboral.direccion}`, marginX, posY);

    // --- Información Personal ---
    posY += 10;
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Información Personal", marginX, posY);
    posY += 7;
    pdf.setFont('Helvetica', 'normal');
    contactoData.Direcciones.forEach((element: any) => {
      if (element.TipoDireccionCod == '2' || element.TipoDireccionCod == '3') {
        posY += 7;
        pdf.text(`Dirección Residencial: ${element.TipoDireccionCod}`, marginX, posY);
      }
    })
    posY += 7;
    pdf.text("Teléfonos de Contacto:", marginX, posY);
    contactoData.Telefonos.forEach((element: any) => {
      if (element.TipoTelefonoCod == '1') {
        posY += 7;
        pdf.text(`Móvil(es): (${element.TelefonoPre}) ${element.TelefonoNum}`, marginX, posY);
      }
      if (element.TipoTelefonoCod == '2' || element.TipoTelefonoCod == '3') {
        posY += 7;
        pdf.text(`Residencial(es): (${element.TelefonoPre}) ${element.TelefonoNum}`, marginX, posY);
      }
      if (element.TipoTelefonoCod == '5') {
        posY += 7;
        pdf.text(`Otros: (${element.TelefonoPre}) ${element.TelefonoNum}`, marginX, posY);
      }
    })

    // pdf.text(`Dirección Residencial: ${contactoData.informacionPersonal.direccion}`, marginX, posY);
    // posY += 7;
    // pdf.text(`Teléfonos de Contacto: ${contactoData.informacionPersonal.telefonos}`, marginX, posY);
    // posY += 7;
    // pdf.text(`Residenciales: ${contactoData.informacionPersonal.residenciales}`, marginX, posY);
    // posY += 7;
    // pdf.text(`Otros: ${contactoData.informacionPersonal.otros}`, marginX, posY);
    // posY += 7;

    // Para el email, usamos splitTextToSize:
    posY += 7;
    pdf.text("Email de contacto:", marginX, posY);
    contactoData.Correos.forEach((element: any, index: number) => {
      posY += 7;
      pdf.text(`${index + 1}. ${element.CorreoElec}`, marginX, posY);
    })
    // const emailText = `Email de contacto: ${contactoData.informacionPersonal.email.join(', ')}`;
    // const emailLines = pdf.splitTextToSize(emailText, maxWidth);
    // pdf.text(emailLines, marginX, posY);
    // posY += emailLines.length * 9; //  mm de alto por línea 

    // --- Fincas Asociadas (simulando el botón badge) ---
    posY += 7;
    pdf.setFont('Helvetica', 'bold');
    pdf.text("Fincas Asociadas", marginX, posY);
    posY += 7;
    pdf.setFont('Helvetica', 'normal');
    pdf.text(`Número de Finca / Folio N.: ${contactoData.fincas.numeroFinca}`, marginX, posY);
    posY += 7;
    pdf.text(`Dirección: ${contactoData.fincas.direccion}`, marginX, posY);

    // --- Ubicación: Alinear ícono y texto ---
    posY += 7;
    const locationIconSize = 7;
    pdf.addImage(locationPNG, 'PNG', marginX, posY, locationIconSize, locationIconSize);
    // Alineamos el texto verticalmente respecto al ícono; ajusta el offset vertical según convenga
    pdf.text(`8.11127 , -80.97002`, marginX + locationIconSize + 5, posY + locationIconSize - 1);


    // Guardar y descargar el PDF
    pdf.save(`idcredito-${contactoData.AcreditadoNumCuen}`);
  }
}
