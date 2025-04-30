import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[OnlyDecimal2IntDirective]'
})
export class OnlyDecimal2IntDirectiveDirective {
  private editRegex  = /^-?\d{0,2}(?:\.\d*)?$/;
  private finalRegex = /^-?\d{1,2}\.\d+$/;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let value = input.value;

    // 1) elimina caracteres no permitidos
    value = value.replace(/[^0-9.\-]/g, '');

    // 2) un solo signo al inicio
    const hasSign = value.startsWith('-');
    value = (hasSign ? '-' : '') + value.slice(hasSign ? 1 : 0).replace(/-/g, '');

    // 3) máximo un punto
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts.shift()! + '.' + parts.join('');
    }

    // 4) recorta la parte entera a 2 dígitos
    const abs = (hasSign ? value.slice(1) : value).split('.');
    const intPart = abs[0].slice(0, 2);
    const decPart = abs[1] !== undefined ? '.' + abs[1] : '';
    const sanitized = (hasSign ? '-' : '') + intPart + decPart;

    // 5) si cambió el valor, actualizamos e informamos a Angular
    if (sanitized !== input.value) {
      input.value = sanitized;
      const pos = sanitized.length;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 6) VALIDACIÓN FINAL INMEDIATA
    if (this.finalRegex.test(input.value)) {
      this.renderer.removeClass(input, 'decimal-format-error');
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    const valid = this.finalRegex.test(input.value);
    if (!valid) {
      this.renderer.addClass(input, 'decimal-format-error');
    } else {
      this.renderer.removeClass(input, 'decimal-format-error');
    }
  }
}
