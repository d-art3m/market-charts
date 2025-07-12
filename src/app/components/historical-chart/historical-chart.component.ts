import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-historical-chart',
  imports: [NgChartsModule, NgIf],
  templateUrl: './historical-chart.component.html',
  styleUrls: ['./historical-chart.component.scss']
})
export class HistoricalChartComponent implements OnChanges {
  @Input() instrument: any;
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Price',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
    }]
  };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: { display: true },
      y: { display: true, grid: { color: '#eee' } }
    }
  };

  constructor(private dataService: DataService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['instrument'] && this.instrument && this.instrument.id) {
      this.loadHistorical();
    }
  }

  loadHistorical() {
    this.dataService.getHistoricalBars(this.instrument.id, 50).subscribe(res => {
      const bars = res.bars || res.data || [];
      this.chartData = {
        labels: bars.map((bar: any) => {
          if (!bar.t) return '';
          const date = new Date(bar.t);
          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }),
        datasets: [{
          data: bars.map((bar: any) => bar.c || 0),
          label: 'Price',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        }]
      };
    });
  }
} 