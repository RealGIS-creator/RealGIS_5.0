import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-statistics',
 imports: [CommonModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less'
})
export class StatisticsComponent {
  currentDashboard = 1;

  constructor() {}

  toggleDashboard(num: number) {
    this.currentDashboard = num;
  }
}