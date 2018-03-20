import { Component, OnInit, ViewChild } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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

  public jobOffers: IJobOffer[] = [];
  public isLoading = true;
  public step = 0;
  public selectedTab = 0;

  public offerForm: FormGroup;
  public polishTitle: FormControl;
  public polishCity: FormControl;
  public polishRegion: FormControl;
  public polishCountry: FormControl;
  public polishText: FormControl;
  public englishTitle: FormControl;
  public englishCity: FormControl;
  public englishRegion: FormControl;
  public englishCountry: FormControl;
  public englishText: FormControl;
  public germanTitle: FormControl;
  public germanCity: FormControl;
  public germanRegion: FormControl;
  public germanCountry: FormControl;
  public germanText: FormControl;
  public date: FormControl;

  private offerId: string;

  constructor(private firestoreDAO: FirestoreDaoService, private swalO: SwalObjService) {
  }

  ngOnInit() {
    this.createForm();
    this.fetchJobOffers();
  }
  resetForms(index, f) {
    if (index === 0) {
      this.clearOffers(f);
    }
  }

  createControls() {
    this.polishTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.polishCity = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.polishRegion = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.polishCountry = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.polishText = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.englishTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.englishCity = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.englishRegion = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.englishCountry = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.englishText = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.germanTitle = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.germanCity = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.germanRegion = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.germanCountry = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.germanText = new FormControl('', [Validators.required, Validators.minLength(3)]);
    this.date = new FormControl(0);
  }

  createForm() {
    this.createControls();

    this.offerForm = new FormGroup({
      polish: new FormGroup({
        polishTitle: this.polishTitle,
        polishCity: this.polishCity,
        polishRegion: this.polishRegion,
        polishCountry: this.polishCountry,
        polishText: this.polishText,
      }),
      english: new FormGroup({
        englishTitle: this.englishTitle,
        englishCity: this.englishCity,
        englishRegion: this.englishRegion,
        englishCountry: this.englishCountry,
        englishText: this.englishText
      }),
      german: new FormGroup({
        germanTitle: this.germanTitle,
        germanCity: this.germanCity,
        germanRegion: this.germanRegion,
        germanCountry: this.germanCountry,
        germanText: this.germanText
      }),
      date: this.date
    });
  }

  errorMsg(property) {
    const required = property.errors.minlength.requiredLength;
    const actual = property.errors.minlength.actualLength;
    return `Password must be ${required} characters long, we need another
     ${required - actual} characters `;
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  saveOffer(f: NgForm): void {
    console.log(this.offerForm);
    this.offerForm.patchValue({ date: Date.now() });
    const { value, valid } = this.offerForm;
    const title = this.offerForm.value.polish.polishTitle;

    if (valid) {
      if (this.offerId) {
        this.firestoreDAO.updateJobOffer(this.offerId, value).then(() => {
          this.offerId = null;
          f.resetForm();
          this.swalO.composeDialog(title, 'Oferta została zaktualizowana pomyślnie', 'success', this.dialogSwal);
        }).catch((error) => {
          this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
          console.error(error);
        });
      } else {
        this.firestoreDAO.createJobOffer(value).then(() => {
          return this.updateCounter(value, true).then(() => {
            this.offerId = null;
            f.resetForm();
            this.swalO.composeDialog(title, 'Utworzono nową ofertę', 'success', this.dialogSwal);
          });
        }).catch((error) => {
          this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
          console.log(error);
        });
      }
    }
  }

  deleteJobOffer(data: IJobOffer): void {
    const text = 'Czy na pewno chcesz usunąć tę ofertę?';
    const title = data.polish.polishTitle.length ? data.polish.polishTitle.toUpperCase() : 'Brak nazwy';

    this.swalO.composeDialog(title, text, 'warning', this.dialogSwal, true).then((result) => {
      if (result.value) {
        this.firestoreDAO.deleteJobOffer(data.id).then(() => {
          return this.updateCounter(data, false);
        }).then(() => {
          this.swalO.composeDialog(title, 'Usnięto pomyślnie', 'success', this.dialogSwal);
        }).catch((error) => {
          this.swalO.composeDialog(title, 'Nie można usunąc!!!', 'error', this.dialogSwal);
          console.error(error);
        });
      }
    });
  }

  setData(data?: IJobOffer): void {
    this.offerId = data.id;
    this.offerForm.patchValue(data);
  }

  clearOffers(f: NgForm) {
    f.resetForm();
    this.offerId = null;
  }

  fetchJobOffers(): void {
    this.firestoreDAO.getJobOffers().subscribe((result) => {
      this.jobOffers = result;
      this.isLoading = false;
    });
  }

  updateCounter(data: any, add: boolean): Promise<void> {
    if (data.polish.polishCountry.toLowerCase() === 'polska') {
      return new Promise((resolve, reject) => {
        this.firestoreDAO.getCounters().subscribe(({ payload }) => {
          console.log(payload.data());
          const region = data.polish.polishRegion;
          const dataToSave = pick(payload.data(), [region, 'total']);
          if (add) {
            dataToSave[region] += 1;
            dataToSave['total'] += 1;
          } else {
            dataToSave[region] -= 1;
            dataToSave['total'] -= 1;
          }
          if (isNaN(dataToSave[region]) || isNaN(dataToSave['total'])) {
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
