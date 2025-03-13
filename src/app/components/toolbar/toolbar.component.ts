import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToolBar } from '../../interfaces/toolbar';
import { ToolbarService } from '../../core/services/toolbar.service';

@Component({
  selector: 'app-toolbar',
  imports: [CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.less',
})
export class ToolbarComponent {
  activeIndex: number | null = null;
  imagesDefault: ToolBar[] = [];

  constructor(private toolbarService: ToolbarService) {}

  ngOnInit() {
    this.getIcons();
  }

  getIcons(): void {
    this.imagesDefault = this.toolbarService.getToolBar();
  }

  onChangeImage(id: number, type: string): void {
    this.activeIndex = this.activeIndex === id ? null : id;

    this.imagesDefault.forEach((element) => {
      element.type = element.type == 'light' ? 'dark' : 'dark';
    });

    this.imagesDefault[id - 1].type = type == 'dark' ? 'light' : 'dark';
  }
}
