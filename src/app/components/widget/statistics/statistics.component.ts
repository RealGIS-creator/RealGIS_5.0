import { Component, ViewChild, ChangeDetectorRef, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { MapService } from '../../../core/services/home/map/map.service';

@Component({
  standalone: true,
  selector: 'app-statistics',
  imports: [BaseChartDirective],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.less'
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @ViewChildren(BaseChartDirective) private charts!: QueryList<BaseChartDirective>;
  private sub!: Subscription;

  public pieData!: ChartConfiguration<'pie'>['data'];
  public doughnutData!: ChartConfiguration<'doughnut'>['data'];
  public barData!: ChartConfiguration<'bar'>['data'];
  public lineData!: ChartConfiguration<'line'>['data'];

  public pieOptions: ChartOptions<'pie'> = { responsive: true };
  public doughnutOptions: ChartOptions<'doughnut'> = { responsive: true,  cutout: '50%' };
  public barOptions: ChartOptions<'bar'> = {
    responsive: true, scales: { y: { beginAtZero: true } }
  };
  public lineOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: { x: { display: true }, y: { beginAtZero: true } }
  };

  constructor(
    private mapService: MapService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sub = this.mapService.selectedGeoJson$.subscribe(collection => {
      const features = Array.isArray(collection) ? collection : collection.features;
      const counts: Record<string, number> = {};
      features.forEach(f => {
        const code = f.properties?.TipoDireccionCod ?? 'unknown';
        counts[code] = (counts[code] || 0) + 1;
      });

      const labels = Object.keys(counts);
      const values = Object.values(counts);

      // Actualiza y personaliza cada dataset
      this.pieData = {
        labels,
        datasets: [{
          data: values,
          label: 'Tipos de Dirección',
          backgroundColor: [ '#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800' ],
          hoverOffset: 10
        }]
      };

      this.doughnutData = {
        labels,
        datasets: [{
          data: values,
          label: 'Tipos de Dirección',
          backgroundColor: [ '#E91E63', '#03A9F4', '#FFC107', '#4CAF50', '#FF5722' ],
        }]
      };

      this.barData = {
        labels,
        datasets: [{
          data: values,
          label: 'Tipos de Dirección',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }]
      };

      this.lineData = {
        labels,
        datasets: [{
          data: values,
          label: 'Tendencia',
          fill: false,
          tension: 0.4,
          borderColor: '#FF6384',
          pointBackgroundColor: '#FFF'
        }]
      };

      this.cd.detectChanges();
      this.charts.forEach(c => c.update());
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}