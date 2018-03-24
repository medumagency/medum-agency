import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';

import { IJobOffer } from '../../interfaces/jobOffer.interface';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { forEach, defer } from 'lodash';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-country-job-offers',
  templateUrl: './country-job-offers.component.html',
  styleUrls: ['./country-job-offers.component.scss']
})
export class CountryJobOffersComponent implements OnInit, OnDestroy {

  public chartData: Array<Array<string>>;
  public optionsXSSmall = CountryJobOffersComponent.setOptions(200);
  public optionsSmall = CountryJobOffersComponent.setOptions(325);
  public optionsBig = CountryJobOffersComponent.setOptions();
  public isLoading = true;
  public jobOffers: IJobOffer[] = [];
  public modalData: any;
  public type = 'polish';

  private $typeSub: Subscription;
  private $jobOffersSub: Subscription;
  private $countersSub: Subscription;

  static setOptions(height = 380) {
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

  constructor(private router: Router, private firesotreDAO: FirestoreDaoService, private lang: LanguageService) {
  }

  ngOnInit() {
    this.setRegionCounters();
    this.fetchJobOffers();
    this.fetchCurrentLanguage();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  turnCate(str, length) {
    return str && str.length > length ? `${str.slice(0, length)}...` : str;
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

  fetchCurrentLanguage() {
    this.$typeSub = this.lang.getRawLanguage().subscribe((lang) => {
      this.isLoading = true;
      this.type = lang;
      this.setRegionCounters();
    });
  }

  fetchJobOffers(): void {
    this.$jobOffersSub = this.firesotreDAO.getJobOffers(true).subscribe((jobs) => {
      this.jobOffers = jobs;
    });
  }

  setModalData(offer: any): void {
    const data = offer[this.type];
    const date = offer.date;

    this.modalData = {
      title: data.title,
      region: data.region,
      country: data.country,
      city: data.city,
      date,
      text: data.text,
    };
  }

  setRegionCounters(): void {
    const temp = [];
    if (this.type === 'polish') {
      temp.push(['Województwo', 'Ofert Pracy']);
    } else if (this.type === 'english') {
      temp.push(['Region', 'Job Offers']);
    } else if (this.type === 'german') {
      temp.push(['Region', 'Jobangebote']);
    }
    this.$countersSub = this.firesotreDAO.getCounters().subscribe(({ payload }) => {
      forEach(payload.data(), (val, key) => {
        temp.push([key, val]);
      });
      this.chartData = temp;
      this.isLoading = false;
    });
  }

  unsubscribeAll() {
    this.$typeSub.unsubscribe();
    this.$jobOffersSub.unsubscribe();
    this.$countersSub.unsubscribe();
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
