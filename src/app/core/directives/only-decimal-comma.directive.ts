import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[OnlyDecimalComma]'
})
export class OnlyDecimalCommaDirective {
  private readonly FOCUS_MSG = 'Recuerda: puedes usar una sola coma (,) como separador decimal y un signo menos (-) al inicio para valores negativos';

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2
  ) {}

  @HostListener('focus')
  onFocus() {
    const input = this.el.nativeElement;
    input.setCustomValidity(this.FOCUS_MSG);
    input.reportValidity();
  }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    input.setCustomValidity('');
    const raw = input.value;
    const filtered = this.filterValue(raw);
    if (filtered !== raw) {
      this.renderer.setProperty(input, 'value', filtered);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  private filterValue(value: string): string {
    let v = value;

    // 1. Permitir opcionalmente un '-' al inicio
    const isNegative = v.startsWith('-');
    if (isNegative) {
      v = v.substring(1);
    }

    // 2. Filtrar dígitos y coma
    v = Array.from(v).filter(c => /\d|,/.test(c)).join('');

    // 3. Asegurar sólo una coma
    const parts = v.split(',');
    if (parts.length > 1) {
      v = parts.shift()! + ',' + parts.join('');
    }

    // 4. Reconstruir con el signo negativo si lo había
    return isNegative ? '-' + v : v;
  }
}
