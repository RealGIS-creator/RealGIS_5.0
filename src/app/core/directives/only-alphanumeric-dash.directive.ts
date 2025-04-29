import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyAlphanumericDash]'
})
export class OnlyAlphanumericDashDirective {

  private regex = /^[A-Za-z0-9-]*$/; 

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const input = this.el.nativeElement;
    const value = input.value ?? '';
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (event.key.length > 1) {
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
    const input = this.el.nativeElement;
    const value = input.value ?? '';
    const pasted = event.clipboardData?.getData('text') ?? '';
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if ((value + pasted).split('.').length > 2) {
      return;
    }

    const next = value.slice(0, start) + pasted + value.slice(end);
    if (this.regex.test(next)) {
      input.value = next;
      input.setSelectionRange(start + pasted.length, start + pasted.length);
    }
  }

}
