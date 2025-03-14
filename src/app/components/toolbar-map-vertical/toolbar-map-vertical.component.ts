import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarMapVerticalService } from '../../core/services/toolbar-map-vertical.service';
import { ToolBarVertical } from '../../interfaces/toolbar-vertical';

@Component({
  selector: 'app-toolbar-map-vertical',
  imports: [CommonModule, FormsModule],
  templateUrl: './toolbar-map-vertical.component.html',
  styleUrl: './toolbar-map-vertical.component.less',
})
export class ToolbarMapVerticalComponent {
  activeIndex: number | null = null;
  imagesDefault: ToolBarVertical[] = [];

  @Output() zoomChange = new EventEmitter<number>(); 
  @Input() zoomLevel: number = 3; 

  constructor (
    private toolbarMapVerticalService: ToolbarMapVerticalService
  ) 
  {}

  ngOnInit() {
    this.getIcons();
  }

  getIcons(): void {
    this.imagesDefault = this.toolbarMapVerticalService.getToolBarVertical();
  }

  onRangeChange(event: any): void {
    this.zoomLevel = event.target.value;
    this.zoomChange.emit(this.zoomLevel);
  }

  zoomIn(): void {
    if (this.zoomLevel < 23) {
      this.zoomLevel++;
      this.zoomChange.emit(this.zoomLevel);
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0) {
      this.zoomLevel--;
      this.zoomChange.emit(this.zoomLevel);
    }
  }
}
