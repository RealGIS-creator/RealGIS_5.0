import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'verifiedAccount'
})
export class VerifiedAccountPipe implements PipeTransform {

  transform(tipoId: string): string {
    switch (tipoId) {
      case '1': return 'assets/icon/editar_activo.svg';
      case '2': return 'assets/icon/contact_card_user.svg';
      case '3': return 'assets/icon/editar_activo.svg';
      default: return '';
    }
  }
}
