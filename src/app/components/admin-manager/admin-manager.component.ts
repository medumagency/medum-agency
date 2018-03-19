import { Component, OnInit, ViewChild } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { NgForm } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { isNaN, pick } from 'lodash';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from '../../services/swal-obj.service';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public offer: IJobOffer;
  public jobOffers: IJobOffer[] = [];
  public isLoading = true;

  constructor(private firestoreDAO: FirestoreDaoService, private swalO: SwalObjService) {
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
    const title = dataToSave.title.length ? dataToSave.title.toUpperCase() : 'Brak Nazwy';

    if (id) {
      this.firestoreDAO.updateJobOffer(id, dataToSave).then(() => {
        f.resetForm();
        this.swalO.composeDialog(title, 'Oferta została zaktualizowana pomyślnie', 'success', this.dialogSwal);
      }).catch((error) => {
        this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
        console.error(error);
      });
    } else {
      this.firestoreDAO.createJobOffer(dataToSave).then(() => {
        return this.updateCounter(dataToSave, true).then(() => {
          f.resetForm();
          this.swalO.composeDialog(title, 'Utworzono nową ofertę', 'success', this.dialogSwal);
        });
      }).catch((error) => {
        this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
        console.log(error);
      });
    }
  }

  deleteJobOffer(data: IJobOffer): void {
    const text = 'Czy na pewno chcesz usunąć tę ofertę?';
    const title = data.title.length ? data.title.toUpperCase() : 'Brak nazwy';

    this.swalO.composeDialog(title, text, 'warning', this.dialogSwal, true).then((result) => {
      if (result.value) {
        this.firestoreDAO.deleteJobOffer(data.id).then(() => {
          return this.updateCounter(data, false);
        }).then(() => {
          this.swalO.composeDialog(title, 'Usnięto pomyślnie', 'success', this.dialogSwal);
        }).catch((error) => {
          this.swalO.composeDialog(title, 'Nie można usunąc!!!', 'error', this.dialogSwal);
        });
      }
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
        this.firestoreDAO.getCounters().subscribe(({ payload }) => {
          console.log(payload);
          const dataToSave = pick(payload.data(), [data.region, 'total']);
          if (add) {
            dataToSave[data.region] += 1;
            dataToSave['total'] += 1;
          } else {
            dataToSave[data.region] -= 1;
            dataToSave['total'] -= 1;
          }
          if (isNaN(dataToSave[data.region]) || isNaN(dataToSave['total'])) {
            return reject({ wrongRegion: 'Zła nazwa województwa' });
          }
          this.firestoreDAO.updateCounter(dataToSave).then(resolve).catch(reject);
        });
      });
    } else {
      return Promise.resolve();
    }
  }
}
