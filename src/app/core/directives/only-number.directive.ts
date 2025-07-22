import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {

  private readonly digitRegex = /^[0-9]*$/;

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2
  ) {}

  private filterToDigits(value: string): string {
    return Array.from(value)
      .filter(char => /\d/.test(char))
      .join('');
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const filtered = this.filterToDigits(value);
    if (filtered !== value) {
      this.renderer.setProperty(this.el.nativeElement, 'value', filtered);
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
