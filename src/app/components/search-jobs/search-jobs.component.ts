import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from '../../services/language.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-jobs',
  templateUrl: './search-jobs.component.html',
  styleUrls: ['./search-jobs.component.scss']
})
export class SearchJobsComponent implements OnInit, OnDestroy {

  public config: any;
  public type = 'polish';
  public perPage = [];
  public modalData: any;

  private $typeSub: Subscription;

  constructor(private lang: LanguageService, private router: Router) {
  }

  ngOnInit() {
    this.config = environment.algolia;
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
      this.type = lang;
      this.setPerPage(lang);
    });
  }

  setPerPage(lang) {
    const createArray = (label) => ([
      { value: 5, label: `5 ${label}` },
      { value: 10, label: `10 ${label}`, default: true },
      { value: 15, label: `15 ${label}` },
      { value: 25, label: `25 ${label}` },
      { value: 50, label: `50 ${label}` },
      { value: 100, label: `100 ${label}` }
    ]);

    if (lang === 'polish') {
      this.perPage = createArray('Wyświetlanych ofert');
    } else if (lang === 'english') {
      this.perPage = createArray('Displayed offers');
    } else if (lang === 'german') {
      this.perPage = createArray('Angezeigte Angebote');
    }
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

  unsubscribeAll() {
    this.$typeSub.unsubscribe();
  }
}
