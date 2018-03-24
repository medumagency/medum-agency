import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { LanguageService } from '../../services/language.service';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { Subscription } from 'rxjs/Subscription';
import { forEach } from 'lodash';

@Component({
  selector: 'app-other-job-offers',
  templateUrl: './other-job-offers.component.html',
  styleUrls: ['./other-job-offers.component.scss']
})
export class OtherJobOffersComponent implements OnInit, OnDestroy {

  public isLoading = true;
  public jobOffers: IJobOffer[] = [];
  public type = 'polish';

  private $typeSub: Subscription;

  constructor(private router: Router, private firesotreDAO: FirestoreDaoService, private lang: LanguageService) {
  }

  ngOnInit() {
    this.fetchCurrentLanguage();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  fetchCurrentLanguage() {
    this.$typeSub = this.lang.getRawLanguage().subscribe((lang) => {
      this.isLoading = true;
      setTimeout(() => {
        this.type = lang;
        this.isLoading = false;
      }, 10);
    });
  }

  unsubscribeAll() {
    this.$typeSub.unsubscribe();
  }

}
