import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-country-job-offers',
  templateUrl: './country-job-offers.component.html',
  styleUrls: ['./country-job-offers.component.scss']
})
export class CountryJobOffersComponent implements OnInit {

  public chartData = [
    ['Województwo', 'Ofert Pracy'],
    ['Dolnośląskie', 1],
    ['Lubelskie', 1],
    ['Łódzkie', 2],
    ['Małopolskie', 0],
    ['Opolskie', 23],
    ['Podkarpackie', 11],
    ['Mazowieckie', 6],
    ['Podlaskie', 9],
    ['Pomorskie', 11],
    ['Śląskie', 15],
    ['Świętokrzyskie', 8],
    ['Warmińsko-mazurskie', 50],
    ['Wielkopolskie', 0],
    ['Zachodniopomorskie', 2],
    ['Kujawsko-pomorskie', 0],
    ['Lubuskie', 0],
  ];
  public optionsXSSmall = CountryJobOffersComponent.setOptions(200);
  public optionsSmall = CountryJobOffersComponent.setOptions(325);
  public optionsMedium = CountryJobOffersComponent.setOptions(380);
  public optionsBig = CountryJobOffersComponent.setOptions();

  static setOptions(height = 480) {
    return {
      region: 'PL',
      displayMode: 'regions',
      resolution: 'provinces',
      // width: 640,
      height,
      datalessRegionColor: '#9b9b9b',
      colorAxis: {
        colors: ['#666666', '#25e051', '#d9ff5e', '#ff7525', '#cc151d']
      },
      tooltip: { textStyle: { color: '#FF0000' }, showColorCode: true },
    };
  }

  constructor() {
  }

  ngOnInit() {
  }
}

// PL-LB	Lubuskie	Lubusz
// PL-LD	Łódzkie	Łódź
// PL-MA	Małopolskie	Lesser Poland
// PL-MZ	Mazowieckie	Mazovia
// PL-OP	Opolskie	Opole (Upper Silesia)
// PL-PK	Podkarpackie	Subcarpathia
// PL-PD	Podlaskie	Podlaskie
// PL-PM	Pomorskie	Pomerania
// PL-SL	Śląskie	Silesia
// PL-SK	Świętokrzyskie	Holy Cross
// PL-WN	Warmińsko-mazurskie	Warmia-Masuria
// PL-WP	Wielkopolskie	Greater Poland
// PL-ZP	Zachodniopomorskie	West Pomerania
