import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LocalizeRouterService } from 'localize-router';

@Injectable()
export class LanguageService {
  private defaultLang = 'pl';
  private currentLanguage = new BehaviorSubject(this.getLangFromStorage() || 'polish');

  constructor(private translate: TranslateService, private routeTranslate: LocalizeRouterService) {
    const language = this.getLanguage() || this.defaultLang;
    translate.setDefaultLang(language);
  }

  public switchLanguage(language: 'pl' | 'en' | 'de') {
    this.setLanguage(language);
    this.translate.use(language);
    this.routeTranslate.changeLanguage(language);
  }

  private mapLanguage(language: string) {
    const data = {
      pl: 'polish',
      en: 'english',
      de: 'german',
      polish: 'pl',
      english: 'en',
      german: 'de'
    };
    return data[language];
  }

  getLanguage() {
    return this.mapLanguage(this.getLangFromStorage());
  }

  getRawLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  getTranslatedRoute(route: string) {
    return this.routeTranslate.translateRoute(route);
  }

  private getLangFromStorage(): string {
    return localStorage.getItem('lang');
  }

  private setLanguage(language: string) {
    localStorage.setItem('lang', this.mapLanguage(language));
    this.currentLanguage.next(localStorage.getItem('lang'));
  }

}
