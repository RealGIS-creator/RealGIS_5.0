import { Component } from '@angular/core';
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
  rangeValue: number = 12;

  constructor(private toolbarMapVerticalService: ToolbarMapVerticalService) {}

  ngOnInit() {
    this.getIcons();
  }

  getIcons(): void {
    this.imagesDefault = this.toolbarMapVerticalService.getToolBarVertical();
  }

  onRangeChange(): void {
    console.log("Valor del rango:", this.rangeValue);
  }
}
