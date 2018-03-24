import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { isNaN, pick } from 'lodash';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from '../../services/swal-obj.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit, OnDestroy {
  @ViewChild('dialog') private dialogSwal: SwalComponent;

  public jobOffers: IJobOffer[] = [];
  public isLoading = true;
  public isSave = false;
  public step = 0;
  public selectedTab = 0;
  public type = 'polish';

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
  private isEdited = false;
  private $jobOffersSub: Subscription;
  private $counterSub: Subscription;

  constructor(private firestoreDAO: FirestoreDaoService, private swalO: SwalObjService) {
  }

  ngOnInit() {
    this.createForm();
    this.fetchJobOffers();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  resetForms(index, f) {
    if (index === 0) {
      this.clearOffers(f);
    }
    if (index === 0 && this.isEdited) {
      this.isLoading = true;
      this.$jobOffersSub.unsubscribe();
      this.jobOffers = [];
      this.fetchJobOffers();
      this.isEdited = false;
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
        title: this.polishTitle,
        city: this.polishCity,
        region: this.polishRegion,
        country: this.polishCountry,
        text: this.polishText,
      }),
      english: new FormGroup({
        title: this.englishTitle,
        city: this.englishCity,
        region: this.englishRegion,
        country: this.englishCountry,
        text: this.englishText
      }),
      german: new FormGroup({
        title: this.germanTitle,
        city: this.germanCity,
        region: this.germanRegion,
        country: this.germanCountry,
        text: this.germanText
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

  setType(type: 'polish' | 'english' | 'german') {
    this.type = type;
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
      this.isSave = true;

      if (this.offerId) {
        this.firestoreDAO.updateJobOffer(this.offerId, value).then(() => {
          f.resetForm();
          this.offerId = null;
          this.isSave = false;
          this.isEdited = true;
          this.swalO.composeDialog(title, 'Oferta została zaktualizowana pomyślnie', 'success', this.dialogSwal);
        }).catch((error) => {
          this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
          console.error(error);
          this.isSave = false;
        });
      } else {
        this.updateCounter(value, true)
          .then(() => this.firestoreDAO.createJobOffer(value))
          .then(() => {
            f.resetForm();
            this.offerId = null;
            this.isSave = false;
            this.isEdited = true;
            this.swalO.composeDialog(title, 'Utworzono nową ofertę', 'success', this.dialogSwal);
          })
          .catch((error) => {
            this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
            console.log(error);
            this.isSave = false;
          });
      }
    }
  }

  deleteJobOffer(data: IJobOffer): void {
    const text = 'Czy na pewno chcesz usunąć tę ofertę?';
    const title = data.polish.title.length ? data.polish.title.toUpperCase() : 'Brak nazwy';

    this.swalO.composeDialog(title, text, 'warning', this.dialogSwal, true).then((result) => {
      if (result.value) {
        this.updateCounter(data, false)
          .then(() => this.firestoreDAO.deleteJobOffer(data.id))
          .then(() => {
            this.swalO.composeDialog(title, 'Usnięto pomyślnie', 'success', this.dialogSwal);
          })
          .catch((error) => {
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
    this.$jobOffersSub = this.firestoreDAO.getJobOffers().subscribe((result) => {
      this.jobOffers = result;
      this.isLoading = false;
    });
  }

  updateCounter(data: any, add: boolean): Promise<void> {
    if (data.polish.country.toLowerCase() === 'polska') {
      return new Promise((resolve, reject) => {
        this.$counterSub = this.firestoreDAO.getCounters().subscribe(({ payload }) => {
          console.log(payload.data());
          const region = data.polish.region;
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

  unsubscribeAll() {
    this.$jobOffersSub.unsubscribe();
    this.$counterSub.unsubscribe();
  }
}
