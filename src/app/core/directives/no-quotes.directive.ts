import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[NoQuotes]'
})
export class NoQuotesDirective {

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    if (key === '"' || key === "'") {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') ?? '';
    const sanitizedText = pastedText.replace(/['"]/g, '');
    const input = this.el.nativeElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    const currentValue = input.value ?? '';
    const newValue = currentValue.slice(0, start) + sanitizedText + currentValue.slice(end);
    input.value = newValue;
    const cursorPosition = start + sanitizedText.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
  }
}
