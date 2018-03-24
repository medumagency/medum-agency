import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';

import { AppRoutingModule } from './app-routing.module';

import { FirestoreDaoService } from './services/dao/firestore-dao.service';

import { AppComponent } from './app.component';
import { NavbarHeadingComponent } from './components/navbar-heading/navbar-heading.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { BootomFooterComponent } from './components/bootom-footer/bootom-footer.component';
import { BannerComponent } from './components/banner/banner.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { CustomCircleDirective } from './directives/custom-circle.directive';
import { JobFormComponent } from './components/job-form/job-form.component';
import { CooperationFormComponent } from './components/cooperation-form/cooperation-form.component';
import { CountryJobOffersComponent } from './components/country-job-offers/country-job-offers.component';
import { OtherJobOffersComponent } from './components/other-job-offers/other-job-offers.component';
import { GoogleChartDirective } from './directives/google-chart.directive';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AdminManagerComponent } from './components/admin-manager/admin-manager.component';
import { HoverImageDirective } from './directives/hover-image.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgPipesModule } from 'ng-pipes';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from './services/swal-obj.service';
import { CompanyEmailService } from './services/company-email.service';
import { MaterialModule } from './material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageService } from './services/language.service';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarHeadingComponent,
    MainContentComponent,
    BootomFooterComponent,
    BannerComponent,
    AboutComponent,
    ContactComponent,
    CustomCircleDirective,
    JobFormComponent,
    CooperationFormComponent,
    CountryJobOffersComponent,
    OtherJobOffersComponent,
    GoogleChartDirective,
    SpinnerComponent,
    AdminManagerComponent,
    HoverImageDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
    }),
    AgmSnazzyInfoWindowModule,
    AngularFireModule.initializeApp(environment.firebase, 'Medumcompany'),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    MomentModule,
    HttpClientModule,
    NgPipesModule,
    SweetAlert2Module.forRoot(),
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [FirestoreDaoService, AuthService, AdminGuardGuard, SwalObjService, CompanyEmailService, LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
