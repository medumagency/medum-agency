import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

declare const google: any;

@Directive({
  selector: '[appGoogleChart]'
})
export class GoogleChartDirective implements OnInit {
  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;

  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  ngOnInit() {
    setTimeout(() => {
        google.charts.load('current', { packages: ['corechart'], mapsApiKey: environment.googleApiKey });
        setTimeout(() => {
          this.drawGraph(this.chartOptions, this.chartType, this.chartData, this._element);
        }, 150);
      }, 150
    );
  }

  drawGraph(chartOptions, chartType, chartData, ele) {
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
      const wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable: chartData,
        options: chartOptions || {},
        containerId: ele.id
      });
      wrapper.draw();
    }
  }
}
