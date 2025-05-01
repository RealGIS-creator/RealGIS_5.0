import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: 'input[OnlyDecimalComma]'
})
export class OnlyDecimalCommaDirective {
  private readonly FOCUS_MSG = 'Recuerda: puedes usar una sola coma (,) como separador decimal';

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
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
    let v = Array.from(value).filter(c => /\d|,/.test(c)).join('');
    const parts = v.split(',');
    if (parts.length > 1) {
      v = parts.shift()! + ',' + parts.join('');
    }
    return v;
  }
}
