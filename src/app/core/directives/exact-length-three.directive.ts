import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ExactLengthThree]'
})
export class ExactLengthThreeDirective {

 // Durante edición permite de 0 a 3 dígitos
 private editRegex = /^[0-9]{0,3}$/;  
 // En blur exige de 1 a 3 dígitos
 private exactRegex = /^[0-9]{1,3}$/;  

 constructor(
   private el: ElementRef<HTMLInputElement>,
   private renderer: Renderer2
 ) {}

 // Captura cualquier cambio de valor (teclado, pegar, IME…)
 @HostListener('input')
 onInput() {
   const input = this.el.nativeElement;
   // Reemplaza todo lo que NO sea dígito y limita longitud a 3
   let sanitized = input.value.replace(/[^0-9]/g, '').slice(0, 3);
   if (sanitized !== input.value) {
     // Actualiza el valor y reposiciona el cursor
     input.value = sanitized;                                                     
     const pos = sanitized.length;
     input.setSelectionRange(pos, pos);
   }
 }

 @HostListener('blur')
 onBlur() {
   const input = this.el.nativeElement;
   if (!this.exactRegex.test(input.value)) {
     this.renderer.addClass(input, 'exact-length-error');
   } else {
     this.renderer.removeClass(input, 'exact-length-error');
   }
 }
}