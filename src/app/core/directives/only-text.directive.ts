import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[OnlyText]'
})
export class OnlyTextDirective {

  private readonly letterRegex = /^[a-zA-Z]$/;

  constructor(
    private readonly el: ElementRef<HTMLInputElement>,
    private readonly renderer: Renderer2) { }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const key = event.key;
    if (!this.letterRegex.test(key)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData?.getData('text') || '';
    const filtered = this.filterInput(clipboardData);
    this.insertText(filtered);
  }

  private filterInput(value: string): string {
    const match = value.match(/[a-zA-Z]/);
    return match ? match[0] : '';
  }

  private insertText(text: string): void {
    const input = this.el.nativeElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;
    const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);

    this.renderer.setProperty(input, 'value', newValue);
    const newPosition = start + text.length;
    input.setSelectionRange(newPosition, newPosition);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
}
