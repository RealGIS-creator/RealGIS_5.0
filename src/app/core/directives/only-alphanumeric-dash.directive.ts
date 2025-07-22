import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[OnlyAlphanumericDash]'
})
export class OnlyAlphanumericDashDirective {

  private readonly allowedRegex = /^[A-Za-z0-9-]*$/;

  constructor(private readonly el: ElementRef<HTMLInputElement>, private readonly renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = this.el.nativeElement;
    const originalValue = input.value;
    const filteredValue = originalValue.replace(/[^A-Za-z0-9-]/g, '');

    if (originalValue !== filteredValue) {
      this.renderer.setProperty(input, 'value', filteredValue);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
