import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[OnlyDecimal2IntDirective]'
})
export class OnlyDecimal2IntDirectiveDirective {

  private regex = /^-?\d{1,2}(\.\d*)?$/;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const value = input.value ?? '';
    const start = input.selectionStart ?? 0;
    const end   = input.selectionEnd   ?? 0;

    if (event.key.length > 1 && event.key !== '.' && event.key !== '-') {
      return;
    }
    if (event.key === '.' && value.includes('.')) {
      event.preventDefault();
      return;
    }

    const next = value.slice(0, start) + event.key + value.slice(end);
    if (!this.regex.test(next)) {
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

    if ((value + pasted).split('.').length > 2) {
      return;
    }

    const next = value.slice(0, start) + pasted + value.slice(end);
    if (this.regex.test(next)) {
      input.value = next;
      const pos = start + pasted.length;
      input.setSelectionRange(pos, pos);
    }
  }
}
