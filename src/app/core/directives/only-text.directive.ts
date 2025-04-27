import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[OnlyText]'
})
export class OnlyTextDirective {

  private regex: RegExp = /^[a-zA-Z]$/; 

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const char = event.key;
    if (!this.regex.test(char)) {
      event.preventDefault();  
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') || '';
    const filtered = pasted.split('')
                           .filter(c => this.regex.test(c))
                           .join('');
    const input = this.el.nativeElement;
    const start = input.selectionStart || 0;
    const end   = input.selectionEnd   || 0;
    const current = input.value;
    input.value = current.slice(0, start)
                 + filtered
                 + current.slice(end);
    // opcional: mover cursor al final del texto pegado
    const pos = start + filtered.length;
    input.setSelectionRange(pos, pos);
  }
}
