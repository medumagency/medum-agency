import { Directive, ElementRef, Input, OnChanges, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

declare const google: any;

@Directive({
  selector: '[appGoogleChart]'
})
export class GoogleChartDirective implements OnInit, OnChanges {
  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;

  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
  }

  ngOnInit() {
    // this.refreshGraph();
  }

  ngOnChanges() {
    this.refreshGraph();
  }

  refreshGraph() {
    const baseData = [
      ['Województwo', 'Ofert Pracy'],
      ['Dolnośląskie', 0],
      ['Lubelskie', 0],
      ['Łódzkie', 0],
      ['Małopolskie', 0],
      ['Opolskie', 0],
      ['Podkarpackie', 0],
      ['Mazowieckie', 0],
      ['Podlaskie', 0],
      ['Pomorskie', 0],
      ['Śląskie', 0],
      ['Świętokrzyskie', 0],
      ['Warmińsko-mazurskie', 0],
      ['Wielkopolskie', 0],
      ['Zachodniopomorskie', 0],
      ['Kujawsko-pomorskie', 0],
      ['Lubuskie', 0]
    ];
    google.charts.load('current', { packages: ['corechart'], mapsApiKey: environment.googleApiKey });
    this.drawGraph(this.chartOptions, this.chartType, Object.assign(baseData, this.chartData), this._element);
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
