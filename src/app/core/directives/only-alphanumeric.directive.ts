import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[OnlyAlphanumeric]'
})
export class OnlyAlphanumericDirective {

  private charRegex = /^[A-Za-z0-9]$/;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;

    if (key.length > 1) {
      return;
    }

    if (!this.charRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboard = event.clipboardData?.getData('text') || '';
    const filtered = clipboard
      .split('')
      .filter(c => this.charRegex.test(c))
      .join('');
    const input = this.el.nativeElement;
    const start = input.selectionStart ?? 0;
    const end   = input.selectionEnd   ?? 0;
    const value = input.value   || '';
    input.value = value.slice(0, start) + filtered + value.slice(end);
    const pos = start + filtered.length;
    input.setSelectionRange(pos, pos);
  }
}
