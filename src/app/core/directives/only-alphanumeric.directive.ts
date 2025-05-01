import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[OnlyAlphanumeric]'
})
export class OnlyAlphanumericDirective {
  private readonly charRegex = /^[A-Za-z0-9 ]$/;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  private filterValue(value: string): string {
    return Array.from(value)
      .filter(char => this.charRegex.test(char))
      .join('');
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const filtered = this.filterValue(value);
    if (filtered !== value) {
      this.renderer.setProperty(this.el.nativeElement, 'value', filtered);
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
