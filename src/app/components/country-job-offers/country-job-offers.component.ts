import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-country-job-offers',
  templateUrl: './country-job-offers.component.html',
  styleUrls: ['./country-job-offers.component.scss']
})
export class CountryJobOffersComponent implements OnInit {

  public chartData = [
    ['State', 'Population'],
    ['Malopolska', 199581477],
    ['Maharashtra', 112372972],
    ['Bihar', 103804637],
    ['West Bengal', 91347736],
    ['Madhya Pradesh', 72597565],
    ['Tamil Nadu', 72138958],
    ['Rajasthan', 68621012],
    ['Karnataka', 61130704],
    ['Gujarat', 60383628],
    ['Andhra Pradesh', 49386799],
    ['Odisha', 41947358],
    ['Telangana', 35286757],
    ['Kerala', 33387677],
    ['Jharkhand', 32966238],
    ['Assam', 31169272],
    ['Punjab', 27704236],
    ['Chhattisgarh', 25540196],
    ['Haryana', 25353081],
    ['Jammu and Kashmir', 12548926],
    ['Uttarakhand', 10116752],
    ['Himachal Pradesh', 6856509],
    ['Tripura', 3671032],
    ['Meghalaya', 2964007],
    ['Manipur', 2721756],
    ['Nagaland', 1980602],
    ['Goa', 1457723],
    ['Arunachal Pradesh', 1382611],
    ['Mizoram', 1091014],
    ['Sikkim', 607688],
    ['Delhi', 16753235],
    ['Puducherry', 1244464],
    ['Chandigarh', 1054686],
    ['Andaman and Nicobar Islands', 379944],
    ['Dadra and Nagar Haveli', 342853],
    ['Daman and Diu', 242911],
    ['Lakshadweep', 64429]
  ];
  public chartOptions = {
    region: 'PL',
    displayMode: 'regions',
    resolution: 'provinces',
    width: 640,
    height: 480
  };

  constructor() {
  }

  ngOnInit() {
  }

}
