import { Component, OnInit } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import { pick } from 'lodash';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import {isNan} from 'lodash';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit {

  public offer: IJobOffer;
  public jobOffers: IJobOffer[] = [];
  public isLoading = true;

  constructor(private firestoreDAO: FirestoreDaoService) {
  }

  ngOnInit() {
    this.fetchJobOffers();
  }

  createOffer(data?: Object): IJobOffer {
    const basic = {
      title: '',
      polish: '',
      english: '',
      germany: '',
      country: '',
      region: '',
      city: '',
      date: data ? Date.now() : 0
    };
    return Object.assign(basic, data);
  }

  saveOffer(f: NgForm): void {
    const id: string = this.offer.id;
    const dataToSave: IJobOffer = this.createOffer(f.value);
    if (id) {
      this.firestoreDAO.updateJobOffer(id, dataToSave).then(() => {
        f.resetForm();
      }).catch((error) => {
        console.log(error);
      });
    } else {
      this.firestoreDAO.createJobOffer(dataToSave).then(() => {
        return this.updateCounter(dataToSave, true).then(() => {
          f.resetForm();
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  deleteJobOffer(data: IJobOffer): void {
    this.firestoreDAO.deleteJobOffer(data.id).then(() => {
      return this.updateCounter(data, false);
    }).then(() => {
        console.log('DELETED');
    }).catch((error) => {
      console.log('unable to delete! ', error);
    });
  }

  setData(data?: IJobOffer): void {
    this.offer = this.createOffer(data);
  }

  fetchJobOffers(): void {
    this.firestoreDAO.getJobOffers().subscribe((result) => {
      this.jobOffers = result;
      this.isLoading = false;
    });
  }

  updateCounter(data: any, add: boolean): Promise<void> {
    if (data.country.toLowerCase() === 'polska') {
      return new Promise((resolve, reject) => {
        this.firestoreDAO.getCounters().subscribe(({payload}) => {
          const dataToSave = pick(payload.data(), [data.region, 'total']);
          if (add) {
            dataToSave[data.region] += 1;
            dataToSave.total += 1;
          } else {
            dataToSave[data.region] -= 1;
            dataToSave.total -= 1;
          }
          if (isNaN(dataToSave[data.region]) || isNaN(dataToSave.total)) {
            return reject({wrongRegion: 'Zła nazwa województwa'});
          }
          this.firestoreDAO.updateCounter(dataToSave).then(resolve).catch(reject);
        });
      });
    } else {
      return Promise.resolve();
    }
  }
}
