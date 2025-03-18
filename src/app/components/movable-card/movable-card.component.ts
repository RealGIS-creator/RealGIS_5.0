import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-movable-card',
  imports: [CommonModule],
  templateUrl: './movable-card.component.html',
  styleUrl: './movable-card.component.less'
})
export class MovableCardComponent {
  @Input() initialX: number = 100;
  @Input() initialY: number = 90;

  position = { x: this.initialX, y: this.initialY };
  isDragging = false;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(private elRef: ElementRef) {}

  onMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.offsetX = event.clientX - this.position.x;
    this.offsetY = event.clientY - this.position.y;
    this.elRef.nativeElement.style.zIndex = '1001'; 
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) {
      return;
    }
    this.position = {
      x: event.clientX - this.offsetX,
      y: event.clientY - this.offsetY,
    };
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    this.isDragging = false;
    this.elRef.nativeElement.style.zIndex = '1000';
  }
}
