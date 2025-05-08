
import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[NoQuotes][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => NoQuotesDirective),
      multi: true
    }
  ]
})
export class NoQuotesDirective implements Validator {
  private ERROR_CLASS = 'quote-block-error';

  constructor(
    private el: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    private renderer: Renderer2
  ) { }

  validate(control: AbstractControl): ValidationErrors | null {
    const val: string = control.value || '';
    return /['"]/.test(val)
      ? { noQuotes: true }
      : null;
  }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    // bloquea comillas
    if (event.data && /['"]/.test(event.data)) {
      event.preventDefault();
      this.renderer.addClass(this.el.nativeElement, this.ERROR_CLASS);
    }
  }

  @HostListener('input')
  onInput() {
    const inputEl = this.el.nativeElement;
    let value: string = inputEl.value;

    // 1) Eliminar comillas
    value = value.replace(/['"]/g, '');

    // 2) Convertir a mayúsculas
    const upper = value.toUpperCase();

    // 3) Si cambió, actualizar el input y re-disparar evento
    if (inputEl.value !== upper) {
      this.renderer.setProperty(inputEl, 'value', upper);
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // 4) Gestionar la clase de error
    if (/['"]/.test(upper)) {
      this.renderer.addClass(inputEl, this.ERROR_CLASS);
    } else {
      this.renderer.removeClass(inputEl, this.ERROR_CLASS);
    }
  }
}
