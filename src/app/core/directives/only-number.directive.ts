import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const char = event.key;
    // Permite Backspace, flechas, Tab, etc.
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
    }
  }
}
