import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[EmailFormat]'
})
export class EmailFormatDirective {

  private allowedCharsRegex = /[^a-zA-Z0-9@._%+\-]/g;
  private emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    // Elimina caracteres no permitidos
    let sanitized = input.value.replace(this.allowedCharsRegex, '');
    if (sanitized !== input.value) {
      input.value = sanitized;
      // Reposiciona el cursor al final
      const pos = sanitized.length;
      input.setSelectionRange(pos, pos);
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    if (!this.emailRegex.test(input.value)) {
      this.renderer.addClass(input, 'email-format-error');
    } else {
      this.renderer.removeClass(input, 'email-format-error');
    }
  }
}
