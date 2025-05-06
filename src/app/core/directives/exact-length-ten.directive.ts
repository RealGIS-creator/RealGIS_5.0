import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ExactLengthTen]'
})
export class ExactLengthTenDirective {

  private exactRegex = /^[0-9]{7,10}$/;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let sanitized = input.value.replace(/[^0-9]/g, '').slice(0, 10);

    if (sanitized !== input.value) {
      input.value = sanitized;
      input.setSelectionRange(sanitized.length, sanitized.length);
    }

    if (sanitized.length > 0 && sanitized.length < 7) {
      this.renderer.addClass(input, 'exact-length-error');
    } else {
      this.renderer.removeClass(input, 'exact-length-error');
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    if (!this.exactRegex.test(input.value)) {
      this.renderer.addClass(input, 'exact-length-error');
    } else {
      this.renderer.removeClass(input, 'exact-length-error');
    }
  }
}
