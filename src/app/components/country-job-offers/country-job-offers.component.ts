import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';

import { IJobOffer } from '../../interfaces/jobOffer.interface';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { forEach } from 'lodash';

@Component({
  selector: 'app-country-job-offers',
  templateUrl: './country-job-offers.component.html',
  styleUrls: ['./country-job-offers.component.scss']
})
export class CountryJobOffersComponent implements OnInit {

  private theInterval: any;
  public chartData = [
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
  public optionsXSSmall = CountryJobOffersComponent.setOptions(200);
  public optionsSmall = CountryJobOffersComponent.setOptions(325);
  public optionsMedium = CountryJobOffersComponent.setOptions(380);
  public optionsBig = CountryJobOffersComponent.setOptions();
  public isLoading = true;
  public jobOffers: IJobOffer[] = [];
  public modalData: IJobOffer;

  static setOptions(height = 480) {
    return {
      region: 'PL',
      displayMode: 'regions',
      resolution: 'provinces',
      // width: 640,
      height,
      datalessRegionColor: 'transparent',
      colorAxis: {
        colors: ['#bbdc51', '#24c250', '#cc464f']
      },
      // tooltip: {textStyle: {color: '#FF0000'}, showColorCode: true},
    };
  }

  constructor(private router: Router, private firesotreDAO: FirestoreDaoService) {
  }

  ngOnInit() {
    this.setRegionCounters();
    this.clearBorders();
    this.theInterval = setInterval(this.clearBorders, 250);
    this.fetchJobOffers();
  }

  turnCate(str, length) {
    return str.length > length ? `${str.slice(0, length)}...` : str;
  }

  clearBorders() {
    const list = document.getElementsByTagName('path');
    if (list.length) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].getAttribute('fill') === 'none') {
          list[i].setAttribute('stroke-width', '0');
        }
      }
      clearInterval(this.theInterval);
    }
  }

  navigateToForm() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        'firstname': 'Nic',
        'lastname': 'Raboy'
      }
    };
    this.router.navigate(['formularz'], navigationExtras);
  }

  fetchJobOffers() {
    this.firesotreDAO.getJobOffers().subscribe((jobs) => {
      this.jobOffers = jobs;
      this.isLoading = false;
    });
  }

  setModalData(data: IJobOffer): void {
    this.modalData = data;
  }

  setRegionCounters(): void {
    const temp = [['Województwo', 'Ofert Pracy']];
    this.firesotreDAO.getCounters().subscribe(({payload}) => {
      console.log(payload);
      forEach(payload.data(), (val, key) => {
        temp.push([key, val]);
      });
      this.chartData = temp;
    });
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
