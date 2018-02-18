import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainContentComponent } from './components/main-content/main-content.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { CooperationFormComponent } from './components/cooperation-form/cooperation-form.component';
import { JobFormComponent } from './components/job-form/job-form.component';

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
    component: JobFormComponent
  },
  {
    path: 'wspolpraca',
    component: CooperationFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
