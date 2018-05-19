import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { LanguageService } from '../../services/language.service';
import { Subscription } from 'rxjs/Subscription';
import { forEach } from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';


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
  public type = 'polish';
  public searchRegion = '';

  private $typeSub: Subscription;
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
        colors: ['#ffffff', '#70b5dc', '#2d66dc' ]
      },
      // tooltip: {textStyle: {color: '#FF0000'}, showColorCode: true},
    };
  }

  constructor(private router: Router, private firesotreDAO: FirestoreDaoService, private lang: LanguageService) {
  }

  ngOnInit() {
    this.setRegionCounters();
    this.fetchCurrentLanguage();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  setRegionSearch(region) {
    this.searchRegion = region;
  }

  fetchCurrentLanguage() {
    this.$typeSub = this.lang.getRawLanguage().subscribe((lang) => {
      this.isLoading = true;
      this.type = lang;
      this.setRegionCounters();
    });
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
