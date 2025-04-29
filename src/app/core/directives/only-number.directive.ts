import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumberDirective {

  private regex = /^[0-9]*$/;  // :contentReference[oaicite:1]{index=1}

  constructor(private el: ElementRef<HTMLInputElement>) {}

  /** Captura cada tecla antes de mostrarla */
  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    const key = event.key;
    const input = this.el.nativeElement;
    const value = input.value ?? '';                          // fallback string :contentReference[oaicite:2]{index=2}
    const start = input.selectionStart ?? 0;                  // fallback a 0 :contentReference[oaicite:3]{index=3}
    const end   = input.selectionEnd   ?? 0;
    
    // Permitir teclas de control (Backspace, flechas, Tab…)
    if (key.length > 1) {
      return;
    }

    // Construye el valor futuro si se insertara esta tecla
    const next = value.slice(0, start) + key + value.slice(end);

    // Si no cumple la regex, bloquea
    if (!this.regex.test(next)) {
      event.preventDefault();
    }
  }

  /** Filtra el texto pegado */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') ?? '';
    const input = this.el.nativeElement;
    const value = input.value ?? '';
    const start = input.selectionStart ?? 0;
    const end   = input.selectionEnd   ?? 0;

    // Solo inserta si todo el texto es dígitos
    if (this.regex.test(clipboardData)) {
      const next = value.slice(0, start) + clipboardData + value.slice(end);
      input.value = next;
      const pos = start + clipboardData.length;
      input.setSelectionRange(pos, pos);  // parámetros son siempre number :contentReference[oaicite:4]{index=4}
    }
  }
}
