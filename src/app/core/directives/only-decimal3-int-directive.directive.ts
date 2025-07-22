import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[OnlyDecimal3IntDirective]'
})
export class OnlyDecimal3IntDirectiveDirective {
  private readonly editRegex = /^-?\d{0,3}(?:\.\d*)?$/;
  private readonly finalRegex = /^-?\d{1,3}\.\d{5,}$/;

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2
  ) { }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let value = input.value;

    value = value.replace(/[^0-9.\-]/g, '');

    const hasSign = value.startsWith('-');
    value = (hasSign ? '-' : '') + value.slice(hasSign ? 1 : 0).replace(/-/g, '');

    const parts = value.split('.');
    if (parts.length > 3) {
      value = parts.shift()! + '.' + parts.join('');
    }

    const abs = (hasSign ? value.slice(1) : value).split('.');
    const intPart = abs[0].slice(0, 3);
    const decPart = abs[1] !== undefined ? '.' + abs[1] : '';
    const sanitized = (hasSign ? '-' : '') + intPart + decPart;

    if (sanitized !== input.value) {
      input.value = sanitized;
      const pos = sanitized.length;
      input.setSelectionRange(pos, pos);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const rawDec = abs[1] || '';
    if (this.finalRegex.test(input.value)) {
      this.renderer.removeClass(input, 'decimal-format-error');
    } else {
      if (rawDec.length < 5) {
        this.renderer.addClass(input, 'decimal-format-error');
      } else {
        this.renderer.addClass(input, 'decimal-format-error');
      }
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    if (!this.finalRegex.test(input.value)) {
      this.renderer.addClass(input, 'decimal-format-error');
    } else {
      this.renderer.removeClass(input, 'decimal-format-error');
    }
  }
}
