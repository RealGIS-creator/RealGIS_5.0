import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[EmailFormat]'
})
export class EmailFormatDirective {

  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key   = event.key;
    const input = this.el.nativeElement;
    const value = input.value ?? '';                                   
    const start = input.selectionStart ?? 0;                           
    const end   = input.selectionEnd   ?? 0;

    if (key.length > 1) {
      return;
    }

    const next = value.slice(0, start) + key + value.slice(end);

    if (next.includes('@') && next.includes('.') && !this.emailRegex.test(next)) {
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

    if (this.emailRegex.test(next)) {
      input.value = next;
      const pos = start + pasted.length;
      input.setSelectionRange(pos, pos);
    }
  }
}
