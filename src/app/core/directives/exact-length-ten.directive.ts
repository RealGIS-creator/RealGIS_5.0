import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ExactLengthTen]'
})
export class ExactLengthTenDirective {

  private editRegex = /^.{0,10}$/;

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2
  ) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const value = input.value ?? '';
    const start = input.selectionStart ?? 0;   
    const end   = input.selectionEnd   ?? 0;
    const key   = event.key;

    if (key.length > 1) {
      return;
    }

    const next = value.slice(0, start) + key + value.slice(end);

    if (!this.editRegex.test(next)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    const input  = this.el.nativeElement;
    const value  = input.value ?? '';
    const start  = input.selectionStart ?? 0;
    const end    = input.selectionEnd   ?? 0;

    const next = value.slice(0, start) + pasted + value.slice(end);

    if (this.editRegex.test(next)) {
      input.value = next;
      const pos = start + pasted.length;
      input.setSelectionRange(pos, pos);
    }
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    if ((input.value ?? '').length !== 10) {
      this.renderer.setProperty(input, 'value', '');
      this.renderer.addClass(input, 'exact-length-error');
    }
  }

}
