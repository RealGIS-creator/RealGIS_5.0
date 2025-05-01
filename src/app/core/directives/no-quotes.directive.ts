
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
    if (event.data && /['"]/.test(event.data)) {
      event.preventDefault();
      this.renderer.addClass(this.el.nativeElement, this.ERROR_CLASS);
    }
  }

  @HostListener('input')
  onInput() {
    const inputEl = this.el.nativeElement;
    const original = inputEl.value;
    const sanitized = original.replace(/['"]/g, '');
    if (original !== sanitized) {
      this.renderer.setProperty(inputEl, 'value', sanitized);
      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      this.renderer.addClass(inputEl, this.ERROR_CLASS);
    } else {
      this.renderer.removeClass(inputEl, this.ERROR_CLASS);
    }
  }
}
