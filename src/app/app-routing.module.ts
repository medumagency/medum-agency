import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainContentComponent } from './components/main-content/main-content.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { CooperationFormComponent } from './components/cooperation-form/cooperation-form.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { CountryJobOffersComponent } from './components/country-job-offers/country-job-offers.component';
import { OtherJobOffersComponent } from './components/other-job-offers/other-job-offers.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { LocalizeParser, LocalizeRouterModule, LocalizeRouterSettings, ManualParserLoader } from 'localize-router';
import { TranslateService } from '@ngx-translate/core';
import {Location} from '@angular/common';


export function ManualLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings) {
  return new ManualParserLoader(translate, location, settings, ['pl', 'en', 'de']);
}

const routes: Routes = [
  {
    path: '',
    component: MainContentComponent
  },
  {
    path: 'o-nas',
    component: AboutComponent
  },
  {
    path: 'kontakt',
    component: ContactComponent
  },
  {
    path: 'formularz',
    component: JobFormComponent,
    children: [
      {
        path: ':data',
        component: JobFormComponent,
      }
    ]
  },
  {
    path: 'wspolpraca',
    component: CooperationFormComponent
  },
  {
    path: 'w-kraju',
    component: CountryJobOffersComponent
  },
  {
    path: 'za-granica',
    component: OtherJobOffersComponent
  },
  {
    path: 'admin',
    component: AdminManagerComponent,
    canActivate: [AdminGuardGuard]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    LocalizeRouterModule.forRoot(routes, {
      alwaysSetPrefix: false,
      parser: {
        provide: LocalizeParser,
        useFactory: ManualLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings]
      }
    }),
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule, LocalizeRouterModule]
})
export class AppRoutingModule {
}
