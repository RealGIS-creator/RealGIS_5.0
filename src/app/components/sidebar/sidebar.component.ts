import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { SideBar } from '../../interfaces/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.less',
})
export class SidebarComponent {
  activeIndex: number | null = null;
  imagesDefault: SideBar[] = [];

  constructor(
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {
    this.getIcons()
  }

  getIcons(): void {
    this.imagesDefault = this.sidebarService.getSideBar();
  }

  onChangeImage(id: number, type: string): void {
    this.activeIndex = this.activeIndex === id ? null : id;

    this.imagesDefault.forEach((element) => {
      element.type = element.type == 'ligth' ? 'dark' : 'dark';
    });

    this.imagesDefault[id - 1].type = type == 'dark' ? 'ligth' : 'dark';
  }
}
