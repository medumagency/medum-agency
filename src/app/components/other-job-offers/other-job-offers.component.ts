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
  public modalData: any;
  public type = 'polish';

  private $typeSub: Subscription;
  private $jobOffersSub: Subscription;

  constructor(private router: Router, private firesotreDAO: FirestoreDaoService, private lang: LanguageService) {
  }

  ngOnInit() {
    this.fetchJobOffers();
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
    });
  }

  fetchJobOffers(): void {
    this.$jobOffersSub = this.firesotreDAO.getJobOffers(false).subscribe((jobs) => {
      console.log(jobs);
      this.jobOffers = jobs.filter((offer) => offer.polish.country.toLowerCase() !== 'polska');
      this.isLoading = false;
    });
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
    this.$jobOffersSub.unsubscribe();
  }

}
