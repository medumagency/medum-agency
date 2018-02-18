import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { AppRoutingModule } from './app-routing.module';

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
    CooperationFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyB7EalOJGDq8V8A-AkmmO_rs4C3oRTEmng'
    }),
    AgmSnazzyInfoWindowModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
