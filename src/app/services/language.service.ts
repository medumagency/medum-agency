import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LanguageService {
  private defaultLang = 'pl';
  private currentLanguage = new BehaviorSubject(this.getLangFromStorage() || 'polish');

  constructor(private translate: TranslateService) {
    const language = this.getLanguage() || this.defaultLang;
    translate.setDefaultLang(language);
  }

  public switchLanguage(language: 'pl' | 'en' | 'de') {
    this.setLanguage(language);
    this.translate.use(language);
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
    return this.mapLanguage(localStorage.getItem('lang'));
  }

  getRawLanguage(): Observable<string> {
    return this.currentLanguage.asObservable();
  }

  private getLangFromStorage(): string {
    return localStorage.getItem('lang');
  }

  private setLanguage(language: string) {
    localStorage.setItem('lang', this.mapLanguage(language));
    this.currentLanguage.next(localStorage.getItem('lang'));
  }

}
