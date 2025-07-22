import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ExactLengthThree]'
})
export class ExactLengthThreeDirective {

  private readonly editRegex = /^[0-9]{0,3}$/;
  private readonly exactRegex = /^[0-9]{1,3}$/;

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2
  ) { }

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let sanitized = input.value.replace(/[^0-9]/g, '').slice(0, 3);
    if (sanitized !== input.value) {
      input.value = sanitized;
      const pos = sanitized.length;
      input.setSelectionRange(pos, pos);
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