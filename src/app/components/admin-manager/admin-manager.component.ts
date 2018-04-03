import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IJobOffer } from '../../interfaces/jobOffer.interface';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { FirestoreDaoService } from '../../services/dao/firestore-dao.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import { isNaN, pick, cloneDeep } from 'lodash';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { SwalObjService } from '../../services/swal-obj.service';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../environments/environment';

const countriesLink = environment.countryNames;
const polandLink = environment.polandCountry;

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
  public selectedTabCountry = 0;
  public type = 'polish';
  public offerForm: FormGroup;
  public _countries: any;
  public _regions: any;
  public _poland: any;
  public _cities: any;

  private offerId: string;
  private editClone: IJobOffer = null;
  private isEdited = false;
  private $jobOffersSub: Subscription;
  private $counterSub: Subscription;

  constructor(private firestoreDAO: FirestoreDaoService, private swalO: SwalObjService) {
  }

  ngOnInit() {
    this.fetchNames();
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
      setTimeout(() => {
        this.isLoading = false;
      }, 10);
      this.isEdited = false;
    }
  }

  createForm() {
    const requiredFields = [Validators.required, Validators.minLength(3)];

    this.offerForm = new FormGroup({
      polish: new FormGroup({
        title: new FormControl('', requiredFields),
        city: new FormControl('', requiredFields),
        region: new FormControl('', requiredFields),
        country: new FormControl('', requiredFields),
        text: new FormControl('', requiredFields),
      }),
      english: new FormGroup({
        title: new FormControl('', requiredFields),
        city: new FormControl({value: '', disabled: true}, requiredFields),
        region: new FormControl({value: '', disabled: true}, requiredFields),
        country: new FormControl({value: '', disabled: true}, requiredFields),
        text: new FormControl('', requiredFields)
      }),
      german: new FormGroup({
        title: new FormControl('', requiredFields),
        city: new FormControl({value: '', disabled: true}, requiredFields),
        region: new FormControl({value: '', disabled: true}, requiredFields),
        country: new FormControl({value: '', disabled: true}, requiredFields),
        text: new FormControl('', requiredFields)
      }),
      date: new FormControl(0)
    });
  }

  getControl(name: string, prop: string): any {
    return this.offerForm.controls[name]['controls'][prop];
  }

  minError(name: string, prop: string): any {
    const error = this.getControl(name, prop).getError('minlength');
    return {
      required: error.requiredLength,
      actual: error.requiredLength - error.actualLength
    };
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
    this.offerForm.patchValue({ date: Date.now() });

    const { valid } = this.offerForm;
    const title = this.offerForm.value.polish.polishTitle;
    const value = this.offerForm.getRawValue();

    if (valid) {
      this.isSave = true;

      if (this.offerId) {
        this.checkPolandEdit(value, this.editClone)
          .then(() => this.firestoreDAO.updateJobOffer(this.offerId, value))
          .then(() => {
            this.isSave = false;
            this.isEdited = true;
            this.clearOffers(f);
            this.swalO.composeDialog(title, 'Oferta została zaktualizowana pomyślnie', 'success', this.dialogSwal);
          })
          .catch((error) => {
            this.swalO.composeDialog('Błąd', 'Nie można utworzyć oferty', 'error', this.dialogSwal);
            console.error(error);
            this.isSave = false;
          });
      } else {
        this.updateCounter(value, true)
          .then(() => this.firestoreDAO.createJobOffer(value))
          .then(() => {
            this.isSave = false;
            this.isEdited = true;
            this.clearOffers(f);
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
        this.isLoading = true;

        this.updateCounter(data, false)
          .then(() => this.firestoreDAO.deleteJobOffer(data.id))
          .then(() => {
            this.isLoading = false;
            this.swalO.composeDialog(title, 'Usnięto pomyślnie', 'success', this.dialogSwal);
          })
          .catch((error) => {
            this.isLoading = false;
            this.swalO.composeDialog(title, 'Nie można usunąc!!!', 'error', this.dialogSwal);
            console.error(error);
          });
      }
    });
  }

  setCountryRegions(name: string = 'polish') {
    const selectedCountry = this.getControl(name, 'country').value;
    const foundRegions = this._countries.find((country) => country.namePl === selectedCountry || country.nameEn === selectedCountry);
    this.offerForm.patchValue({
      english: { country: foundRegions.nameEn },
      german: { country: foundRegions.nameEn }
    });
    this._regions = foundRegions.regions;
  }

  setRegionCities(name: string = 'polish') {
    const selectedRegion = this.getControl(name, 'region').value;

    this.offerForm.patchValue({
      english: { region: selectedRegion },
      german: { region: selectedRegion }
    });

    if (this.getControl('polish', 'country').value !== 'Polska') {
      this._cities = [];
    } else {
      this._cities = this._poland.find((region) => region.region === selectedRegion).cities;
    }
  }

  setCities() {
    const selectedCity = this.getControl('polish', 'city').value;
    this.offerForm.patchValue({
      english: { city: selectedCity },
      german: { city: selectedCity }
    });
  }

  setData(data?: IJobOffer): void {
    console.log(data);
    this.editClone = cloneDeep(data);
    this.offerId = data.id;
    this.offerForm.patchValue(data);
    this.setCountryRegions();
    this.setRegionCities();
    this.setCities();
  }

  clearOffers(f: NgForm) {
    f.resetForm();
    this.offerId = null;
    this.editClone = null;
    this._cities = null;
    this.selectedTabCountry = 0;
  }

  fetchJobOffers(): void {
    this.$jobOffersSub = this.firestoreDAO.getJobOffers().subscribe((result) => {
      this.jobOffers = result;
      this.isLoading = false;
    });
  }

  async fetchNames() {
    this._countries = await (await fetch(countriesLink)).json();
    this._poland = await (await fetch(polandLink)).json();
  }

  updateCounter(data: any, add: boolean): Promise<void> {
    if (data.polish.country === 'Polska') {
      return new Promise((resolve, reject) => {
        this.$counterSub = this.firestoreDAO.getCounters().subscribe(({ payload }) => {
          const region = data.polish.region;
          const dataToSave = pick(payload.data(), [region, 'total']);

          if (add) {
            dataToSave[region] += 1;
            dataToSave['total'] += 1;
          } else {
            dataToSave[region] -= 1;
            dataToSave['total'] -= 1;
          }
          if (dataToSave[region] < 0) {
            dataToSave[region] = 0;
          }
          if (dataToSave['total'] < 0) {
            dataToSave['total'] = 0;
          }
          if (isNaN(dataToSave[region]) || isNaN(dataToSave['total'])) {
            return reject({ wrongRegion: 'Zła nazwa województwa' });
          }
          this.firestoreDAO.updateCounter(dataToSave).then(resolve).catch(reject);
        });
      });
    }
    return Promise.resolve();
  }

  checkPolandEdit(originalData: IJobOffer, copyData: IJobOffer): Promise<void> {
    const originalCountry = originalData.polish.country;
    const originalRegion = originalData.polish.region;
    const copyCountry = copyData.polish.country;
    const copyRegion = copyData.polish.region;
    if (originalCountry !== 'Polska' && copyCountry !== 'Polska') {
      return Promise.resolve();
    }

    if (originalCountry === copyCountry && originalRegion === copyRegion) {
      return Promise.resolve();
    } else if (originalCountry === 'Polska' && copyCountry !== 'Polska') {
      return this.updateCounter(originalData, true);
    } else if (originalCountry !== 'Polska' && copyCountry === 'Polska') {
      return this.updateCounter(copyData, false);
    } else if (originalCountry === 'Polska' && copyCountry === 'Polska' && originalRegion !== copyRegion) {
      return this.updateCounter(copyData, false).then(() => this.updateCounter(originalData, true));
    } else {
      return Promise.resolve();
    }
  }

  unsubscribeAll() {
    this.$jobOffersSub.unsubscribe();
    if (this.$counterSub) {
      this.$counterSub.unsubscribe();
    }
  }
}
