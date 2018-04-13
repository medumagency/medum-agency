import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { LanguageService } from '../../services/language.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-search-jobs',
  templateUrl: './search-jobs.component.html',
  styleUrls: ['./search-jobs.component.scss']
})
export class SearchJobsComponent implements OnInit, OnDestroy, OnChanges {

  @Input() regionSet: string;

  public config: any;
  public type = 'polish';
  public perPage = [];
  public modalData: any;
  public isChanged = false;

  private $typeSub: Subscription;

  constructor(private lang: LanguageService, private router: Router) {
  }

  ngOnInit() {
    this.config = Object.assign(environment.algolia, this.setFilters());
    this.fetchCurrentLanguage();
  }

  ngOnChanges(changes) {
    const { regionSet } = changes;

    if (this.config) {
      this.isChanged = true;
      this.config.searchParameters.query = regionSet.currentValue;
      setTimeout(() => {
        this.isChanged = false;
      }, 1);
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  setFilters() {
    const isPolandView = (urlPhrase) => location.pathname.includes(urlPhrase);
    const isInCountry = isPolandView('w-kraju') || isPolandView('in-poland') || isPolandView('in-polen');
    const countryFacet = { 'polish.country': ['Polska'] };

    return {
      searchParameters: {
        facets: ['polish.country'],
        facetsRefinements: isInCountry ? countryFacet : {} ,
        query: '',
        facetsExcludes: !isInCountry ? countryFacet : {}
      }
    };
  }

  turnCate(str, length) {
    return str && str.length > length ? `${str.slice(0, length)}...` : str;
  }

  navigateToForm() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        position: this.modalData.title
      }
    };
    this.router.navigate([this.lang.getTranslatedRoute('/formularz')], navigationExtras);
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
